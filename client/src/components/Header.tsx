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
    className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-full border
      transition-all duration-300
      ${
        value
          ? "bg-violet-600 text-white border-violet-600"
          : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
      }
    `}
  >
    <span className="text-sm font-medium">{label}</span>
    <span
      className={`w-10 h-5 flex items-center rounded-full p-1 transition-all
        ${value ? "bg-white/30" : "bg-gray-300 dark:bg-gray-700"}
      `}
    >
      <span
        className={`h-3 w-3 rounded-full bg-white transition-transform
          ${value ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </span>
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
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3">
        <h1 className="text-xl font-bold tracking-tight">
          🎵 Media Genre Classifier 🎬
        </h1>

        <div className="flex flex-wrap gap-2">
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
    </header>
  );
};

export default Header;
