// // src/components/ThemeToggle.jsx
// import React from "react";
// // Assuming useTheme is imported from your context file
// import { useTheme } from "../context/ThemeContext";

// const SunIcon = (props) => (
//   <svg
//     {...props}
//     xmlns="http://www.w3.org/2000/svg"
//     width="20"
//     height="20"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <circle cx="12" cy="12" r="4" />
//     <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
//   </svg>
// );

// const MoonIcon = (props) => (
//   <svg
//     {...props}
//     xmlns="http://www.w3.org/2000/svg"
//     width="20"
//     height="20"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />
//   </svg>
// );

// const ThemeToggle = () => {
//   const { theme, toggleTheme } = useTheme();
//   const isDark = theme === "dark";

//   return (
//     <button
//       onClick={toggleTheme}
//       className="
//         relative inline-flex items-center h-8 w-16 rounded-full cursor-pointer
//         p-1 transition-colors duration-300 ease-in-out shadow-inner
//         border theme-border bg-gray-200 dark:bg-gray-800
//       "
//       aria-checked={isDark}
//       role="switch"
//       aria-label={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
//     >
//       {/* Track Background */}
//       <span
//         aria-hidden="true"
//         className={`
//           absolute inset-0 rounded-full
//           transition-colors duration-300
//           ${isDark ? "bg-gray-700" : "bg-gray-300"}
//         `}
//       />

//       {/* Slider / Thumb with Icons */}
//       <span
//         aria-hidden="true"
//         className={`
//           relative flex items-center justify-center h-6 w-6 rounded-full
//           theme-accent-bg theme-accent-text shadow-lg transform
//           transition-transform duration-300 ease-in-out
//         `}
//         // This style line is key for the smooth, controlled movement:
//         style={{
//           transform: isDark ? "translateX(34px)" : "translateX(0)",
//         }}
//       >
//         {/* Toggle Icon */}
//         {isDark ? (
//           <MoonIcon className="text-gray-900" />
//         ) : (
//           <SunIcon className="text-gray-900" />
//         )}
//       </span>

//       {/* Full-width Icon Labels (Help provide context on the track) */}
//       <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none">
//         <SunIcon
//           className={`text-gray-500 transition-opacity ${
//             isDark ? "opacity-0" : "opacity-100"
//           }`}
//         />
//         <MoonIcon
//           className={`text-gray-500 transition-opacity ${
//             isDark ? "opacity-100" : "opacity-0"
//           }`}
//         />
//       </div>
//     </button>
//   );
// };

// export default ThemeToggle;
