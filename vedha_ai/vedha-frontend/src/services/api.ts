import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    if (status === 401) {
      localStorage.removeItem("access_token");
      toast.error("Session expired. Please log in again.");
    } else if (status === 403) {
      toast.error(detail ?? "You are not authorized to access this resource.");
    } else if (status === 500) {
      toast.error("Internal Server Error. Please contact support.");
    } else if (status >= 400 && status < 500) {
      // General user client error
      toast.error(detail ?? "Request error encountered.");
    }

    return Promise.reject(error);
  }
);