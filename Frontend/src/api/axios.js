import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://localhost:5000"),
  withCredentials: true,
});

// GLOBAL ERROR HANDLER
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const requestPath = error.config?.url || "";
      const currentPath = window.location.pathname;

      if (
        error.response.status === 401 &&
        requestPath !== "/auth/check-auth" &&
        currentPath !== "/login"
      ) {
        window.location.href = "/login";
      }

      if (error.response.status === 403) {
        window.location.href = "/unauthorized";
      }
    }
    return Promise.reject(error);
  }
);

export default api;