import React, { useState, useEffect } from "react";

/* ---------- Props ---------- */
interface FileUploadProps {
  showCharts: boolean;
  animationsEnabled: boolean;
}

interface HistoryItem {
  id: string;
  filename: string;
  genre: string;
  confidence: number;
  top_3_genres: any[];
  has_audio: boolean;
  timestamp: number;
}

/* ---------- Colors ---------- */
const COLORS = ["#4C1D95", "#6D28D9", "#8B5CF6"];

const FileUpload: React.FC<FileUploadProps> = ({
  showCharts,
  animationsEnabled,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from LocalStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("genre_history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const addToHistory = (data: any) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      filename: data.filename,
      genre: data.genre,
      confidence: data.confidence,
      top_3_genres: data.top_3_genres || [],
      has_audio: data.has_audio,
      timestamp: Date.now(),
    };

    const updatedHistory = [newItem, ...history].slice(0, 10); // Keep last 10
    setHistory(updatedHistory);
    localStorage.setItem("genre_history", JSON.stringify(updatedHistory));
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select a media file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("media_file", selectedFile);

    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/classify-media`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to classify media.");
      }

      setResult(data);
      if (data.genre || data.has_audio === false) {
        addToHistory(data);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong on the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const noAudioDetected = result && result.has_audio === false;

  /* ---------- Donut Chart ---------- */
  const renderDonutChart = () => {
    const data = result?.top_3_genres || [];
    const radius = 70;
    const strokeWidth = 18;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
      <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden>
        <g transform="translate(100,100) rotate(-90)">
          <circle
            r={radius}
            cx="0"
            cy="0"
            fill="transparent"
            stroke="#eef2ff"
            strokeWidth={strokeWidth}
          />
          {data.map((item: any, index: number) => {
            const pct = Math.max(0, Math.min(1, item.confidence || 0));
            const dash = pct * circumference;
            const circle = (
              <circle
                key={item.genre}
                r={radius}
                cx="0"
                cy="0"
                fill="transparent"
                stroke={COLORS[index] ?? COLORS[2]}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className={
                  animationsEnabled ? "transition-all duration-700" : ""
                }
              />
            );
            offset += dash;
            return circle;
          })}
        </g>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontWeight: 700, fill: "#4C1D95", fontSize: 18 }}
        >
          Top 3
        </text>
      </svg>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-black transition-colors">
      {/* ---------- LEFT SIDEBAR: History (Now Sticky) ---------- */}
      <aside
        className="w-full lg:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 
                   lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] overflow-y-auto"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
          <span>🕒</span> Recent History
        </h3>

        {history.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            No recent classifications yet.
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => setResult(item)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  result?.id === item.id
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                    : "border-gray-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 bg-gray-50 dark:bg-gray-800/50"
                }`}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
                  {item.filename}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-bold text-gray-900 dark:text-white capitalize">
                    {item.genre || "No Audio"}
                  </span>
                  <span className="text-xs font-bold text-violet-600">
                    {Math.round(item.confidence * 100)}%
                  </span>
                </div>
              </button>
            ))}
            <button
              onClick={() => {
                setHistory([]);
                localStorage.removeItem("genre_history");
              }}
              className="w-full mt-4 text-xs text-red-500 hover:underline"
            >
              Clear History
            </button>
          </div>
        )}
      </aside>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="flex-1 p-8">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-3xl mx-auto transition-colors">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Media Genre Classifier
          </h2>

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-violet-500 transition-colors">
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 dark:text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-white file:text-violet-700
                hover:file:bg-violet-50 cursor-pointer"
            />
            {selectedFile && (
              <p className="text-gray-700 dark:text-gray-300 mt-4 break-all">
                <span className="font-semibold">Selected:</span>{" "}
                {selectedFile.name}
              </p>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !selectedFile}
              className={`w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-violet-700
                hover:from-violet-700 hover:to-violet-800 text-white font-semibold
                rounded-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-sm
                ${animationsEnabled ? "transition-all duration-200" : ""}
              `}
            >
              {isLoading ? "Analyzing Media..." : "Classify Genre"}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-700 text-center rounded">
              {error}
            </div>
          )}

          {result && (
            <div
              className={`mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${animationsEnabled ? "animate-in fade-in slide-in-from-bottom-4 duration-500" : ""}`}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Classification Result
              </h3>
              <p className="text-gray-800 dark:text-gray-300 mb-4">
                <span className="font-semibold">File:</span> {result.filename}
              </p>

              {noAudioDetected ? (
                <div className="text-center py-6 px-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-violet-300">
                  <p className="text-3xl mb-2">🎧</p>
                  <h4 className="text-lg font-bold mb-2">No Audio Detected</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    This video does not contain sound.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Detected Genre
                      </div>
                      <div className="text-2xl font-extrabold capitalize">
                        {result.genre}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Confidence
                      </div>
                      <div className="text-xl font-bold text-violet-700">
                        {Math.round(result.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                  {showCharts && result.top_3_genres && (
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div>{renderDonutChart()}</div>
                      <div className="w-full md:w-2/3 space-y-3">
                        {result.top_3_genres.map((item: any, index: number) => (
                          <div
                            key={item.genre}
                            className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border dark:border-gray-700 flex justify-between items-center"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index] }}
                              />
                              <span className="capitalize font-medium text-gray-900 dark:text-gray-100">
                                {index + 1}. {item.genre}
                              </span>
                            </div>
                            <span className="font-semibold text-violet-700">
                              {Math.round(item.confidence * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
