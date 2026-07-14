import { api } from "./api";

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  salary: string;
  job_type: string;
  source: string;
  url: string;
  scraped_at: string;
  match_percent: number;
}

export interface JobsResponse {
  student_id: number;
  target_role: string;
  recommended_jobs: Job[];
}

export async function getRecommendedJobs(): Promise<JobsResponse> {
  const response = await api.get("/jobs/recommend");
  return response.data;
}

export async function refreshJobs() {
  const response = await api.post("/scrape");
  return response.data;
}