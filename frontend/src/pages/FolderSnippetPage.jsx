// pages/FolderSnippetsPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFolders } from "../context/FolderContext";
import { useSnippets } from "../context/SnippetContext";
import { useSnippetFilter } from "../context/SnippetFilterContext";
import Listings from "../components/shared/Listings";
import Button from "../components/UI/Button";
import SearchInput from "../components/UI/SearchInput";
import CustomDropdown from "../components/UI/CustomDropdown";
import { LayoutGrid, ListIcon } from "lucide-react";

const FolderSnippetsPage = () => {
  const { id } = useParams();
  const folderId = id;
  const navigate = useNavigate();

  const { folders } = useFolders();
  const { snippets, deleteSnippet, toggleStar } = useSnippets();
  const {
    searchTerm,
    setSearchTerm,
    languageFilter,
    setLanguageFilter,
    viewMode,
    handleSetViewMode,
    languageMap,
  } = useSnippetFilter();

  // Find the folder
  const folder = useMemo(
    () => folders.find((f) => String(f.id) === String(folderId)),
    [folders, folderId]
  );

  // Snippets in folder
  const folderSnippets = useMemo(() => {
    if (!folder?.snippetIds) return [];
    const folderSnippetIds = new Set(folder.snippetIds.map(String));
    return snippets.filter((s) =>
      folderSnippetIds.has(String(s.id))
    );
  }, [snippets, folder]);

  // Filtered + searched snippets
  const displayedSnippets = useMemo(() => {
    let filtered = [...folderSnippets];
    const normalizedSearchTerm = searchTerm.toLowerCase();

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(normalizedSearchTerm) ||
          s.subtitle.toLowerCase().includes(normalizedSearchTerm) ||
          s.tags.some((tag) =>
            tag.toLowerCase().includes(normalizedSearchTerm)
          )
      );
    }

    if (languageFilter && languageFilter !== "All") {
      const langValue = languageMap[languageFilter];
      filtered = filtered.filter((s) => s.language === langValue);
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [folderSnippets, searchTerm, languageFilter, languageMap]);

  if (!folder) {
    return (
      <div className="p-6 text-[var(--color-text)]">
        <p>Folder not found.</p>
        <div className="w-full flex justify-start mt-4">
          <button
            onClick={() => navigate("/folders")}
            className="hyperlink-button bg-transparent"
          >
            ← Return to Folders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Return to Folders button */}
      <div className="w-full flex justify-start mb-4">
        <button
          onClick={() => navigate("/folders")}
          className="hyperlink-button bg-transparent"
        >
          ← Return to Folders
        </button>
      </div>

      {/* Folder header */}
      <div className="flex justify-between items-center w-full mb-4">
        <div>
          <h4 className="text-[var(--color-text)] font-semibold">
            {folder.title}
          </h4>
          {folder.description && (
            <p className="text-sm text-[var(--color-muted)]">
              {folder.description}
            </p>
          )}
          <p className="text-xs text-[var(--color-muted)] mt-1">
            {folderSnippets.length} snippet{folderSnippets.length !== 1 && "s"}
          </p>
        </div>
      </div>

      {/* Search + Language Filter + View Toggle */}
      <div className="grid grid-cols-12 gap-4 w-full mb-6 items-end">
        <div className="col-span-12 sm:col-span-12 md:col-span-5 lg:col-span-4">
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </div>
        <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
          <CustomDropdown
            options={Object.keys(languageMap)}
            value={languageFilter}
            onChange={setLanguageFilter}
            label="Filter by Language"
            className="ml-0"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-5 flex items-center gap-4">
          <div className="hidden lg:flex flex-col gap-1 -mt-1">
            <span className="text-sm mb-1">View by:</span>
            <div className="flex gap-2">
              {["grid", "list"].map((mode) => (
                <Button
                  key={mode}
                  onClick={() => handleSetViewMode(mode)}
                  className={`p-2.5 button ${
                    viewMode === mode
                      ? "bg-[var(--color-accent)]"
                      : "bg-[var(--color-superlightbg)] text-[var(--color-text)]"
                  }`}
                  aria-label={`${
                    mode.charAt(0).toUpperCase() + mode.slice(1)
                  } View`}
                >
                  {mode === "grid" ? (
                    <LayoutGrid className="w-4 h-4" />
                  ) : (
                    <ListIcon className="w-4 h-4" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Snippets Listing */}
      {displayedSnippets.length > 0 ? (
        <Listings
          items={displayedSnippets}
          type="snippet"
          onDelete={(snippetId) => deleteSnippet(snippetId, folderId)}
          onToggleStar={toggleStar}
          viewMode={viewMode}
        />
      ) : (
        <div className="p-10 text-center border border-dashed border-[var(--color-muted)] rounded bg-[var(--color-bg)]">
          <p className="text-[var(--color-text)] mb-2">
            {searchTerm
              ? `No snippets found for "${searchTerm}"`
              : languageFilter !== "All"
              ? `No snippets found for "${languageFilter}"`
              : "This folder has no snippets yet."}
          </p>
          <Button
            onClick={() => navigate("/snippet/new")}
            centerContent
            className="button-outlined justify-center mx-auto"
          >
            Add New Snippet
          </Button>
        </div>
      )}
    </div>
  );
};

export default FolderSnippetsPage;
