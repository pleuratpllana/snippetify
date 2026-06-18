// context/SnippetFilterContext.jsx
import { createContext, useContext, useState, useMemo } from "react";

const SnippetFilterContext = createContext();

const languageMap = {
  All: "all",
  Assembly: "asm",
  Bash: "bash",
  C: "c",
  "C++": "cpp",
  "C#": "csharp",
  Clojure: "clojure",
  COBOL: "cobol",
  Dart: "dart",
  Elixir: "elixir",
  Erlang: "erlang",
  Fsharp: "fsharp",
  Fortran: "fortran",
  Go: "go",
  Haskell: "haskell",
  HTML: "html",
  Java: "java",
  JavaScript: "javascript",
  Kotlin: "kotlin",
  Lisp: "lisp",
  Lua: "lua",
  MATLAB: "matlab",
  "Objective-C": "objectivec",
  Perl: "perl",
  PHP: "php",
  Python: "python",
  R: "r",
  Ruby: "ruby",
  Rust: "rust",
  Scala: "scala",
  Shell: "shell",
  SQL: "sql",
  Swift: "swift",
  TypeScript: "typescript",
  "Visual Basic": "vbnet",
  WebAssembly: "wasm",
  XML: "xml",
  YAML: "yaml",
};

export const SnippetFilterProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("viewMode") || "grid"
  );

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem("viewMode", mode);
  };

  const value = useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      languageFilter,
      setLanguageFilter,
      viewMode,
      handleSetViewMode,
      languageMap,
    }),
    [searchTerm, languageFilter, viewMode]
  );

  return (
    <SnippetFilterContext.Provider value={value}>
      {children}
    </SnippetFilterContext.Provider>
  );
};

export const useSnippetFilter = () => useContext(SnippetFilterContext);
