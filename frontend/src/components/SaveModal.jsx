import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  CheckIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import Button from "./UI/Button";

const SaveModal = ({ open, onClose, folders, onSave }) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [title, setTitle] = useState("");

  const handleSave = () => {
    if (!selectedFolder) return;
    onSave({ folderId: selectedFolder, title });
    onClose();
    setSelectedFolder(null);
    setTitle("");
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl transition-all border border-zinc-200 dark:border-zinc-700">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-semibold">
                  Save Snippet
                </Dialog.Title>
                <Button
                  onClick={onClose}
                  icon={XMarkIcon}
                  iconClassName="w-5 h-5"
                  className="p-1 bg-transparent text-[var(--color-muted] hover:text-[var(--color-accent)]"
                />
              </div>

              {/* Folder selector */}
              <div className="mb-5">
                <p className="text-sm mb-2">Choose a folder to save in:</p>
                <div className="flex flex-wrap gap-2">
                  {folders.map((folder) => (
                    <Button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      active={selectedFolder === folder.id}
                      activeBg="bg-[var(--color-muted)] text-[var(--color-bg)]"
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-150 ${
                        selectedFolder !== folder.id
                          ? "bg-[var(--color-lightgray)] text-[var(--color-text)]"
                          : ""
                      }`}
                    >
                      {folder.title}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Title input */}
              <div className="mb-5">
                <label className="block text-sm mb-1">
                  Snippet title (optional)
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a short title..."
                  className="w-full p-2.5 rounded-md bg-[var(--color-superlightbg)] border border-[var(--color-lightgray)] focus:ring-1 focus:ring-[var(--color-accent)]  focus:outline-none text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button onClick={onClose} className="">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  icon={CheckIcon}
                  disabled={!selectedFolder}
                  className={`px-3 py-2 rounded-md text-sm button ${
                    selectedFolder
                      ? "bg-[var(--color-lightgray)] hover:bg-[var(--color-accent)] text-bg-[var(--color-text)]"
                      : "bg-zinc-400 cursor-not-allowed"
                  }`}
                >
                  Save
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SaveModal;
