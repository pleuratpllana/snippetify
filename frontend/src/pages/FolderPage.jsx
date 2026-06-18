// pages/FolderPage.jsx
import { useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useFolders } from "../context/FolderContext";
import { useSnippets } from "../context/SnippetContext";
import FolderForm from "../components/FolderForm";
import Button from "../components/UI/Button";
import { PlusIcon, FolderIcon } from "@heroicons/react/24/outline";
import FolderListings from "../components/shared/Listings";
import DeleteAllButton from "../components/shared/DeleteAllButton";

const FolderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // dynamic folder ID
  const folderId = id || null;

  const {
    folders,
    addFolder,
    updateFolder,
    deleteFolder,
  } = useFolders();
  const { deleteSnippet } = useSnippets();

  const isNew = location.pathname === "/folders/new";
  const isEditing = folderId && !isNew;

  // Memoized editing folder
  const editingFolder = useMemo(() => {
    if (!isEditing) return null;
    return folders.find((f) => String(f.id) === String(folderId));
  }, [folderId, folders, isEditing]);

  const freePlanLimit = 5;
  const isFull = folders.length >= freePlanLimit;

  const handleSubmit = (folderData) => {
    if (editingFolder) {
      updateFolder(editingFolder.id, folderData);
    } else {
      addFolder({ ...folderData, date: new Date().toISOString() });
    }
    navigate("/folders");
  };

  const handleCancel = () => navigate("/folders");

  const sortedFolders = useMemo(() => {
    return [...folders].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [folders]);

  return (
    <div className="flex flex-col w-full gap-4">
      {(isEditing || isNew) && (
        <div className="w-full flex justify-start mb-4">
          <button
            onClick={() => navigate("/folders")}
            className="hyperlink-button bg-transparent"
          >
            ← Return to Folders
          </button>
        </div>
      )}

      {(isEditing || isNew) && (
        <FolderForm
          folder={isEditing ? editingFolder : null}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {!isEditing && !isNew && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
            <div>
              <h4 className="text-[var(--color-text)]">
                {folders.length === 0
                  ? "No folders yet"
                  : "Manage and organize your folders seamlessly"}
              </h4>
              <p className="text-sm text-[var(--color-muted)]">
                You currently have{" "}
                <span className="font-bold">
                  {folders.length} folder{folders.length !== 1 && "s"}
                </span>{" "}
                {folders.length === 0 ? "created" : "on your account"}
              </p>
            </div>

            <div className="flex gap-2">
              <DeleteAllButton
                items={folders}
                onDeleteAll={() => folders.forEach((f) => deleteFolder(f.id))}
                label="Delete All"
              />

              <Button
                icon={PlusIcon}
                onClick={() => !isFull && navigate("/folders/new")}
                disabled={isFull}
                title={isFull ? "Free Plan Full" : "Add New Folder"}
              >
                Add New Folder
              </Button>
            </div>
          </div>

          {folders.length === 0 && (
            <div className="flex flex-col justify-center items-center p-20 gap-4 mt-6 w-full rounded border border-[var(--color-muted)] border-dashed bg-[var(--color-bg)]">
              <p className="text-[var(--color-text)] text-center text-base mb-0">
                Start organizing your snippets by creating your first folder.
              </p>
              <Button
                icon={FolderIcon}
                onClick={() => !isFull && navigate("/folders/new")}
                className="button-outlined max-w-s"
                disabled={isFull}
                title={isFull ? "Free Plan Full" : "Add Folder"}
              >
                Add Folder
              </Button>
            </div>
          )}

          {folders.length > 0 && (
            <FolderListings
              items={sortedFolders}
              type="folder"
              onDelete={(folderIdToDelete) => deleteFolder(folderIdToDelete)}
              onEdit={(folder) => navigate(`/folders/${folder.id}`)}
              viewMode="grid"
              // Snippets inside a folder will only delete from that folder
              onDeleteSnippet={(snippetId, folderId) =>
                deleteSnippet(snippetId, folderId)
              }
            />
          )}
        </>
      )}
    </div>
  );
};

export default FolderPage;
