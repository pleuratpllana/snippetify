import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  StarIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon,
  FolderIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Copy } from "lucide-react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import Modal from "../shared/Modal";
import DragDropIcon from "../DragDropIcon";

const ActionIcon = ({ Icon, onClick, color, active, title }) => (
  <Icon
    onClick={(e) => {
      e.stopPropagation();
      onClick?.(e);
    }}
    title={title}
    className={`w-5 h-5 shrink-0 cursor-pointer transition-colors ${
      active
        ? "text-[var(--color-darkaccent)] fill-[var(--color-accent)]"
        : color === "danger"
          ? "hover:text-red-500"
          : "hover:text-[var(--color-darkaccent)] text-[var(--color-muted)]"
    }`}
  />
);

const getRelativeDate = (timestamp) => {
  if (!timestamp) return "";

  const dateObj = new Date(timestamp);
  if (isNaN(dateObj)) return "";

  const now = new Date();
  const diffMs = now - dateObj;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 0) return "In the future";

  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
};

const Card = ({
  id,
  type = "generic",
  title = "No title",
  subtitle = "No subtitle",
  content = "",
  tags = [],
  language = "plaintext",

  date,
  createdAt,
  created_at,

  isStarred = false,
  showFavorites = false,
  showExpand = false,
  showDragHandle = false,
  folderColor = "#34d399",
  snippetCount = 0,

  onDelete,
  onCopy,
  onToggleStar,
  dragHandleProps,
  expanded: expandedProp = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [highlightedContent, setHighlightedContent] = useState("");
  const [expanded] = useState(false);

  const navigate = useNavigate();

  // SINGLE SAFE DATE SOURCE (fix)
  const safeDate = date ?? createdAt ?? created_at ?? null;

  const isExpanded = expandedProp || expanded;

  useEffect(() => {
    if (!content) return;

    try {
      if (hljs.getLanguage(language)) {
        setHighlightedContent(hljs.highlight(content, { language }).value);
      } else {
        setHighlightedContent(hljs.highlightAuto(content).value);
      }
    } catch {
      setHighlightedContent(content);
    }
  }, [content, language]);

  const handleCopy = (e) => {
    e.stopPropagation();
    onCopy?.({ id, content });
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleExport = (e) => {
    e.stopPropagation();
    const blob = new Blob(
      [
        JSON.stringify(
          { title, subtitle, content, tags, date: safeDate },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSnippetToggle = (id) => {
    if (onToggleStar) onToggleStar(id);
  };

  const handleFolderView = () => {
    navigate(`/folders/${id}/snippets`);
  };

  return (
    <div className="p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex flex-col h-full w-full hover:shadow-md transition duration-400 ease-in-out">
      {showDragHandle && (
        <div
          {...dragHandleProps}
          className="drag-handle flex items-baseline gap-1 cursor-grab group mb-2"
        >
          <DragDropIcon className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-darkaccent)]" />

          <p className="text-xs leading-none gap-2 m-0 text-[var(--color-muted)] group-hover:text-[var(--color-darkaccent)] flex items-center">
            Drag
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between gap-3">
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {type === "folder" && (
              <div
                className="w-10 h-10 rounded flex items-center justify-center my-2"
                style={{ backgroundColor: folderColor }}
              >
                <FolderIcon className="w-6 h-6 text-[var(--color-bg)]" />
              </div>
            )}

            <h6 className="font-semibold text-[var(--color-text)] truncate">
              {title}
            </h6>
          </div>

          <p className="text-sm text-[var(--color-muted)] truncate">
            {type === "folder"
              ? `${subtitle} · ${snippetCount} snippet${snippetCount !== 1 ? "s" : ""}`
              : subtitle}
          </p>
        </div>

        <div className="flex gap-3 text-[var(--color-muted)]">
          <ActionIcon
            Icon={PencilSquareIcon}
            onClick={() =>
              type === "folder"
                ? navigate(`/folders/${id}?edit=true`)
                : navigate(`/${type}/${id}?edit=true`)
            }
          />

          {type === "snippet" && (
            <ActionIcon
              Icon={ArrowDownTrayIcon}
              onClick={() => setActiveModal("export")}
            />
          )}

          {showFavorites && (
            <ActionIcon
              Icon={StarIcon}
              active={isStarred}
              onClick={() => handleSnippetToggle(id)}
            />
          )}

          <ActionIcon
            Icon={TrashIcon}
            color="danger"
            onClick={() => setActiveModal("delete")}
          />

          {type === "snippet" && showExpand && (
            <ActionIcon
              Icon={ArrowTopRightOnSquareIcon}
              onClick={() => navigate(`/${type}/${id}`)}
            />
          )}

          {type === "folder" && (
            <button
              onClick={handleFolderView}
              className="button-outlined flex items-center gap-1 px-2.5 py-1.5 text-sm"
            >
              <EyeIcon className="w-4 h-4" />
              View Folder
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {type === "snippet" && content && (
        <div className="relative p-4 mt-2 mb-1 bg-[var(--color-superlightbg)] border border-dashed border-[var(--color-border)] flex-1">
          <pre
            className={`font-mono text-sm whitespace-pre-wrap ${
              isExpanded ? "" : "line-clamp-1"
            }`}
            dangerouslySetInnerHTML={{ __html: highlightedContent }}
          />

          <div
            className="absolute top-2 right-2 flex items-center gap-1 cursor-pointer"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-2 flex-wrap">
          {type === "snippet" &&
            tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs rounded-full bg-[var(--color-superlightbg)] text-[var(--color-muted)]"
              >
                {tag}
              </span>
            ))}
        </div>

        <div className="text-xs text-[var(--color-muted)]">
          {getRelativeDate(safeDate)}
        </div>
      </div>

      {/* Modals */}
      {activeModal === "delete" && (
        <Modal
          isOpen
          onClose={() => setActiveModal(null)}
          title="Confirm Deletion"
          onConfirm={() => {
            onDelete?.();
            setActiveModal(null);
          }}
          requireTextConfirmation="DELETE"
        >
          Are you sure you want to delete "{title}"?
        </Modal>
      )}

      {activeModal === "export" && (
        <Modal
          isOpen
          onClose={() => setActiveModal(null)}
          title="Export Snippet"
        >
          <button onClick={handleExport}>Export</button>
        </Modal>
      )}
    </div>
  );
};

export default Card;
