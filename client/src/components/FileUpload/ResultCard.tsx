import React from "react";
import DonutChart from "./DonutChart";

const COLORS = ["#4C1D95", "#6D28D9", "#8B5CF6"];

interface ResultCardProps {
  result: any;
  noAudioDetected: boolean;
  showCharts: boolean;
  animationsEnabled: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({
  result,
  noAudioDetected,
  showCharts,
  animationsEnabled,
}) => {
  return (
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
            This file does not contain a valid audio stream.
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
                <DonutChart
                  data={result.top_3_genres}
                  animationsEnabled={animationsEnabled}
                />
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
  );
};

export default ResultCard;
