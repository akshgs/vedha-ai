// lib/api.ts — Vedha AI API client
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Auto-attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vedha_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-redirect on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("vedha_token");
      localStorage.removeItem("vedha_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string; goal: string; role: string }) =>
    api.post("/api/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data),
  me: () => api.get("/api/auth/me"),
};

// ── Skills ────────────────────────────────────
export const skillsAPI = {
  analyse: (data: { student_id: number; skills: string[]; target_role: string }) =>
    api.post("/api/skills/analyse", data),
  getRoles: () => api.get("/api/skills/roles"),
};

// ── Chat ──────────────────────────────────────
export const chatAPI = {
  send: (data: { student_id: number; message: string }) =>
    api.post("/api/chat/chat", data),
  history: (student_id: number) =>
    api.get(`/api/chat/history/${student_id}`),
};

// ── Quiz ──────────────────────────────────────
export const quizAPI = {
  topics: () => api.get("/api/quiz/topics"),
  questions: (topic: string) => api.get(`/api/quiz/questions/${topic}`),
  submit: (data: { student_id: number; topic: string; answers: Record<string, number> }) =>
    api.post("/api/quiz/submit", data),
};

// ── Leaderboard ───────────────────────────────
export const leaderboardAPI = {
  top: () => api.get("/api/leaderboard/top"),
  myRank: (student_id: number) => api.get(`/api/leaderboard/my-rank/${student_id}`),
};

// ── Jobs / Scraper ────────────────────────────
export const jobsAPI = {
  getJobs: (params?: { source?: string; job_type?: string; limit?: number }) =>
    api.get("/api/scraper/jobs", { params }),
  matchJobs: (student_id: number) =>
    api.get(`/api/scraper/jobs/match/${student_id}`),
  scrape: () => api.post("/api/scraper/scrape"),
  stats: () => api.get("/api/scraper/stats"),
};

// ── Trends ────────────────────────────────────
export const trendsAPI = {
  getTrends: () => api.get("/api/trends/trends"),
};

// ── Opportunities ─────────────────────────────
export const opportunitiesAPI = {
  all: () => api.get("/api/opportunities/all"),
  match: (student_id: number) => api.get(`/api/opportunities/match/${student_id}`),
};