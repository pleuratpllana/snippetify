// src/config/api.js
import axios from "axios";
import { supabase } from "../lib/supabaseClient";

const api = axios.create({
  baseURL: "http://localhost:5173",
  headers: {
    "Content-Type": "application/json",
  },
});

let cachedSession = null;
let sessionPromise = null;

const getSession = async () => {
  if (cachedSession) return cachedSession;

  if (!sessionPromise) {
    sessionPromise = supabase.auth.getSession().then(({ data }) => {
      cachedSession = data.session;
      sessionPromise = null;
      return cachedSession;
    });
  }

  return sessionPromise;
};

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    if (status === 401) {
      originalRequest._retry = true;

      try {
        const { data, error: refreshError } =
          await supabase.auth.refreshSession();

        if (refreshError) {
          cachedSession = null;
          await supabase.auth.signOut();
          return Promise.reject(refreshError);
        }

        cachedSession = data.session;

        const newToken = cachedSession?.access_token;

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return api(originalRequest);
      } catch (err) {
        cachedSession = null;
        await supabase.auth.signOut();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
