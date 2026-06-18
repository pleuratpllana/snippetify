import { supabase } from "../lib/supabaseClient";

const CHAT_SESSION_COLUMNS =
  "id,user_id,title,is_pinned,is_archived,created_at,updated_at";
const CHAT_SESSION_COLUMNS_WITHOUT_PIN =
  "id,user_id,title,is_archived,created_at,updated_at";
const CHAT_MESSAGE_COLUMNS =
  "id,session_id,user_id,prompt,result,position,created_at";

const isMissingPinnedColumnError = (error) =>
  error?.code === "PGRST204" && error?.message?.includes("is_pinned");

const normalizeSession = (session) => ({
  ...session,
  is_pinned: session.is_pinned ?? false,
});

export const askAIChatService = {
  async listSessions(userId) {
    const { data, error } = await supabase
      .from("ask_ai_chat_sessions")
      .select(CHAT_SESSION_COLUMNS)
      .eq("user_id", userId)
      .order("is_pinned", { ascending: false })
      .order("is_archived", { ascending: true })
      .order("updated_at", { ascending: false });

    if (isMissingPinnedColumnError(error)) {
      const fallback = await supabase
        .from("ask_ai_chat_sessions")
        .select(CHAT_SESSION_COLUMNS_WITHOUT_PIN)
        .eq("user_id", userId)
        .order("is_archived", { ascending: true })
        .order("updated_at", { ascending: false });

      if (fallback.error) throw fallback.error;
      return (fallback.data || []).map(normalizeSession);
    }

    if (error) throw error;
    return (data || []).map(normalizeSession);
  },

  async createSession(userId, title = "New chat") {
    const { data, error } = await supabase
      .from("ask_ai_chat_sessions")
      .insert({ user_id: userId, title })
      .select(CHAT_SESSION_COLUMNS)
      .single();

    if (isMissingPinnedColumnError(error)) {
      const fallback = await supabase
        .from("ask_ai_chat_sessions")
        .insert({ user_id: userId, title })
        .select(CHAT_SESSION_COLUMNS_WITHOUT_PIN)
        .single();

      if (fallback.error) throw fallback.error;
      return normalizeSession(fallback.data);
    }

    if (error) throw error;
    return normalizeSession(data);
  },

  async updateSession(sessionId, userId, updates) {
    const { data, error } = await supabase
      .from("ask_ai_chat_sessions")
      .update(updates)
      .eq("id", sessionId)
      .eq("user_id", userId)
      .select(CHAT_SESSION_COLUMNS)
      .single();

    if (isMissingPinnedColumnError(error)) {
      if ("is_pinned" in updates) {
        throw new Error(
          "The is_pinned column is missing in Supabase. Run the Ask AI pinning SQL before using Pin."
        );
      }

      const fallback = await supabase
        .from("ask_ai_chat_sessions")
        .update(updates)
        .eq("id", sessionId)
        .eq("user_id", userId)
        .select(CHAT_SESSION_COLUMNS_WITHOUT_PIN)
        .single();

      if (fallback.error) throw fallback.error;
      return normalizeSession(fallback.data);
    }

    if (error) throw error;
    return normalizeSession(data);
  },

  async deleteSession(sessionId, userId) {
    const { error } = await supabase
      .from("ask_ai_chat_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("user_id", userId);

    if (error) throw error;
  },

  async deleteSessions(sessionIds, userId) {
    const { error } = await supabase
      .from("ask_ai_chat_sessions")
      .delete()
      .eq("user_id", userId)
      .in("id", sessionIds);

    if (error) throw error;
  },

  async listMessages(sessionId, userId) {
    const { data, error } = await supabase
      .from("ask_ai_chat_messages")
      .select(CHAT_MESSAGE_COLUMNS)
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createMessage(userId, sessionId, message) {
    const { data, error } = await supabase
      .from("ask_ai_chat_messages")
      .insert({
        user_id: userId,
        session_id: sessionId,
        prompt: message.prompt,
        result: message.result,
        position: message.position,
      })
      .select(CHAT_MESSAGE_COLUMNS)
      .single();

    if (error) throw error;
    return data;
  },
};
