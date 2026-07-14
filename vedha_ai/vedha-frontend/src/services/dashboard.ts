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
}

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await api.get("/dashboard");

  return response.data;
}