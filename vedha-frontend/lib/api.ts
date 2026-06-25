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
  refresh: () => api.get("/api/trends/refresh"),
  getSkillDemand: () => api.get("/api/trends/skills"),
};

// ── Opportunities ─────────────────────────────
export const opportunitiesAPI = {
  all: () => api.get("/api/opportunities/all"),
  match: (student_id: number) => api.get(`/api/opportunities/match/${student_id}`),
};

// ── Resume Scanner ────────────────────────────
export const resumeAPI = {
  scan: (formData: FormData) =>
    api.post("/api/resume/scan", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ── Mock Interview ────────────────────────────
export const interviewAPI = {
  questions: (role: string) => api.get(`/api/interview/questions/${role}`),
  analyze: (formData: FormData) =>
    api.post("/api/interview/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ── ML Skill Predictions ──────────────────────
export const predictAPI = {
  train: () => api.post("/api/predict/train"),
  predictAll: () => api.get("/api/predict/predict-all"),
  topSkills: () => api.get("/api/predict/top-skills"),
  modelStatus: () => api.get("/api/predict/model-status"),
};

// ── LeetCode Sync & DSA Practice ──────────────
export const leetcodeAPI = {
  tracks: () => api.get("/api/leetcode/tracks"),
  topics: (track: string) => api.get(`/api/leetcode/topics/${track}`),
  practice: (data: { student_id: number; track: string; topic: string; difficulty: string }) =>
    api.post("/api/leetcode/practice", data),
  hint: (data: { student_id: number; track: string; topic: string; problem: string; hint_level: number; code?: string }) =>
    api.post("/api/leetcode/hint", data),
  history: (student_id: number) => api.get(`/api/leetcode/history/${student_id}`),
};

export const agentAPI = {
  careerAnalysis: (data: {
    resume_text: string;
    target_role: string;
  }) =>
    api.post("/api/agents/career-analysis", data),
};

// ── Knowledge Base ────────────────────────────
export const knowledgeAPI = {
  addText: (data: { text: string; label?: string }) =>
    api.post("/api/knowledge/add_text", data),
  uploadPdf: (formData: FormData) =>
    api.post("/api/knowledge/upload_pdf", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  uploadText: (formData: FormData) =>
    api.post("/api/knowledge/upload_text", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  search: (data: { question: string; top_k?: number }) =>
    api.post("/api/knowledge/search", data),
  stats: () => api.get("/api/knowledge/stats"),
};

// ── Dashboard Stats ───────────────────────────
export const dashboardAPI = {
  getDashboard: (student_id: number) =>
    api.get(`/api/dashboard/${student_id}`),
};

// ── Placement Score ───────────────────────────
export const placementAPI = {
  getPlacementScore: (student_id: number) =>
    api.get(`/api/placement/placement-score/${student_id}`),
};

// ── Learning Roadmap ──────────────────────────
export const roadmapAPI = {
  generate: (data: { student_id: number }) =>
    api.post("/api/roadmap/generate", data),
};

// ── Semantic Job Recommendations ──────────────
export const jobRecommendationAPI = {
  recommend: (data: { student_id: number }) =>
    api.post("/api/jobs/recommend", data),
};