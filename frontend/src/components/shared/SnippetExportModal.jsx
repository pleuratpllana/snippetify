// SnippetExportModal.jsx
import React from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Github } from "lucide-react";
import Modal from "../shared/Modal";

const SnippetExportModal = ({ isOpen, onClose, title, handleExport }) => {
  const options = [
    { label: "Download JSON", action: handleExport, active: true },
    { label: "Share to Github Repo", action: () => {}, active: true },
    { label: "PDF (Coming Soon)", action: () => {}, active: false },
    { label: "CSV (Coming Soon)", action: () => {}, active: false },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Export snippet`}>
      <p className="mb-6 mt-1 text-sm text-[var(--color-text)]">
        Choose export format for "{title}":
      </p>
      <div className="grid grid-cols-2 gap-4">
        {options.map(({ label, action, active }) => (
          <div
            key={label}
            onClick={(e) => {
              e.stopPropagation();
              active && action?.(e);
            }}
            title={`Export as ${label}`}
            className={`flex flex-col items-center justify-center p-4 border border-[var(--color-border)] rounded-lg cursor-pointer transition-colors ${
              active
                ? "hover:bg-[var(--color-superlightaccent)]"
                : "cursor-not-allowed opacity-50"
            } bg-[var(--color-bg)]`}
          >
            {label === "Share to Github Repo" ? (
              <Github className="w-6 h-6 mb-2 text-[var(--color-darkaccent)]" />
            ) : (
              <ArrowDownTrayIcon
                className={`w-6 h-6 mb-2 ${
                  active
                    ? "text-[var(--color-darkaccent)]"
                    : "text-[var(--color-muted)]"
                }`}
              />
            )}
            <span className="text-sm text-[var(--color-text)]">{label}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default SnippetExportModal;
