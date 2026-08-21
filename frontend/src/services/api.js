import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Prevent multiple refresh requests at the same time
let isRefreshing = false;
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Never refresh these requests
    const isMeRequest = originalRequest.url?.includes("/auth/me");
    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh");

    if (isMeRequest || isRefreshRequest) {
      return Promise.reject(error);
    }

    // Don't retry the same request more than once
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // If another request is already refreshing,
      // wait for that same refresh request.
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = api.post("/auth/refresh").finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      await refreshPromise;

      // Access token is stored in the HttpOnly cookie
      // by the backend, so simply retry the original request.
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export default api;
