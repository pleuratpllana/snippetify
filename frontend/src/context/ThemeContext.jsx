// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [themeDark, setThemeDark] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Sync theme whenever auth changes
  useEffect(() => {
    if (loading) return;

    if (user) {
      // Load saved theme for authenticated user
      const saved = localStorage.getItem(`themeDark_${user.id}`);
      setThemeDark(saved === "true");
    } else {
      // Guest / new user → always light
      setThemeDark(false);

      // Remove any leftover per-user keys to prevent accidental dark mode
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("themeDark_")) localStorage.removeItem(key);
      });
    }

    setInitialized(true);
  }, [user, loading]);

  // Apply theme to DOM and persist per authenticated user
  useEffect(() => {
    if (!initialized) return;

    document.documentElement.setAttribute(
      "data-theme",
      themeDark ? "dark" : "light"
    );

    if (user) {
      localStorage.setItem(`themeDark_${user.id}`, themeDark);
    }
  }, [themeDark, user, initialized]);

  // Toggle helper
  const toggleTheme = useCallback(() => setThemeDark((prev) => !prev), []);
  const value = useMemo(
    () => ({ themeDark, setThemeDark: toggleTheme }),
    [themeDark, toggleTheme]
  );

  if (!initialized) return null; // prevent FOUC

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
// Usage: wrap your app with <ThemeProvider> in index.jsx or App.jsx
