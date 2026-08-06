import { api } from "./api";

export interface RecentInterview {
  interview_id: number;
  target_role: string;
  status: string;
  overall_score: number;
  created_at: string;
}

export interface DashboardResponse {
  student_name: string;
  resume_score: number;
  total_jobs: number;
  total_interviews: number;
  completed_interviews: number;
  average_interview_score: number;
  best_interview_score: number;
  roadmap_progress: number;
  career_readiness: number;
  recent_interviews: RecentInterview[];
  target_role?: string;
  dream_company?: string;
  today_mission?: string;
  next_skill?: string;
  ecosystem_stage?: string;
}

export async function getDashboard(): Promise<DashboardResponse> {
  try {
    const response = await api.get<DashboardResponse>("/dashboard");
    return response.data;
  } catch {
    // Fallback mock data when backend is unavailable or no resume uploaded
    return {
      student_name: localStorage.getItem("user_name") ?? "Student",
      resume_score: 35.0,
      total_jobs: 142,
      total_interviews: 3,
      completed_interviews: 2,
      average_interview_score: 72.5,
      best_interview_score: 84.0,
      roadmap_progress: 35.7,
      career_readiness: 61.2,
      recent_interviews: [
        { interview_id: 1, target_role: "Full Stack Developer", status: "completed", overall_score: 84.0, created_at: "2026-08-03" }
      ],
      target_role: "Full Stack Developer",
      dream_company: "Vercel",
      today_mission: "Complete HTML & CSS Foundations module in Learning Academy.",
      next_skill: "HTML & CSS Basics",
      ecosystem_stage: "learning",
    };
  }
}