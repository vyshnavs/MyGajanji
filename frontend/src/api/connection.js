import axios from "axios";
import { getToken } from "../utils/auth";

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // from .env
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to attach token and check expiry (except for public routes)
api.interceptors.request.use(
  (config) => {
    // List of routes that don't need token checking
    const publicRoutes = ["/auth/login", "/auth/register","/auth/google-login"];

    // If request is going to a public route, skip token logic
    if (publicRoutes.some((route) => config.url.endsWith(route))) {
      return config;
    }

    // For protected routes, check token
    const token = getToken(); // clears expired token automatically

    if (!token) {
      // Redirect to login if token missing/expired
      window.location.href = "/login";
      return Promise.reject("Token expired or missing");
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
