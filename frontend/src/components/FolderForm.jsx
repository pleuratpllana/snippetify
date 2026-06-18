import { useState, useEffect } from "react";
import Button from "../components/UI/Button";
import InputGroup from "../components/UI/InputGroup";
import { toast } from "react-toastify";
import { useSnippets } from "../context/SnippetContext";

const FolderForm = ({ folder = null, onSubmit, onCancel }) => {
  const { snippets } = useSnippets();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#34d399"); // default folder color
  const [selectedSnippets, setSelectedSnippets] = useState([]);

  // Initialize form fields if editing
  useEffect(() => {
    if (folder) {
      setTitle(folder.title || "");
      setDescription(folder.description || "");
      setColor(folder.color || "#34d399");
      setSelectedSnippets(folder.snippetIds || []);
    }
  }, [folder]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    const newFolder = {
      ...folder,
      title: title.trim(),
      description: description.trim(),
      color,
      snippetIds: selectedSnippets,
    };

    onSubmit(newFolder);

    toast.success(
      folder
        ? `"${title}" updated successfully`
        : `"${title}" added successfully`,
      { className: "toast-success" }
    );
  };

  const handleSnippetToggle = (id) => {
    setSelectedSnippets((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const colors = [
    "#34d399", // green
    "#60a5fa", // blue
    "#f87171", // red
    "#a78bfa", // purple
    "#fbbf24", // yellow
    "#f472b6", // pink
    "#4ade80", // light green
    "#22d3ee", // cyan
  ];

  return (
    <div className="w-full -mt-6 mb-20 lg:mb-0">
      <div className="mb-6 mt-0">
        <h4 className="text-[var(--color-text)]">
          {folder ? "Edit Folder" : "Create a New Folder"}
        </h4>
        <p className="text-sm text-[var(--color-muted)]">
          {folder
            ? "Update the fields below to edit your folder."
            : "Fill out the inputs below to add a new folder."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex-1 p-4 sm:p-6 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg flex flex-col gap-5 sm:gap-6 text-sm"
      >
        <InputGroup
          id="title"
          label="Title"
          placeholder="E.g Project Components"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <InputGroup
          id="description"
          label="Description (optional)"
          placeholder="E.g All reusable components for the project"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Color Picker Section */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[var(--color-text)]">
            Folder Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  color === c
                    ? "border-[var(--color-accent)]"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Snippets Section */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-[var(--color-text)]">
            Add Snippets to Folder
          </label>
          <p className="text-sm text-[var(--color-muted)] mb-2">
            Select existing snippets to include in this folder.
          </p>
          <div className="max-h-64 overflow-y-auto border border-[var(--color-border)] rounded p-2 flex flex-col gap-1">
            {snippets.map((snip) => (
              <label
                key={snip.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-border)] p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedSnippets.includes(snip.id)}
                  onChange={() => handleSnippetToggle(snip.id)}
                  className="accent-[var(--color-accent)]"
                />
                <span className="text-[var(--color-text)]">{snip.title}</span>
              </label>
            ))}
            {snippets.length === 0 && (
              <p className="text-sm text-[var(--color-muted)]">
                No snippets available
              </p>
            )}
          </div>
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
            {folder ? "Update Folder" : "Create Folder"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FolderForm;
