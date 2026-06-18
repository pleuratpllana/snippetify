import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

const mapSupabaseUser = (supabaseUser) => {
  if (!supabaseUser) return null;

  const metadata = supabaseUser.user_metadata || {};

  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    username:
      metadata.username ||
      metadata.name ||
      supabaseUser.email?.split("@")[0] ||
      "",
    firstName: metadata.firstName || "",
    lastName: metadata.lastName || "",
    accountType: metadata.accountType || "Free",
    createdAt: supabaseUser.created_at,
    lastLogin: supabaseUser.last_sign_in_at || new Date().toISOString(),
    emailConfirmed: !!supabaseUser.email_confirmed_at,
  };
};

const clearStaleAuthState = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      clearStaleAuthState();
      setSession(data.session);
      setToken(data.session?.access_token || null);
      setUser(mapSupabaseUser(data.session?.user));
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      clearStaleAuthState();
      setSession(nextSession);
      setToken(nextSession?.access_token || null);
      setUser(mapSupabaseUser(nextSession?.user));
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async ({ email, password, username }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) throw error;
    return data;
  };

  const signInWithPassword = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    clearStaleAuthState();
    setSession(null);
    setToken(null);
    setUser(null);
  };

  const login = async (_jwt, userData) => {
    setUser(userData);
  };

  const isAuthenticated = !!session;

  return (
    <AuthContext.Provider
      value={{
        session,
        token,
        user,
        setUser,
        login,
        logout,
        signUp,
        signInWithPassword,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
