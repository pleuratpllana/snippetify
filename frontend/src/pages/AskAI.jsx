import { useState, useRef, useEffect } from "react";
import { useSnippets } from "../context/SnippetContext";
import { useFolders } from "../context/FolderContext";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import Button from "../components/UI/Button";
import InputGroup from "../components/UI/InputGroup";
import SaveModal from "../components/SaveModal";
import {
  ChatBubbleLeftRightIcon,
  CheckIcon,
  ClipboardIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  PlusIcon,
  ShareIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Archive,
  ArchiveRestore,
  FileJson,
  FileText,
  Pin,
  PinOff,
  Trash,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useAskAIChats } from "../hooks/useAskAIChats";
import Modal from "../components/shared/Modal";

const PROMPT_LIMIT_KEY = "aiPromptLimit";
const MAX_DAILY_PROMPTS = 5;
const PROMPT_LIMIT_WINDOW_MS = 12 * 60 * 60 * 1000;

const formatSessionDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const getDeleteConfirmText = (count) =>
  count === 1 ? "Delete chat" : `Delete ${count} chats`;

const AskAIPage = () => {
  const { addSnippet } = useSnippets();
  const { folders, addSnippetToFolder } = useFolders();
  const { user } = useAuth();
  const {
    sessions,
    activeSession,
    messages: aiResponses,
    setMessages: setAIResponses,
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
  } = useAskAIChats(user);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [snippetToSave, setSnippetToSave] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTypingIndex, setActiveTypingIndex] = useState(null);
  const [openMenuSessionId, setOpenMenuSessionId] = useState(null);
  const [sessionsToDelete, setSessionsToDelete] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedSessionIds, setSelectedSessionIds] = useState([]);
  const [sessionToRename, setSessionToRename] = useState(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [hasUserSentFirstMessage, setHasUserSentFirstMessage] = useState(false);

  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const typingIntervalRef = useRef(null);

  const promptLimitKey = user ? `${PROMPT_LIMIT_KEY}_${user.id}` : null;

  useEffect(() => {
    setHasUserSentFirstMessage(aiResponses.length > 0);
  }, [aiResponses.length]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  useEffect(() => {
    if (hasUserSentFirstMessage) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiResponses, hasUserSentFirstMessage]);

  const checkAndUpdatePromptLimit = () => {
    const now = Date.now();
    let limitData = { count: 0, timestamp: now };

    try {
      if (!promptLimitKey) return false;

      const saved = localStorage.getItem(promptLimitKey);
      if (saved) limitData = JSON.parse(saved);

      if (now - limitData.timestamp > PROMPT_LIMIT_WINDOW_MS) {
        limitData = { count: 0, timestamp: now };
        toast.info("Your AI prompt limit has been reset!");
      }

      if (limitData.count >= MAX_DAILY_PROMPTS) {
        toast.error(
          "You have reached your free limit of 5 prompts. Come back in 12h."
        );
        return false;
      }

      limitData.count += 1;
      localStorage.setItem(promptLimitKey, JSON.stringify(limitData));
      return true;
    } catch (err) {
      console.error("Prompt limit error:", err);
      return true;
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !checkAndUpdatePromptLimit()) return;
    if (!activeSession) {
      toast.error("Chat session is still loading.", {
        className: "toast-error",
      });
      return;
    }
    if (activeSession.is_archived) {
      toast.error("Unarchive this chat before sending a new message.", {
        className: "toast-error",
      });
      return;
    }

    const userPrompt = prompt;
    const newIndex = aiResponses.length;
    setPrompt("");
    setHasUserSentFirstMessage(true);
    setLoading(true);

    try {
      setAIResponses((prev) => [...prev, { prompt: userPrompt, result: "" }]);
      setActiveTypingIndex(newIndex);

      const { data, error } = await supabase.functions.invoke("askAI", {
        body: { prompt: userPrompt },
      });

      if (error) throw error;

      const fullResult = data?.result || "// No response";
      let charIndex = 0;

      typingIntervalRef.current = setInterval(() => {
        charIndex += 1;
        setAIResponses((prev) => {
          const copy = [...prev];
          if (copy[newIndex]) {
            copy[newIndex] = {
              ...copy[newIndex],
              result: fullResult.slice(0, charIndex),
            };
          }
          return copy;
        });

        if (charIndex >= fullResult.length) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
          setLoading(false);
          setActiveTypingIndex(null);

          appendExchange({
            prompt: userPrompt,
            result: fullResult,
            position: newIndex,
          }).catch((saveError) => {
            console.error("Failed to persist Ask AI chat:", saveError);
            toast.error("AI response generated, but chat was not saved.", {
              className: "toast-error",
            });
          });
        }
      }, 20);
    } catch (err) {
      console.error(err.response?.data || err.message);
      const errorResult = "// Error generating response";

      setAIResponses((prev) => {
        const copy = [...prev];
        if (copy[newIndex]) {
          copy[newIndex] = { ...copy[newIndex], result: errorResult };
        }
        return copy;
      });

      appendExchange({
        prompt: userPrompt,
        result: errorResult,
        position: newIndex,
      }).catch((saveError) => {
        console.error("Failed to persist Ask AI error response:", saveError);
      });

      setLoading(false);
      setActiveTypingIndex(null);
    }
  };

  const handleStop = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
      setLoading(false);
      setActiveTypingIndex(null);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleSaveSnippet = (response) => {
    setSnippetToSave(response);
    setShowSaveModal(true);
  };

  const closeMenu = () => setOpenMenuSessionId(null);

  const handleRenameSession = (session) => {
    closeMenu();
    setSessionToRename(session);
    setRenameTitle(session.title);
  };

  const closeRenameModal = () => {
    setSessionToRename(null);
    setRenameTitle("");
  };

  const confirmRenameSession = () => {
    if (!sessionToRename || !renameTitle.trim()) return;
    renameSession(sessionToRename, renameTitle);
    closeRenameModal();
  };

  const handleDeleteSession = (session) => {
    closeMenu();
    setSessionsToDelete([session]);
  };

  const confirmDeleteSession = () => {
    if (sessionsToDelete.length === 0) return;
    if (sessionsToDelete.length === 1) {
      deleteSession(sessionsToDelete[0]);
    } else {
      deleteSessions(sessionsToDelete);
    }
    setSessionsToDelete([]);
    setSelectedSessionIds([]);
    setSelectionMode(false);
  };

  const toggleSelectionMode = () => {
    closeMenu();
    setSelectionMode((prev) => !prev);
    setSelectedSessionIds([]);
  };

  const toggleSelectedSession = (sessionId) => {
    setSelectedSessionIds((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const selectAllSessions = () => {
    setSelectedSessionIds(sessions.map((session) => session.id));
  };

  const clearSelectedSessions = () => {
    setSelectedSessionIds([]);
  };

  const allSessionsSelected =
    sessions.length > 0 && selectedSessionIds.length === sessions.length;

  const toggleSelectAllSessions = () => {
    if (allSessionsSelected) {
      clearSelectedSessions();
      return;
    }
    selectAllSessions();
  };

  const handleDeleteSelectedSessions = () => {
    const selectedSessions = sessions.filter((session) =>
      selectedSessionIds.includes(session.id)
    );
    setSessionsToDelete(selectedSessions);
  };

  const handleDeleteAllSessions = () => {
    setSessionsToDelete(sessions);
  };

  const handleMenuAction = async (action, session) => {
    closeMenu();

    if (action === "share") await shareSession(session);
    if (action === "pin") await togglePinSession(session);
    if (action === "archive") await toggleArchiveSession(session);
    if (action === "export-json") await exportSession(session, "json");
    if (action === "export-text") await exportSession(session, "txt");
  };

  const confirmSave = ({ folderId, title }) => {
    const snippet = addSnippet({
      title: title || snippetToSave.prompt.slice(0, 40),
      subtitle: "Generated by AI",
      codeContent: snippetToSave.result,
      tags: ["ai", "generated"],
    });

    if (!snippet) return;
    addSnippetToFolder(folderId, snippet.id);
    setShowSaveModal(false);
    toast.success(`Snippet "${snippet.title}" saved!`);
  };

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    const handleDocumentClick = () => closeMenu();
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-4 h-[calc(100vh-8rem)] min-h-[640px] w-full">
      <aside className="border border-[var(--color-border)] bg-[var(--color-bg)] rounded-lg flex flex-col min-h-0 overflow-hidden">
        <div className="p-3 border-b border-[var(--color-border)] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Button
              icon={PlusIcon}
              onClick={createSession}
              disabled={loading || selectionMode}
              className="flex-1 justify-start"
            >
              New chat
            </Button>
            <button
              type="button"
              onClick={toggleSelectionMode}
              disabled={sessions.length === 0}
              className={`h-10 w-10 inline-flex items-center justify-center rounded-md border border-[var(--color-border)] transition-colors ${
                selectionMode
                  ? "bg-[var(--color-text)] text-[var(--color-bg)]"
                  : "bg-transparent text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-superlightbg)]"
              }`}
              title={selectionMode ? "Exit manage mode" : "Manage chats"}
            >
              {selectionMode ? (
                <XMarkIcon className="w-4 h-4" />
              ) : (
                <Squares2X2Icon className="w-4 h-4" />
              )}
            </button>
          </div>

          {selectionMode && (
            <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-superlightbg)] p-2">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-medium text-[var(--color-text)]">
                  {selectedSessionIds.length} selected
                </span>
                <button
                  type="button"
                  onClick={toggleSelectAllSessions}
                  className="bg-transparent p-0 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
                >
                  {allSessionsSelected ? "Clear all" : "Select all"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDeleteSelectedSessions}
                  disabled={selectedSessionIds.length === 0}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-red-200 px-2 py-2 text-xs text-red-600 bg-transparent hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Selected
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAllSessions}
                  disabled={sessions.length === 0}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-red-200 px-2 py-2 text-xs text-red-600 bg-transparent hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <Trash className="w-3.5 h-3.5" />
                  All
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {!loadingChats && sessions.length === 0 && (
            <p className="text-sm text-[var(--color-muted)] px-2 py-3">
              No chats yet
            </p>
          )}

          <div className="flex flex-col gap-1">
            {sessions.map((session) => {
              const isActive = activeSession?.id === session.id;

              return (
                <div key={session.id} className="relative">
                  <button
                    onClick={() =>
                      selectionMode
                        ? toggleSelectedSession(session.id)
                        : selectSession(session.id)
                    }
                    disabled={loading}
                    className={`group w-full text-left ${
                      selectionMode ? "pl-9" : "pl-3"
                    } pr-9 py-2 rounded-md border transition-colors bg-transparent ${
                      isActive
                        ? "border-[var(--color-border)] bg-[var(--color-superlightbg)]"
                        : "border-transparent hover:bg-[var(--color-superlightbg)]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 shrink-0 text-[var(--color-muted)]" />
                      <span className="text-sm font-medium text-[var(--color-text)] truncate">
                        {session.title}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className="text-xs text-[var(--color-muted)]">
                        {formatSessionDate(session.updated_at)}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
                        {session.is_pinned && "Pinned"}
                        {session.is_pinned && session.is_archived && " / "}
                        {session.is_archived && "Archived"}
                      </span>
                    </div>
                  </button>

                  {selectionMode && (
                    <label
                      className="absolute left-3 top-3 inline-flex cursor-pointer"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSessionIds.includes(session.id)}
                        onChange={() => toggleSelectedSession(session.id)}
                        className="sr-only"
                        aria-label={`Select ${session.title}`}
                      />
                      <span
                        className={`w-4 h-4 rounded border inline-flex items-center justify-center ${
                          selectedSessionIds.includes(session.id)
                            ? "bg-[var(--color-text)] border-[var(--color-text)]"
                            : "bg-[var(--color-bg)] border-[var(--color-border)]"
                        }`}
                      >
                        {selectedSessionIds.includes(session.id) && (
                          <CheckIcon className="w-3 h-3 text-[var(--color-bg)]" />
                        )}
                      </span>
                    </label>
                  )}

                  {!selectionMode && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenMenuSessionId((current) =>
                          current === session.id ? null : session.id
                        );
                      }}
                      className="absolute right-2 top-2 p-1 rounded bg-transparent text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]"
                      aria-label={`Open actions for ${session.title}`}
                    >
                      <EllipsisVerticalIcon className="w-4 h-4" />
                    </button>
                  )}

                  {!selectionMode && openMenuSessionId === session.id && (
                    <div
                      onClick={(event) => event.stopPropagation()}
                      className="absolute right-2 top-9 z-20 min-w-44 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] shadow-lg p-1"
                    >
                      <button
                        className="w-full text-left px-3 py-2 rounded-md text-sm bg-transparent text-[var(--color-text)] hover:bg-[var(--color-lightgray)] flex items-center gap-2"
                        onClick={() => handleMenuAction("share", session)}
                      >
                        <ShareIcon className="w-4 h-4" />
                        Share
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 rounded-md text-sm bg-transparent text-[var(--color-text)] hover:bg-[var(--color-lightgray)] flex items-center gap-2"
                        onClick={() => handleMenuAction("pin", session)}
                      >
                        {session.is_pinned ? (
                          <PinOff className="w-4 h-4" />
                        ) : (
                          <Pin className="w-4 h-4" />
                        )}
                        {session.is_pinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 rounded-md text-sm bg-transparent text-[var(--color-text)] hover:bg-[var(--color-lightgray)] flex items-center gap-2"
                        onClick={() => handleRenameSession(session)}
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                        Rename
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 rounded-md text-sm bg-transparent text-[var(--color-text)] hover:bg-[var(--color-lightgray)] flex items-center gap-2"
                        onClick={() => handleMenuAction("archive", session)}
                      >
                        {session.is_archived ? (
                          <ArchiveRestore className="w-4 h-4" />
                        ) : (
                          <Archive className="w-4 h-4" />
                        )}
                        {session.is_archived ? "Unarchive" : "Archive"}
                      </button>
                      <div className="my-1 border-t border-[var(--color-border)]" />
                      <button
                        className="w-full text-left px-3 py-2 rounded-md text-sm bg-transparent text-[var(--color-text)] hover:bg-[var(--color-lightgray)] flex items-center gap-2"
                        onClick={() => handleMenuAction("export-json", session)}
                      >
                        <FileJson className="w-4 h-4" />
                        Export JSON
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 rounded-md text-sm bg-transparent text-[var(--color-text)] hover:bg-[var(--color-lightgray)] flex items-center gap-2"
                        onClick={() => handleMenuAction("export-text", session)}
                      >
                        <FileText className="w-4 h-4" />
                        Export text
                      </button>
                      <div className="my-1 border-t border-[var(--color-border)]" />
                      <button
                        className="w-full text-left px-3 py-2 rounded-md text-sm bg-transparent text-red-600 hover:bg-red-50 flex items-center gap-2"
                        onClick={() => handleDeleteSession(session)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      <section className="border border-[var(--color-border)] bg-[var(--color-bg)] rounded-lg flex flex-col min-h-0 overflow-hidden">
        <header className="px-4 py-3 border-b border-[var(--color-border)]">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-[var(--color-text)] truncate mb-0">
              {activeSession?.title || "Ask AI"}
            </h2>
            {activeSession?.is_archived && (
              <p className="text-xs text-[var(--color-muted)] mb-0">
                This chat is archived
              </p>
            )}
          </div>
        </header>

        <div
          ref={scrollRef}
          className={`flex-1 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col gap-4 ${
            !hasUserSentFirstMessage
              ? "justify-center items-center"
              : "justify-start"
          }`}
        >
          {!hasUserSentFirstMessage && aiResponses.length === 0 && (
            <div className="text-center max-w-md">
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                Ask AI
              </h3>
              <p className="text-[var(--color-muted)] text-sm">
                Type a coding request or continue an existing conversation.
              </p>
            </div>
          )}

          {aiResponses.map((resp, i) => (
            <div key={resp.id || i} className="flex flex-col gap-2 w-full">
              <div className="self-end bg-[var(--color-superlightbg)] text-[var(--color-text)] px-4 py-2.5 text-sm rounded-2xl mb-2 max-w-3xl shadow-sm break-words whitespace-pre-wrap">
                {resp.prompt}
              </div>

              <div className="self-start mb-1 bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)] p-3 rounded-2xl max-w-3xl shadow-sm break-words whitespace-pre-wrap font-mono text-sm">
                {resp.result}
                {loading && i === activeTypingIndex && (
                  <span className="inline-block w-2 h-4 ml-1 bg-[var(--color-text)] animate-pulse"></span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0">
                <button
                  onClick={() => handleCopy(resp.result, i)}
                  className="custom-button text-[var(--color-muted)] hover:text-[var(--color-darkaccent)] hover:bg-transparent flex items-center gap-1.5 text-xs transition p-0"
                >
                  <ClipboardIcon className="w-4 h-4" />
                  {copiedIndex === i ? "Copied" : "Copy"}
                </button>

                <button
                  onClick={() => handleSaveSnippet(resp)}
                  className="custom-button text-[var(--color-muted)] hover:text-[var(--color-darkaccent)] hover:bg-transparent flex items-center gap-1.5 text-xs transition p-0"
                >
                  <CheckIcon className="w-4 h-4" />
                  Save
                </button>

                {loading && i === activeTypingIndex && (
                  <button
                    onClick={handleStop}
                    className="custom-button text-[var(--color-muted)] hover:text-[var(--color-darkaccent)] hover:bg-transparent flex items-center gap-1.5 text-xs transition p-0"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    Stop
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-[var(--color-border)] p-3 sm:p-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              className="bg-[var(--color-superlightbg)] w-full pr-10 text-sm max-h-64 rounded-2xl border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] p-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-lightaccent)] resize-none"
              placeholder={
                activeSession?.is_archived
                  ? "Unarchive this chat to continue..."
                  : "Type a message or coding request..."
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loadingChats || activeSession?.is_archived}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <Button
              icon={loading ? XMarkIcon : ArrowUpIcon}
              onClick={loading ? handleStop : handleGenerate}
              disabled={
                (!prompt.trim() && !loading) ||
                loadingChats ||
                activeSession?.is_archived
              }
              centerContent
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-md"
              iconClassName="w-5 h-5"
            />
          </div>

          <p className="text-xs text-[var(--color-muted)] text-center mt-2 mb-0">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </section>

      {showSaveModal && (
        <SaveModal
          open={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          folders={folders}
          onSave={confirmSave}
        />
      )}

      {sessionsToDelete.length > 0 && (
        <Modal
          isOpen
          onClose={() => setSessionsToDelete([])}
          title="Confirm Deletion"
          cancelText="Cancel"
          confirmText={getDeleteConfirmText(sessionsToDelete.length)}
          onConfirm={confirmDeleteSession}
          requireTextConfirmation="DELETE"
        >
          <p className="text-[var(--color-text)] text-sm">
            {sessionsToDelete.length === 1
              ? `Are you sure you want to delete "${sessionsToDelete[0].title}"?`
              : `Are you sure you want to delete ${sessionsToDelete.length} chats?`}{" "}
            This will permanently remove the selected chat
            {sessionsToDelete.length === 1 ? "" : "s"} and all of their
            messages.
          </p>
        </Modal>
      )}

      {sessionToRename && (
        <Modal
          isOpen
          onClose={closeRenameModal}
          title="Rename Chat"
          cancelText="Cancel"
          confirmText="Rename"
          onConfirm={confirmRenameSession}
        >
          <InputGroup
            id="rename-chat-title"
            label="Chat title"
            value={renameTitle}
            onChange={(event) => setRenameTitle(event.target.value)}
            placeholder="Enter chat title"
          />
        </Modal>
      )}
    </div>
  );
};

export default AskAIPage;
