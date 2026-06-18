import {
  PlusIcon,
  CodeBracketIcon,
  StarIcon,
  FolderIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LockClosedIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/outline";
import { useSnippets } from "../../context/SnippetContext";
import { useFolders } from "../../context/FolderContext";
import Button from "../UI/Button";
import FilterButton from "../shared/FilterButton";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const {
    snippets = [],
    favoritesCount = 0,
    activeFilter,
    setActiveFilter,
  } = useSnippets() || {};
  const { folders = [] } = useFolders() || {};
  const navigate = useNavigate();

  const folderCount = Array.isArray(folders) ? folders.length : 0;
  const snippetCount = Array.isArray(snippets) ? snippets.length : 0;

  const freePlanLimits = { snippets: 50, folders: 5 };
  const currentCount = activeFilter === "folders" ? folderCount : snippetCount;
  const maxLimit =
    activeFilter === "folders"
      ? freePlanLimits.folders
      : freePlanLimits.snippets;
  const progress = Math.min((currentCount / maxLimit) * 100, 100);
  const isFull = currentCount >= maxLimit;

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (filter === "snippets") navigate("/dashboard");
    else if (filter === "favorites") navigate("/dashboard?filter=favorites");
    else if (filter === "folders") navigate("/folders");
    else if (filter === "ask-ai") navigate("/ask-ai");
  };

  const iconSize = isCollapsed ? "w-6 h-6" : "w-5 h-5";

  return (
    <div className="relative hidden lg:flex flex-col h-screen">
      <motion.aside
        className="bg-[var(--color-bg)] flex flex-col border-r border-[var(--color-lightgray)] p-4 h-full"
        animate={{ width: isCollapsed ? 80 : 222 }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
      >
        {/* Add New Snippet / Folder */}
        <Button
          className={`mb-4 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
          icon={PlusIcon}
          iconClassName={iconSize}
          onClick={() =>
            !isFull &&
            (activeFilter === "folders"
              ? navigate("/folders/new")
              : navigate("/snippet/new"))
          }
          title={
            activeFilter === "folders" ? "Add New Folder" : "Add New Snippet"
          }
          disabled={isFull}
        >
          {!isCollapsed && (
            <span>
              {activeFilter === "folders"
                ? "Add New Folder"
                : "Add New Snippet"}
            </span>
          )}
        </Button>

        {/* Filter buttons */}
        <div className="flex flex-col flex-1">
          {!isCollapsed ? (
            <>
              <FilterButton
                icon={CodeBracketIcon}
                label="All Snippets"
                count={snippetCount}
                active={activeFilter === "snippets"}
                onClick={() => handleFilterClick("snippets")}
              />
              <FilterButton
                icon={StarIcon}
                label="Favorites"
                count={favoritesCount}
                active={activeFilter === "favorites"}
                onClick={() => handleFilterClick("favorites")}
              />
              <FilterButton
                icon={FolderIcon}
                label="Folders"
                count={folderCount}
                active={activeFilter === "folders"}
                onClick={() => handleFilterClick("folders")}
              />
              <div className="mt-auto">
                <FilterButton
                  icon={Sparkles}
                  label="Ask AI"
                  active={activeFilter === "ask-ai"}
                  onClick={() => handleFilterClick("ask-ai")}
                />
              </div>
            </>
          ) : (
            <>
              <FilterButton
                icon={CodeBracketIcon}
                label=""
                active={activeFilter === "snippets"}
                onClick={() => handleFilterClick("snippets")}
                centered={isCollapsed}
              />
              <FilterButton
                icon={StarIcon}
                label=""
                active={activeFilter === "favorites"}
                onClick={() => handleFilterClick("favorites")}
                centered={isCollapsed}
              />
              <FilterButton
                icon={FolderIcon}
                label=""
                active={activeFilter === "folders"}
                onClick={() => handleFilterClick("folders")}
                centered={isCollapsed}
              />
              <FilterButton
                icon={Sparkles}
                label=""
                active={activeFilter === "ask-ai"}
                onClick={() => handleFilterClick("ask-ai")}
                centered={isCollapsed}
              />
            </>
          )}
        </div>

        {/* Progress Section */}
        <div
          className={`mt-4 border-t border-[var(--color-lightgray)] pt-6 ${
            isCollapsed ? "flex flex-col items-center" : "flex flex-col"
          }`}
        >
          <motion.div
            className="flex items-center justify-between mb-2 text-xs text-[var(--color-muted)]"
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              {isFull ? (
                <motion.span
                  animate={{ opacity: isCollapsed ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  Free Plan Full
                </motion.span>
              ) : (
                <>
                  <motion.span
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentCount}/{maxLimit} Used
                  </motion.span>
                  <motion.span
                    className="bg-[var(--color-text)] border border-[var(--color-muted)] text-[var(--color-bg)] px-1.5 py-0.5 rounded-full font-medium text-xs"
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    Free Plan
                  </motion.span>
                </>
              )}
            </div>
            {isFull && (
              <motion.div
                className="flex items-center"
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <LockClosedIcon className="w-4 h-4 text-red-500" />
              </motion.div>
            )}
          </motion.div>

          <div className="w-full bg-[var(--color-superlightaccent)] rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isFull ? "bg-red-500" : "bg-[var(--color-text)]"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div
            className={`mt-2 flex flex-col items-center text-xs text-[var(--color-muted)]`}
          >
            {isCollapsed && (
              <div className="flex items-center gap-1 text-xs">
                {isFull && (
                  <LockClosedIcon className="w-3.5 h-3.5 text-red-500" />
                )}
                <span>
                  {currentCount}/{maxLimit}
                </span>
              </div>
            )}
            {!isCollapsed && (
              <p
                className={`text-[11px] ${
                  isFull ? "text-red-500" : "text-[var(--color-muted)]"
                }`}
              >
                {isFull
                  ? "Upgrade to add more folders or delete one of the existing"
                  : activeFilter === "folders"
                  ? `Free plan allows up to ${maxLimit} folders`
                  : `Free plan allows up to ${maxLimit} snippets`}
              </p>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Collapse/Expand toggle */}
      <motion.button
        className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-[var(--color-text)] text-[var(--color-bg)] border border-gray-300 rounded-full p-1.5 hover:bg-[var(--color-lightaccent)] transition-all duration-300"
        onClick={() => setIsCollapsed(!isCollapsed)}
        whileTap={{ scale: 0.95 }}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="w-4 h-4" />
        ) : (
          <ChevronLeftIcon className="w-4 h-4" />
        )}
      </motion.button>
    </div>
  );
};

export default Sidebar;
