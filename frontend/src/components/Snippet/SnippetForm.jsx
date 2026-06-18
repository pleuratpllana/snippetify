import { useState, useEffect } from "react";
import CustomDropdown from "../../components/UI/CustomDropdown";
import Button from "../../components/UI/Button";
import InputGroup from "../../components/UI/InputGroup";
import { toast } from "react-toastify";

const SnippetForm = ({ snippet = null, onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [codeContent, setCodeContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [language, setLanguage] = useState("javascript");

  // Language map: display name → stored value
  const languageMap = {
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
    F: "fsharp",
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

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title || "");
      setSubtitle(snippet.subtitle || "");
      setCodeContent(snippet.codeContent || "");
      setTags(snippet.tags || []);
      setLanguage(snippet.language || "javascript");
    }
  }, [snippet]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !codeContent.trim()) {
      alert("Title and code content are required");
      return;
    }

    const newSnippet = {
      ...snippet,
      title: title.trim(),
      subtitle: subtitle.trim(),
      codeContent: codeContent.trim(),
      tags,
      language,
      createdAt: snippet?.createdAt || new Date().toISOString(),
      usageCount: snippet?.usageCount || 0,
      isStarred: snippet?.isStarred || false,
    };

    onSubmit(newSnippet);

    toast.success(
      snippet
        ? `"${title}" updated successfully`
        : `"${title}" added successfully`,
      { className: "toast-success" }
    );
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="w-full -mt-6 mb-20 lg:mb-0">
      <div className="mb-6 mt-0">
        <h4 className="text-[var(--color-text)]">
          {snippet ? "Edit Snippet" : "Create a New Snippet"}
        </h4>
        <p className="text-sm text-[var(--color-muted)]">
          {snippet
            ? "Update the fields below to edit your snippet."
            : "Fill out the inputs below to add a new snippet to your collection."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex-1 p-4 sm:p-6 bg-[(var--color-bg)] border border-[var(--color-border)] rounded-lg flex flex-col gap-5 sm:gap-6 text-sm"
      >
        <InputGroup
          id="title"
          label="Title"
          placeholder="E.g Redux - State Management"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <InputGroup
          id="subtitle"
          label="Description (optional)"
          placeholder="E.g - This code snippet does..."
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label
            htmlFor="codeContent"
            className="font-semibold text-[var(--color-text)] text-sm sm:text-base"
          >
            Code
          </label>
          <textarea
            id="codeContent"
            placeholder="Write your code here"
            value={codeContent}
            onChange={(e) => setCodeContent(e.target.value)}
            rows={8}
            className="p-2 sm:p-3 border border-[var(--color-border)] rounded font-mono text-xs sm:text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-lightaccent)]"
            required
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col">
          <label className="font-semibold text-[var(--color-text)] text-sm sm:text-base mb-2">
            Tags / Frameworks
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center bg-[var(--color-superlightaccent)] text-xs px-2 sm:px-3 py-1 rounded-full gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="bg-transparent text-gray-500 hover:text-red-600 p-0"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Eg - UI/UX, Performance, Speed Optimization"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-1 p-2 sm:p-3 border border-[var(--color-border)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lightaccent)]"
            />
            <Button
              type="button"
              onClick={addTag}
              className="px-3 sm:px-4 py-2 rounded flex-shrink-0"
            >
              +
            </Button>
          </div>
        </div>

        {/* Language Dropdown */}
        <div className="flex flex-col gap-1 w-full relative">
          <label
            htmlFor="language"
            className="font-semibold text-[var(--color-text)] text-sm sm:text-base mb-1"
          >
            Language
          </label>
          <CustomDropdown
            id="language"
            options={Object.keys(languageMap)} // display names
            value={
              Object.keys(languageMap).find(
                (key) => languageMap[key] === language
              ) || "JavaScript"
            } // show current selection
            onChange={(value) =>
              setLanguage(languageMap[value] || "javascript")
            }
            className="w-full"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-row sm:flex-col lg:flex-row gap-2 mt-2 w-full  sm:max-w-sm">
  {onCancel && (
    <Button
      type="button"
      onClick={onCancel}
      className="button-outlined w-full"
      centerContent
    >
      Cancel
    </Button>
  )}
  <Button type="submit" className="button w-full" centerContent>
    {snippet ? "Update Snippet" : "Create Snippet"}
  </Button>
</div>

      </form>
    </div>
  );
};

export default SnippetForm;
