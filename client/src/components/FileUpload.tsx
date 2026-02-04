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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // New state for player
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

  // Handle Preview URL creation and cleanup
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    // Cleanup to prevent memory leaks
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

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
    const updatedHistory = [newItem, ...history].slice(0, 10);
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
      const response = await fetch(apiUrl, { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to classify.");
      setResult(data);
      if (data.genre || data.has_audio === false) addToHistory(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
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
            className="dark:stroke-gray-800"
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
                  animationsEnabled
                    ? "transition-all duration-700 ease-out"
                    : ""
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
          className="font-bold fill-violet-700 dark:fill-violet-400"
          style={{ fontSize: 18 }}
        >
          Top 3
        </text>
      </svg>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-transparent transition-colors duration-500">
      {/* ---------- CUSTOM ANIMATIONS ---------- */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* ---------- LEFT SIDEBAR: History ---------- */}
      <aside
        className="w-full lg:w-80 bg-white dark:bg-[#0f0f0f] border-r border-gray-200 dark:border-gray-800 p-6 
                   lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] overflow-y-auto transition-colors duration-500"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
          <span className="text-violet-600 dark:text-violet-400">🕒</span>{" "}
          Recent History
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
                className={`w-full text-left p-3 rounded-xl border transition-all duration-300 ${
                  result?.id === item.id
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30"
                    : "border-gray-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-600 bg-gray-50 dark:bg-gray-800/40"
                }`}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
                  {item.filename}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-bold text-gray-900 dark:text-gray-100 capitalize">
                    {item.genre || "No Audio"}
                  </span>
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                    {Math.round(item.confidence * 100)}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="flex-1 p-8">
        <div className="bg-white dark:bg-[#121212] p-8 rounded-2xl shadow-xl w-full max-w-3xl mx-auto border border-transparent dark:border-gray-800 transition-all duration-500">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 text-center tracking-tight">
            Media Genre Classifier
          </h2>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-violet-500 dark:hover:border-violet-500 transition-all bg-gray-50 dark:bg-gray-900/20">
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 dark:text-gray-300
                file:mr-4 file:py-2 file:px-6
                file:rounded-full file:border-0
                file:text-sm file:font-bold
                file:bg-violet-600 file:text-white
                hover:file:bg-violet-700 cursor-pointer shadow-md transition-all"
            />
          </div>

          {/* ---------- MEDIA PREVIEW PLAYER ---------- */}
          {selectedFile && previewUrl && (
            <div
              className={`mt-6 p-5 bg-violet-50 dark:bg-gray-900/40 rounded-xl border border-violet-100 dark:border-gray-800 ${animationsEnabled ? "animate-fade-in" : ""}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-widest">
                  Media Preview
                </span>
                <span className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">
                  {selectedFile.name}
                </span>
              </div>

              <div className="overflow-hidden rounded-lg shadow-inner bg-black/5 dark:bg-black/20">
                {selectedFile.type.startsWith("video/") ? (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full max-h-[300px] object-contain"
                  />
                ) : (
                  <div className="p-4 flex flex-col items-center">
                    <span className="text-4xl mb-2">🎵</span>
                    <audio src={previewUrl} controls className="w-full" />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !selectedFile}
              className={`w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-violet-800
                hover:from-violet-700 hover:to-violet-900 text-white font-bold
                rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                ${animationsEnabled ? "hover:scale-[1.01] active:scale-[0.98] transition-all" : ""}
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Classify Genre"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 text-red-700 dark:text-red-400 text-center rounded-lg animate-fade-in">
              {error}
            </div>
          )}

          {/* Result Section */}
          {result && (
            <div
              className={`mt-10 p-8 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl ${animationsEnabled ? "animate-slide-up" : ""}`}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center justify-between">
                <span>Classification Result</span>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  {result.filename}
                </span>
              </h3>

              {noAudioDetected ? (
                <div className="text-center py-10 px-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-violet-300 dark:border-violet-700">
                  <p className="text-5xl mb-4">🎧</p>
                  <h4 className="text-xl font-bold mb-2 dark:text-white">
                    No Audio Detected
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    This file does not contain sound.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8 pb-6 border-b dark:border-gray-800">
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                        Genre
                      </div>
                      <div className="text-4xl font-black text-violet-700 dark:text-violet-400 capitalize">
                        {result.genre}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                        Confidence
                      </div>
                      <div className="text-2xl font-bold dark:text-white">
                        {Math.round(result.confidence * 100)}%
                      </div>
                    </div>
                  </div>

                  {showCharts && result.top_3_genres && (
                    <div className="flex flex-col md:flex-row items-center gap-10">
                      <div
                        className={`${animationsEnabled ? "hover:scale-105 transition-transform" : ""}`}
                      >
                        {renderDonutChart()}
                      </div>
                      <div className="w-full md:w-2/3 space-y-4">
                        {result.top_3_genres.map((item: any, index: number) => (
                          <div
                            key={item.genre}
                            className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border dark:border-gray-800 flex justify-between items-center group hover:border-violet-400 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <span
                                className="w-4 h-4 rounded-full shadow-sm"
                                style={{ backgroundColor: COLORS[index] }}
                              />
                              <span className="capitalize font-bold text-gray-700 dark:text-gray-300">
                                {index + 1}. {item.genre}
                              </span>
                            </div>
                            <span className="font-black text-violet-700 dark:text-violet-400">
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
