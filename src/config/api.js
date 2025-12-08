import axios from "axios";
import { getToken } from "./authHelper";

export const api = axios.create({
  baseURL: "http://localhost:1337",
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
