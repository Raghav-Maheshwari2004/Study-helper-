"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// 1. Define the 3 theme types
type Theme = "light" | "dark" | "tech";

// 2. Define what the Context provides
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => voi;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on load
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    // Remove old classes
    root.classList.remove("light", "dark", "tech");

    // Add new class
    root.classList.add(theme);

    // Tech theme also needs 'dark' features
    if (theme === 'tech') {
      root.classList.add('dark');
    }

    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}