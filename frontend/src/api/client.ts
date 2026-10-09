import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dagno_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("dagno_token");
      localStorage.removeItem("dagno_user");
    }
    return Promise.reject(error);
  }
);

export const UPLOADS_URL =
  import.meta.env.VITE_UPLOADS_URL ?? "http://localhost:4000";