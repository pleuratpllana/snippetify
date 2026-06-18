import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { askAIChatService } from "../services/askAIChatService";

const toResponse = (message) => ({
  id: message.id,
  prompt: message.prompt,
  result: message.result,
  createdAt: message.created_at,
});

const getSessionTitle = (prompt) => {
  const title = prompt.trim().replace(/\s+/g, " ").slice(0, 48);
  return title || "New chat";
};

const getExportContent = (session, sessionMessages, format = "json") => {
  if (format === "txt") {
    return sessionMessages
      .map(
        (message, index) =>
          `#${index + 1}\nUser:\n${message.prompt}\n\nAI:\n${message.result}`
      )
      .join("\n\n---\n\n");
  }

  return JSON.stringify(
    {
      session,
      messages: sessionMessages,
    },
    null,
    2
  );
};

const getSafeFilename = (title, format) => {
  const safeTitle = title
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `${safeTitle || "ask-ai-chat"}.${format}`;
};

export const useAskAIChats = (user) => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) || null,
    [activeSessionId, sessions]
  );

  const loadMessages = useCallback(
    async (sessionId) => {
      if (!user || !sessionId) {
        setMessages([]);
        return;
      }

      const nextMessages = await askAIChatService.listMessages(
        sessionId,
        user.id
      );
      setMessages(nextMessages.map(toResponse));
    },
    [user]
  );

  const refreshSessions = useCallback(async () => {
    if (!user) {
      setSessions([]);
      setActiveSessionId(null);
      setMessages([]);
      return;
    }

    setLoadingChats(true);
    try {
      let nextSessions = await askAIChatService.listSessions(user.id);

      if (nextSessions.length === 0) {
        const created = await askAIChatService.createSession(user.id);
        nextSessions = [created];
      }

      setSessions(nextSessions);
      const preferred =
        nextSessions.find((session) => !session.is_archived) ||
        nextSessions[0];
      setActiveSessionId(preferred.id);
      await loadMessages(preferred.id);
    } catch (error) {
      console.error("Failed to load Ask AI chats:", error);
      toast.error("Failed to load Ask AI chats.", {
        className: "toast-error",
      });
    } finally {
      setLoadingChats(false);
    }
  }, [loadMessages, user]);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  const selectSession = useCallback(
    async (sessionId) => {
      setActiveSessionId(sessionId);
      try {
        await loadMessages(sessionId);
      } catch (error) {
        console.error("Failed to load Ask AI messages:", error);
        toast.error("Failed to load chat messages.", {
          className: "toast-error",
        });
      }
    },
    [loadMessages]
  );

  const createSession = useCallback(async () => {
    if (!user) return null;

    try {
      const session = await askAIChatService.createSession(user.id);
      setSessions((prev) => [session, ...prev]);
      setActiveSessionId(session.id);
      setMessages([]);
      return session;
    } catch (error) {
      console.error("Failed to create Ask AI chat:", error);
      toast.error("Failed to create chat.", { className: "toast-error" });
      return null;
    }
  }, [user]);

  const deleteSession = useCallback(async (session = activeSession) => {
    if (!user || !session) return;

    try {
      await askAIChatService.deleteSession(session.id, user.id);
      const remaining = sessions.filter(
        (currentSession) => currentSession.id !== session.id
      );

      if (remaining.length === 0) {
        const created = await askAIChatService.createSession(user.id);
        setSessions([created]);
        setActiveSessionId(created.id);
        setMessages([]);
        return;
      }

      setSessions(remaining);
      const nextActive =
        remaining.find((session) => !session.is_archived) || remaining[0];
      if (session.id === activeSession?.id) {
        setActiveSessionId(nextActive.id);
        await loadMessages(nextActive.id);
      }
    } catch (error) {
      console.error("Failed to delete Ask AI chat:", error);
      toast.error("Failed to delete chat.", { className: "toast-error" });
    }
  }, [activeSession, loadMessages, sessions, user]);

  const deleteSessions = useCallback(async (targetSessions = []) => {
    if (!user || targetSessions.length === 0) return;

    const targetIds = targetSessions.map((session) => session.id);

    try {
      await askAIChatService.deleteSessions(targetIds, user.id);
      const remaining = sessions.filter(
        (session) => !targetIds.includes(session.id)
      );

      if (remaining.length === 0) {
        const created = await askAIChatService.createSession(user.id);
        setSessions([created]);
        setActiveSessionId(created.id);
        setMessages([]);
        return;
      }

      setSessions(remaining);

      if (targetIds.includes(activeSession?.id)) {
        const nextActive =
          remaining.find((session) => !session.is_archived) || remaining[0];
        setActiveSessionId(nextActive.id);
        await loadMessages(nextActive.id);
      }
    } catch (error) {
      console.error("Failed to delete Ask AI chats:", error);
      toast.error("Failed to delete chats.", { className: "toast-error" });
    }
  }, [activeSession, loadMessages, sessions, user]);

  const updateSessionInState = useCallback((updatedSession) => {
    setSessions((prev) =>
      prev
        .map((session) =>
          session.id === updatedSession.id ? updatedSession : session
        )
        .sort((a, b) => {
          if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
          if (a.is_archived !== b.is_archived) return a.is_archived ? 1 : -1;
          return new Date(b.updated_at) - new Date(a.updated_at);
        })
    );
  }, []);

  const updateSession = useCallback(async (session, updates) => {
    if (!user || !session) return null;

    const updated = await askAIChatService.updateSession(session.id, user.id, {
      ...updates,
      updated_at: new Date().toISOString(),
    });
    updateSessionInState(updated);
    return updated;
  }, [updateSessionInState, user]);

  const renameSession = useCallback(async (session, nextTitle) => {
    const title = nextTitle.trim();
    if (!title) return;

    try {
      await updateSession(session, { title });
    } catch (error) {
      console.error("Failed to rename Ask AI chat:", error);
      toast.error("Failed to rename chat.", { className: "toast-error" });
    }
  }, [updateSession]);

  const toggleArchiveSession = useCallback(async (session = activeSession) => {
    if (!session) return;

    try {
      await updateSession(session, { is_archived: !session.is_archived });
    } catch (error) {
      console.error("Failed to archive Ask AI chat:", error);
      toast.error("Failed to update chat.", { className: "toast-error" });
    }
  }, [activeSession, updateSession]);

  const togglePinSession = useCallback(async (session) => {
    if (!session) return;

    try {
      await updateSession(session, { is_pinned: !session.is_pinned });
    } catch (error) {
      console.error("Failed to pin Ask AI chat:", error);
      toast.error("Failed to pin chat.", { className: "toast-error" });
    }
  }, [updateSession]);

  const appendExchange = useCallback(
    async ({ prompt, result, position }) => {
      if (!user || !activeSession) return;

      const messagePosition =
        typeof position === "number" ? position : messages.length;
      const savedMessage = await askAIChatService.createMessage(
        user.id,
        activeSession.id,
        { prompt, result, position: messagePosition }
      );
      setMessages((prev) =>
        prev.map((message, index) =>
          index === messagePosition ? toResponse(savedMessage) : message
        )
      );

      const updates = {
        updated_at: new Date().toISOString(),
      };

      if (activeSession.title === "New chat" && messagePosition === 0) {
        updates.title = getSessionTitle(prompt);
      }

      const updatedSession = await askAIChatService.updateSession(
        activeSession.id,
        user.id,
        updates
      );
      updateSessionInState(updatedSession);
    },
    [activeSession, messages.length, updateSessionInState, user]
  );

  const getSessionMessages = useCallback(async (session) => {
    if (!user || !session) return [];
    if (session.id === activeSession?.id) return messages;

    const sessionMessages = await askAIChatService.listMessages(
      session.id,
      user.id
    );
    return sessionMessages.map(toResponse);
  }, [activeSession, messages, user]);

  const exportSession = useCallback(
    async (session = activeSession, format = "json") => {
      if (!session) return;

      const sessionMessages = await getSessionMessages(session);
      const filename = getSafeFilename(session.title, format);
      const content = getExportContent(session, sessionMessages, format);

      const blob = new Blob([content], {
        type: format === "txt" ? "text/plain" : "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [activeSession, getSessionMessages]
  );

  const shareSession = useCallback(async (session) => {
    if (!session) return;

    try {
      const sessionMessages = await getSessionMessages(session);
      const text = getExportContent(session, sessionMessages, "txt");

      if (navigator.share) {
        await navigator.share({
          title: session.title,
          text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Chat copied to clipboard.", {
          className: "toast-success",
        });
      }
    } catch (error) {
      if (error?.name === "AbortError") return;
      console.error("Failed to share Ask AI chat:", error);
      toast.error("Failed to share chat.", { className: "toast-error" });
    }
  }, [getSessionMessages]);

  return {
    sessions,
    activeSession,
    messages,
    setMessages,
    loadingChats,
    selectSession,
    createSession,
    deleteSession,
    deleteSessions,
    renameSession,
    toggleArchiveSession,
    togglePinSession,
    appendExchange,
    exportSession,
    shareSession,
  };
};
