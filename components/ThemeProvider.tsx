"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "retro" | "professional" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("retro");

  useEffect(() => {
    const savedTheme = localStorage.getItem("kanban-theme") as Theme;
    if (savedTheme && ["retro", "professional", "light"].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kanban-theme", theme);
    
    // Remove all theme classes
    document.documentElement.classList.remove("theme-retro", "theme-professional", "theme-light");
    // Add current theme class
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
