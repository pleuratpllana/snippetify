import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnippets } from "../context/SnippetContext";
import { useSnippetFilter } from "../context/SnippetFilterContext";
import { CodeBracketIcon, PlusIcon } from "@heroicons/react/24/outline";
import { LayoutGrid, ListIcon } from "lucide-react";
import Listings from "../components/shared/Listings";
// import SortFilteredButton from "../components/SortFilterButton";
import SearchInput from "../components/UI/SearchInput";
import CustomDropdown from "../components/UI/CustomDropdown";
import Button from "../components/UI/Button";
import DeleteAllButton from "../components/shared/DeleteAllButton";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { snippets, deleteSnippet, toggleStar, setSnippets, incrementUsage } =
    useSnippets();
  const {
    searchTerm,
    setSearchTerm,
    languageFilter,
    setLanguageFilter,
    viewMode,
    handleSetViewMode,
    languageMap,
  } = useSnippetFilter(); // context-driven

  const searchParams = new URLSearchParams(location.search);
  const queryFilter = searchParams.get("filter");
  const [activeFilter, setActiveFilter] = useState(
    queryFilter === "favorites" ? "favorites" : "snippets"
  );
  // const [sortBy, setSortBy] = useState("Recently Added");
  const [visibleCount, setVisibleCount] = useState(9);
  const observerRef = useRef(null);
  // const sortOptions = ["A-Z", "Oldest", "Newest"];
  // const [customOrderActive, setCustomOrderActive] = useState(true);

  useEffect(() => {
    setActiveFilter(queryFilter === "favorites" ? "favorites" : "snippets");
  }, [queryFilter]);

  const favoriteCount = useMemo(
    () => snippets.filter((s) => s.isStarred).length,
    [snippets]
  );

  const copyItem = useCallback(
    (item) => {
      navigator.clipboard.writeText(item.codeContent).catch(() => {});
      incrementUsage(item.id);
    },
    [incrementUsage]
  );

  const updateItem = useCallback(
    (id, newTitle, newSubtitle) =>
      setSnippets((s) =>
        s.map((sn) =>
          sn.id === id ? { ...sn, title: newTitle, subtitle: newSubtitle } : sn
        )
      ),
    [setSnippets]
  );

  const handleToggleStar = useCallback((id) => toggleStar(id), [toggleStar]);

  const displayedItems = useMemo(() => {
    const normalizedSearchTerm = searchTerm.toLowerCase();
    let filtered = snippets.filter(
      (s) =>
        s.title.toLowerCase().includes(normalizedSearchTerm) ||
        s.subtitle.toLowerCase().includes(normalizedSearchTerm) ||
        s.tags.some((tag) =>
          tag.toLowerCase().includes(normalizedSearchTerm)
        )
    );

    if (activeFilter === "favorites")
      filtered = filtered.filter((s) => s.isStarred);

    if (languageFilter !== "All") {
      const langValue = languageMap[languageFilter];
      filtered = filtered.filter((s) => s.language === langValue);
    }

    // filtered.sort((a, b) => {
    //   if (sortBy === "A-Z") return a.title.localeCompare(b.title);
    //   if (sortBy === "Oldest") return new Date(a.date) - new Date(b.date);
    //   if (sortBy === "Newest") return new Date(b.date) - new Date(a.date);
    //   if (sortBy === "Most Used")
    //     return (b.usageCount || 0) - (a.usageCount || 0);
    //   return 0;
    // });

    return filtered;
  }, [snippets, searchTerm, activeFilter, languageFilter, languageMap]);

  const visibleItems = useMemo(
    () => displayedItems.slice(0, visibleCount),
    [displayedItems, visibleCount]
  );

  // Infinite scroll
  useEffect(() => {
    if (!observerRef.current) return;
    const sentinel = observerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < displayedItems.length) {
          setVisibleCount((prev) => Math.min(prev + 9, displayedItems.length));
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [displayedItems.length, visibleCount]);

  return (
    <div className="flex-1 flex flex-col justify-start items-start w-full">
      {/* Header */}
      <div className="flex flex-col w-full mb-6 gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
          <div>
            <h4 className="text-[var(--color-text)]">
              {activeFilter === "favorites"
                ? "Favorite Snippets"
                : "Manage and organize your snippets seamlessly"}
            </h4>
            <p className="text-sm text-[var(--color-muted)]">
              You currently have{" "}
              <span className="font-bold">
                {activeFilter === "favorites" ? favoriteCount : snippets.length}{" "}
                snippets
              </span>{" "}
              {activeFilter === "favorites"
                ? "in your favorites"
                : "on your account"}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1">
            <DeleteAllButton
              items={snippets}
              onDeleteAll={() => setSnippets([])}
              label="Delete All"
            />
            <Button icon={PlusIcon} onClick={() => navigate("/snippet/new")}>
              Add New Snippet
            </Button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {snippets.length === 0 ? (
        <div className="flex flex-col justify-center items-center p-20 gap-4 mt-4 w-full rounded border border-[var(--color-muted)] border-dashed bg-[var(--color-bg)]">
          <p className="mb-0 text-base text-[var(--color-text)] text-center">
            You don’t have any snippets yet. Start by creating your first one.
          </p>
          <Button
            icon={CodeBracketIcon}
            onClick={() => navigate("/snippet/new")}
            className="button-outlined max-w-s"
            centerContent
          >
            Create Your First Snippet
          </Button>
        </div>
      ) : (
        <>
          {/* Search, Filter, Sort, View Mode */}
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
              {/* <SortFilteredButton
                options={sortOptions}
                active={sortBy}
                onSelect={(option) => {
                  setSortBy(option);
                  setCustomOrderActive(false);
                }}
              /> */}

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

          {visibleItems.length > 0 ? (
            <>
              <Listings
                items={visibleItems}
                type="snippet"
                onDelete={(id) => deleteSnippet(id, null, true)}
                onToggleStar={handleToggleStar}
                onCopy={copyItem}
                onUpdate={updateItem}
                viewMode={viewMode}
              />
              <div ref={observerRef} className="h-1 w-full" />
              {visibleCount >= displayedItems.length && (
                <div className="w-full text-center py-4 text-sm text-[var(--color-muted)]">
                  You’ve reached the end
                </div>
              )}
            </>
          ) : (
            <div className="w-full text-center text-base py-8">
              {searchTerm
                ? `No snippets found for "${searchTerm}"`
                : languageFilter !== "All"
                ? `No snippets found for "${languageFilter}"`
                : "No snippets found"}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
