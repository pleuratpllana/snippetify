import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { normalizeAndSortItems, normalizeDateValue } from "../utils/DateUtils";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

const SnippetContext = createContext();

const exampleSnippet = {
  id: 1,
  title: "Example Snippet",
  subtitle: "Testing tags",
  codeContent: "console.log('Hello World')",
  tags: ["js", "demo"],
  createdAt: "2025-10-17T00:00:00.000Z",
  isStarred: false,
};

const toSnippet = (row) => ({
  id: row.id,
  title: row.title,
  subtitle: row.subtitle,
  codeContent: row.code_content ?? row.codeContent ?? "",
  tags: row.tags || ["No tags"],
  language: row.language || "plaintext",
  createdAt: normalizeDateValue(row.created_at || row.createdAt),
  isStarred: row.is_starred ?? row.isStarred ?? false,
  usageCount: row.usage_count ?? row.usageCount ?? 0,
});

const toSnippetRow = (snippet, userId) => ({
  id: snippet.id,
  user_id: userId,
  title: snippet.title,
  subtitle: snippet.subtitle,
  code_content: snippet.codeContent,
  tags: snippet.tags?.length ? snippet.tags : ["No tags"],
  created_at: normalizeDateValue(snippet.createdAt),
  is_starred: snippet.isStarred || false,
  usage_count: snippet.usageCount || 0,
});

export const SnippetProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [snippets, rawSetSnippets] = useState([]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      rawSetSnippets([]);
      return;
    }

    let active = true;

    const loadSnippets = async () => {
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        console.error("Failed to load snippets:", error);
        rawSetSnippets([exampleSnippet]);
        return;
      }

      rawSetSnippets(
        normalizeAndSortItems((data || []).map(toSnippet), "createdAt")
      );
    };

    loadSnippets();

    return () => {
      active = false;
    };
  }, [authLoading, user]);

  const persistSnippet = async (snippet) => {
    if (!user) return;
    const { error } = await supabase
      .from("snippets")
      .upsert(toSnippetRow(snippet, user.id));

    if (error) {
      console.error("Failed to save snippet:", error);
      toast.error("Failed to save snippet.", { className: "toast-error" });
    }
  };

  const setSnippets = (nextSnippets) => {
    rawSetSnippets((prev) => {
      const next =
        typeof nextSnippets === "function" ? nextSnippets(prev) : nextSnippets;
      const normalized = normalizeAndSortItems(next, "createdAt");
      normalized.forEach((snippet) => persistSnippet(snippet));
      return normalized;
    });
  };

  const freePlanLimitSnippets = 50;

  const getNextId = () =>
    snippets.length === 0
      ? 1
      : Math.max(...snippets.map((s) => Number(s.id)).filter(Number.isFinite)) +
        1;

  const addSnippet = (snippetData) => {
    if (!user) {
      toast.error("Please sign in to save snippets.", {
        className: "toast-error",
      });
      return null;
    }

    if (snippets.length >= freePlanLimitSnippets) {
      toast.error("Free plan limit reached. Upgrade to add more snippets.", {
        className: "toast-error",
      });
      return null;
    }

    const newSnippet = {
      id: snippetData.id || getNextId(),
      ...snippetData,
      tags: snippetData.tags?.length ? snippetData.tags : ["No tags"],
      createdAt: snippetData.createdAt || new Date().toISOString(),
      isStarred: snippetData.isStarred || false,
    };

    rawSetSnippets((prev) =>
      normalizeAndSortItems([newSnippet, ...prev], "createdAt")
    );
    persistSnippet(newSnippet);
    return newSnippet;
  };

  const updateSnippet = (id, updatedData) => {
    const updatedSnippet = snippets.find((snippet) => String(snippet.id) === String(id));
    if (!updatedSnippet) return;
    const nextSnippet = { ...updatedSnippet, ...updatedData };

    rawSetSnippets((prev) =>
      normalizeAndSortItems(
        prev.map((snippet) =>
          String(snippet.id) === String(id) ? nextSnippet : snippet
        ),
        "createdAt"
      )
    );
    persistSnippet(nextSnippet);
  };

  const deleteSnippet = async (id, folderId = null, removeGlobally = false) => {
    if (removeGlobally) {
      rawSetSnippets((prev) =>
        normalizeAndSortItems(
          prev.filter((s) => String(s.id) !== String(id)),
          "createdAt"
        )
      );

      if (user) {
        const { error } = await supabase
          .from("snippets")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          console.error("Failed to delete snippet:", error);
          toast.error("Failed to delete snippet.", { className: "toast-error" });
          return;
        }
      }
    }

    window.dispatchEvent(
      new CustomEvent("snippetsUpdated", {
        detail: { snippetId: id, folderId },
      })
    );

    toast.success("Snippet has been successfully deleted", {
      className: "toast-success",
    });
  };

  const toggleStar = (id) => {
    const snippet = snippets.find((s) => String(s.id) === String(id));
    if (!snippet) return;

    const newStarred = !snippet.isStarred;
    updateSnippet(id, { isStarred: newStarred });

    toast.success(
      newStarred
        ? `"${snippet.title}" added to favorites`
        : `"${snippet.title}" removed from favorites"`,
      { className: "toast-success" }
    );
  };

  const incrementUsage = (id) => {
    const snippet = snippets.find((s) => String(s.id) === String(id));
    if (!snippet) return;
    updateSnippet(id, { usageCount: (snippet.usageCount || 0) + 1 });
  };

  const [activeFilter, setActiveFilter] = useState("snippets");
  const favoritesCount = snippets.filter((s) => s.isStarred).length;
  const [languageFilter, setLanguageFilter] = useState("All");

  return (
    <SnippetContext.Provider
      value={{
        snippets,
        setSnippets,
        addSnippet,
        updateSnippet,
        deleteSnippet,
        toggleStar,
        incrementUsage,
        activeFilter,
        setActiveFilter,
        favoritesCount,
        languageFilter,
        setLanguageFilter,
        getNextId,
      }}
    >
      {children}
    </SnippetContext.Provider>
  );
};

export const useSnippets = () => useContext(SnippetContext);
