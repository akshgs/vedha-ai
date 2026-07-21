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
  try {
    const response = await api.get<DashboardResponse>("/dashboard");

    console.log("Dashboard API Response:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Dashboard API Error:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }

    throw error;
  }
}