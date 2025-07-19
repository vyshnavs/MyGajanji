import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Uses value from .env
  headers: {
    "Content-Type": "application/json",
  },
});

// You can set up interceptors here if needed (e.g., for auth token)

export default api;
