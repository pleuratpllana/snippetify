// // src/context/ThemeContext.jsx
// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState("light");

//   useEffect(() => {
//     const saved = localStorage.getItem("theme");
//     const prefersDark =
//       window.matchMedia &&
//       window.matchMedia("(prefers-color-scheme: dark)").matches;
//     const initial = saved || (prefersDark ? "dark" : "light");
//     setTheme(initial);
//     document.documentElement.setAttribute("data-theme", initial);
//   }, []);

//   const toggleTheme = useCallback(() => {
//     setTheme((prev) => {
//       const next = prev === "light" ? "dark" : "light";
//       localStorage.setItem("theme", next);
//       document.documentElement.setAttribute("data-theme", next);
//       return next;
//     });
//   }, []);

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);

// export default ThemeContext;
