import React, { useState } from "react";

interface HistorySidebarProps {
  history: any[];
  activeId?: string;
  onSelect: (item: any) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  activeId,
  onSelect,
  onClear,
  onDelete,
  isOpen,
  onClose,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {/* --- Mobile Backdrop --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-[70] w-80 bg-white dark:bg-[#0f0f0f] border-r border-gray-200 dark:border-gray-800 p-6 
        transition-transform duration-300 lg:translate-x-0 lg:h-[calc(100vh-73px)] lg:sticky lg:top-[73px]
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* --- Confirmation Modal (Exact UI from your image) --- */}
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-[#121826] border border-gray-800 rounded-[28px] p-8 max-w-[340px] w-full shadow-2xl animate-slide-down">
              <p className="text-white text-lg font-bold text-center leading-tight mb-8">
                Are you sure you want to clear all history? This action cannot
                be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-4 bg-[#1f2937] text-gray-400 font-bold rounded-2xl hover:bg-[#2d3748] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onClear();
                    setShowConfirm(false);
                  }}
                  className="flex-1 py-4 bg-[#ff3333] text-white font-bold rounded-2xl hover:bg-[#e62e2e] shadow-lg shadow-red-500/20 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
          <span className="text-violet-500">🕒</span> Recent History
        </h3>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <span className="text-3xl mb-2 opacity-20">📁</span>
            <p className="text-gray-500 text-sm italic">
              No classifications found.
            </p>
          </div>
        ) : (
          <div className="space-y-3 h-[calc(100%-120px)] overflow-y-auto pr-2 custom-scrollbar">
            {history.map((item) => (
              <div key={item.id} className="group relative">
                <button
                  onClick={() => {
                    onSelect(item);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                    activeId === item.id
                      ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/5"
                      : "border-gray-100 dark:border-gray-800 hover:border-violet-500/50 bg-gray-50 dark:bg-[#1a1a1a]/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] text-gray-500 truncate font-mono max-w-[140px]">
                      {item.filename}
                    </p>
                    {/* Media Badge: Shows user that the file is stored locally */}
                    <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold uppercase tracking-tighter">
                      Media Saved
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-900 dark:text-gray-100 capitalize">
                      {item.genre || "N/A"}
                    </span>
                    <span className="text-xs font-bold text-violet-500">
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                </button>

                {/* Individual Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))}

            <button
              onClick={() => setShowConfirm(true)}
              className="w-full mt-6 py-3 text-xs font-bold text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all"
            >
              Clear All History
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default HistorySidebar;
