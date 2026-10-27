import axios from "axios";

const configuredApiUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://govtender-backend.onrender.com/api"
    : "http://localhost:5000/api");

const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, "");

export const API_BASE_URL = /\/api$/i.test(normalizedApiUrl)
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

export const API_ORIGIN = API_BASE_URL.replace(/\/api$/i, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("govtender_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("govtender_token");
      localStorage.removeItem("govtender_user");
    }

    return Promise.reject(error);
  }
);

export default api;
