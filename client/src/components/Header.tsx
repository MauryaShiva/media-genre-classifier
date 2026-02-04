import React from "react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  showCharts: boolean;
  setShowCharts: (v: boolean) => void;
  compactLayout: boolean;
  setCompactLayout: (v: boolean) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (v: boolean) => void;
}

const Toggle = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border
      transition-all duration-200 group
      ${
        value
          ? "bg-violet-600 text-white border-violet-600 shadow-sm"
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-violet-300"
      }
    `}
  >
    <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    <div
      className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-all
        ${value ? "bg-white/30" : "bg-gray-200 dark:bg-gray-700"}
      `}
    >
      <div
        className={`h-3 w-3 rounded-full bg-white shadow-sm transition-transform
          ${value ? "translate-x-4" : "translate-x-0"}
        `}
      />
    </div>
  </button>
);

const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  highContrast,
  setHighContrast,
  showCharts,
  setShowCharts,
  compactLayout,
  setCompactLayout,
  animationsEnabled,
  setAnimationsEnabled,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-black/90 border-b border-gray-200 dark:border-gray-800">
      {/* Container matches the max-w-[1600px] from App.tsx */}
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
        {/* Branding Area */}
        <div className="flex items-center gap-3">
          <div className="bg-violet-600 p-2 rounded-lg">
            <span className="text-xl">📊</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-gray-900 dark:text-white uppercase">
              Genre
              <span className="text-violet-600 underline decoration-2 underline-offset-4">
                Lab
              </span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] leading-none mt-1">
              AI Classification Engine
            </p>
          </div>
        </div>

        {/* Toggles Area - Now Horizontal for better space usage */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex gap-2 border-r border-gray-200 dark:border-gray-800 pr-4 mr-2">
            <Toggle
              label="Dark"
              value={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <Toggle
              label="Contrast"
              value={highContrast}
              onChange={() => setHighContrast(!highContrast)}
            />
          </div>
          <div className="flex gap-2">
            <Toggle
              label="Charts"
              value={showCharts}
              onChange={() => setShowCharts(!showCharts)}
            />
            <Toggle
              label="Compact"
              value={compactLayout}
              onChange={() => setCompactLayout(!compactLayout)}
            />
            <Toggle
              label="Motion"
              value={animationsEnabled}
              onChange={() => setAnimationsEnabled(!animationsEnabled)}
            />
          </div>
        </div>

        {/* Mobile View - Just a settings icon or simplified text for now */}
        <div className="lg:hidden flex items-center">
          <span className="text-xs font-bold text-violet-600 bg-violet-50 dark:bg-violet-900/30 px-2 py-1 rounded">
            V1.0 Stable
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
