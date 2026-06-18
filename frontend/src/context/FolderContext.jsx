import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { normalizeAndSortItems, normalizeDateValue } from "../utils/DateUtils";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

const FolderContext = createContext();

const toFolder = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  color: row.color,
  createdAt: normalizeDateValue(row.created_at || row.createdAt),
  snippetIds: row.snippet_ids || row.snippetIds || [],
});

const toFolderRow = (folder, userId) => ({
  id: folder.id,
  user_id: userId,
  title: folder.title,
  description: folder.description,
  color: folder.color,
  created_at: normalizeDateValue(folder.createdAt),
  snippet_ids: folder.snippetIds || [],
});

export const FolderProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [folders, setFoldersState] = useState([]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setFoldersState([]);
      return;
    }

    let active = true;

    const loadFolders = async () => {
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        console.error("Failed to load folders:", error);
        setFoldersState([]);
        return;
      }

      setFoldersState(
        normalizeAndSortItems((data || []).map(toFolder), "createdAt")
      );
    };

    loadFolders();

    return () => {
      active = false;
    };
  }, [authLoading, user]);

  const persistFolder = useCallback(async (folder) => {
    if (!user) return;
    const { error } = await supabase
      .from("folders")
      .upsert(toFolderRow(folder, user.id));

    if (error) {
      console.error("Failed to save folder:", error);
      toast.error("Failed to save folder.", { className: "toast-error" });
    }
  }, [user]);

  useEffect(() => {
    const handleSnippetsUpdate = (e) => {
      const { snippetId, folderId } = e.detail || {};
      if (!folderId) return;

      setFoldersState((prev) => {
        const next = prev.map((folder) =>
          String(folder.id) === String(folderId)
            ? {
                ...folder,
                snippetIds: folder.snippetIds.filter(
                  (id) => String(id) !== String(snippetId)
                ),
              }
            : folder
        );
        next.forEach((folder) => {
          if (String(folder.id) === String(folderId)) persistFolder(folder);
        });
        return next;
      });
    };

    window.addEventListener("snippetsUpdated", handleSnippetsUpdate);
    return () =>
      window.removeEventListener("snippetsUpdated", handleSnippetsUpdate);
  }, [persistFolder]);

  const freePlanLimitFolders = 5;

  const getNextFolderId = () =>
    folders.length === 0
      ? 1
      : Math.max(...folders.map((f) => Number(f.id)).filter(Number.isFinite)) +
        1;

  const addFolder = (folder) => {
    if (!user) {
      toast.error("Please sign in to save folders.", {
        className: "toast-error",
      });
      return null;
    }

    if (folders.length >= freePlanLimitFolders) {
      toast.error("Free plan limit reached. Upgrade to add more folders.", {
        className: "toast-error",
      });
      return null;
    }

    const newFolder = {
      ...folder,
      id: folder.id || getNextFolderId(),
      createdAt: new Date().toISOString(),
      snippetIds: folder.snippetIds || [],
    };

    setFoldersState((prev) =>
      normalizeAndSortItems([newFolder, ...prev], "createdAt")
    );
    persistFolder(newFolder);
    return newFolder;
  };

  const updateFolder = (id, updatedData) => {
    const currentFolder = folders.find((folder) => String(folder.id) === String(id));
    if (!currentFolder) return;

    const updatedFolder = {
      ...currentFolder,
      ...updatedData,
      snippetIds: updatedData.snippetIds ?? currentFolder.snippetIds,
      createdAt: normalizeDateValue(currentFolder.createdAt),
    };

    setFoldersState((prev) =>
      normalizeAndSortItems(
        prev.map((folder) =>
          String(folder.id) === String(id) ? updatedFolder : folder
        ),
        "createdAt"
      )
    );
    persistFolder(updatedFolder);
  };

  const deleteFolder = async (id) => {
    const folderToDelete = folders.find((f) => String(f.id) === String(id));
    setFoldersState((prev) =>
      normalizeAndSortItems(
        prev.filter((folder) => String(folder.id) !== String(id)),
        "createdAt"
      )
    );

    if (user) {
      const { error } = await supabase
        .from("folders")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to delete folder:", error);
        toast.error("Failed to delete folder.", { className: "toast-error" });
        return;
      }
    }

    if (folderToDelete) {
      toast.success(`Folder "${folderToDelete.title}" has been deleted`, {
        className: "toast-success",
      });
    }
  };

  const addSnippetToFolder = (folderId, snippetId) => {
    const currentFolder = folders.find(
      (folder) => String(folder.id) === String(folderId)
    );

    if (
      !currentFolder ||
      currentFolder.snippetIds.map(String).includes(String(snippetId))
    ) {
      return;
    }

    const changedFolder = {
      ...currentFolder,
      snippetIds: [...currentFolder.snippetIds, snippetId],
    };

    setFoldersState((prev) =>
      normalizeAndSortItems(
        prev.map((folder) =>
          String(folder.id) === String(folderId) ? changedFolder : folder
        ),
        "createdAt"
      )
    );
    persistFolder(changedFolder);
  };

  const removeSnippetFromFolder = (folderId, snippetId) => {
    const currentFolder = folders.find(
      (folder) => String(folder.id) === String(folderId)
    );

    if (!currentFolder) return;

    const changedFolder = {
      ...currentFolder,
      snippetIds: currentFolder.snippetIds.filter(
        (id) => String(id) !== String(snippetId)
      ),
    };

    setFoldersState((prev) =>
      normalizeAndSortItems(
        prev.map((folder) =>
          String(folder.id) === String(folderId) ? changedFolder : folder
        ),
        "createdAt"
      )
    );
    persistFolder(changedFolder);
  };

  return (
    <FolderContext.Provider
      value={{
        folders,
        addFolder,
        updateFolder,
        deleteFolder,
        addSnippetToFolder,
        removeSnippetFromFolder,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export const useFolders = () => useContext(FolderContext);
