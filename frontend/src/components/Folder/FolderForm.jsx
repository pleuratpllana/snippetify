// components/folders/FolderForm.jsx
import { useState, useEffect } from "react";
import InputGroup from "../UI/InputGroup";
import Button from "../UI/Button";
import { toast } from "react-toastify";

const COLORS = [
  "#F87171", // red
  "#FBBF24", // yellow
  "#34D399", // green
  "#60A5FA", // blue
  "#A78BFA", // purple
  "#F472B6", // pink
  "#FCD34D", // amber
];

const FolderForm = ({ folder = null, snippets = [], onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [selectedSnippets, setSelectedSnippets] = useState([]);

  useEffect(() => {
    if (folder) {
      setName(folder.name || "");
      setDescription(folder.description || "");
      setColor(folder.color || COLORS[0]);
      setSelectedSnippets(folder.snippetIds || []);
    }
  }, [folder]);

  const toggleSnippet = (id) => {
    setSelectedSnippets((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Folder name is required");
      return;
    }

    const newFolder = {
      ...folder,
      name: name.trim(),
      description: description.trim(),
      color,
      snippetIds: selectedSnippets,
      createdAt: folder?.createdAt || new Date().toISOString(),
    };

    onSubmit(newFolder);
    toast.success(folder ? "Folder updated" : "Folder created", {
      className: "toast-success",
    });
  };

  return (
    <div className="w-full mb-6">
      <h4 className="text-[var(--color-text)]">
        {folder ? "Edit Folder" : "Create a New Folder"}
      </h4>
      <p className="text-sm text-[var(--color-muted)] mb-4">
        {folder
          ? "Update the fields below to edit your folder."
          : "Fill out the inputs below to add a new folder."}
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4 sm:p-6 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg"
      >
        {/* Name */}
        <InputGroup
          id="name"
          label="Folder Name"
          placeholder="E.g. React Components"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Description */}
        <InputGroup
          id="description"
          label="Description (optional)"
          placeholder="E.g. Commonly used reusable components"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Color Picker */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[var(--color-text)] text-sm sm:text-base">
            Folder Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${
                  color === c
                    ? "border-[var(--color-text)]"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        {/* Snippet Selector */}
        {snippets.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[var(--color-text)] text-sm sm:text-base">
              Assign Snippets
            </label>
            <div className="flex gap-2 flex-wrap">
              {snippets.map((snippet) => (
                <button
                  key={snippet.id}
                  type="button"
                  className={`px-3 py-1 rounded-full border ${
                    selectedSnippets.includes(snippet.id)
                      ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                      : "bg-transparent border-[var(--color-border)] text-[var(--color-text)]"
                  }`}
                  onClick={() => toggleSnippet(snippet.id)}
                >
                  {snippet.title || snippet.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full max-w-lg">
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
            {folder ? "Update Folder" : "Create Folder"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FolderForm;
