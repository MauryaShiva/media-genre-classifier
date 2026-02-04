import { useEffect, useState } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";

/* ---------- localStorage helpers ---------- */
const getStoredBoolean = (key: string, defaultValue: boolean) => {
  const stored = localStorage.getItem(key);
  return stored === null ? defaultValue : stored === "true";
};

function App() {
  /* ---------- UI Preferences (persisted) ---------- */
  const [darkMode, setDarkMode] = useState(() =>
    getStoredBoolean("ui:darkMode", false),
  );
  const [highContrast, setHighContrast] = useState(() =>
    getStoredBoolean("ui:highContrast", false),
  );
  const [showCharts, setShowCharts] = useState(() =>
    getStoredBoolean("ui:showCharts", true),
  );
  const [compactLayout, setCompactLayout] = useState(() =>
    getStoredBoolean("ui:compactLayout", false),
  );
  const [animationsEnabled, setAnimationsEnabled] = useState(() =>
    getStoredBoolean("ui:animationsEnabled", true),
  );

  /* ---------- Apply dark mode ---------- */
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");

    localStorage.setItem("ui:darkMode", String(darkMode));
  }, [darkMode]);

  /* ---------- Apply high contrast ---------- */
  useEffect(() => {
    const html = document.documentElement;
    if (highContrast) html.classList.add("high-contrast");
    else html.classList.remove("high-contrast");

    localStorage.setItem("ui:highContrast", String(highContrast));
  }, [highContrast]);

  /* ---------- Persist other toggles ---------- */
  useEffect(() => {
    localStorage.setItem("ui:showCharts", String(showCharts));
  }, [showCharts]);

  useEffect(() => {
    localStorage.setItem("ui:compactLayout", String(compactLayout));
  }, [compactLayout]);

  useEffect(() => {
    localStorage.setItem("ui:animationsEnabled", String(animationsEnabled));
  }, [animationsEnabled]);

  return (
    <div
      className={`min-h-screen 
        bg-gray-100 text-gray-900
        dark:bg-black dark:text-gray-100
        ${compactLayout ? "text-sm" : "text-base"}
        /* Removed transition-all from root to prevent layout jitter */
      `}
    >
      {/* Fixed/Sticky Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        showCharts={showCharts}
        setShowCharts={setShowCharts}
        compactLayout={compactLayout}
        setCompactLayout={setCompactLayout}
        animationsEnabled={animationsEnabled}
        setAnimationsEnabled={setAnimationsEnabled}
      />

      {/* IMPORTANT FIX: 
          1. Removed 'transition-all' from <main>. 
          Layout-affecting transitions on parent containers break 'sticky' positioning.
          2. Container is now full-width to accommodate the Sidebar flow.
      */}
      <main className="mx-auto w-full max-w-[1600px]">
        <FileUpload
          showCharts={showCharts}
          animationsEnabled={animationsEnabled}
        />
      </main>
    </div>
  );
}

export default App;
