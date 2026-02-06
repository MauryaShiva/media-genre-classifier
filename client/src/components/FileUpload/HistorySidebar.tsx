import React, { useState } from "react";

interface HistorySidebarProps {
  history: any[];
  activeId?: string;
  onSelect: (item: any) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onBulkDownload: () => void; // New Prop
  isOpen: boolean;
  onClose: () => void;
  storageUsage: string;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  activeId,
  onSelect,
  onClear,
  onDelete,
  onExport,
  onBulkDownload,
  isOpen,
  onClose,
  storageUsage,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-80 bg-white dark:bg-[#0f0f0f] border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:h-[calc(100vh-73px)] lg:sticky lg:top-[73px] ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-[#121826] border border-gray-800 rounded-[28px] p-8 max-w-[340px] w-full shadow-2xl animate-slide-down">
              <p className="text-white text-lg font-bold text-center leading-tight mb-8">
                Permanently clear history and delete all saved media files?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-4 bg-[#1f2937] text-gray-400 font-bold rounded-2xl hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onClear();
                    setShowConfirm(false);
                  }}
                  className="flex-1 py-4 bg-[#ff3333] text-white font-bold rounded-2xl shadow-lg shadow-red-500/20"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
          🕒 RECENT ANALYSES
        </h3>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 opacity-30 border-2 border-dashed border-gray-500 rounded-2xl">
              <p className="text-sm italic">Empty History</p>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="group relative">
                <button
                  onClick={() => {
                    onSelect(item);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${activeId === item.id ? "border-violet-500 bg-violet-500/10" : "border-gray-100 dark:border-gray-800 hover:border-violet-500/50 bg-gray-50 dark:bg-[#1a1a1a]/40"}`}
                >
                  <div className="flex justify-between mb-1">
                    <p className="text-[9px] text-gray-500 truncate font-mono max-w-[120px]">
                      {item.filename}
                    </p>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                      SAVED
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
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
            ))
          )}
        </div>

        {/* --- Multi-Function Sidebar Footer --- */}
        <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Storage Status
            </span>
            <span className="text-xs font-mono font-bold text-violet-500">
              {storageUsage}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onExport}
              className="py-2.5 text-[10px] font-black text-violet-400 bg-violet-400/5 border border-violet-400/20 rounded-xl hover:bg-violet-400/10 transition-all uppercase tracking-tighter"
            >
              Export JSON
            </button>
            <button
              onClick={onBulkDownload}
              className="py-2.5 text-[10px] font-black text-emerald-400 bg-emerald-400/5 border border-emerald-400/20 rounded-xl hover:bg-emerald-400/10 transition-all uppercase tracking-tighter"
            >
              Files (ZIP)
            </button>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-3 text-[11px] font-bold text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-colors border border-red-500/10 uppercase tracking-widest"
          >
            Wipe All History
          </button>
        </div>
      </aside>
    </>
  );
};

export default HistorySidebar;
