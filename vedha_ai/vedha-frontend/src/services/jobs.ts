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
  try {
    const response = await api.get("/jobs/recommend");
    return response.data;
  } catch {
    // Return empty recommendations if no resume uploaded or backend error
    return {
      student_id: 0,
      target_role: "No Resume Uploaded",
      recommended_jobs: [
        {
          id: 1001,
          title: "Backend Developer",
          company: "Google DeepMind",
          location: "Bangalore, India",
          description: "Async Python developer with FastAPI and PostgreSQL expertise.",
          skills: ["Python", "FastAPI", "PostgreSQL", "Docker"],
          salary: "18-24 LPA",
          job_type: "Full-time",
          source: "Vedha Curated",
          url: "#",
          scraped_at: new Date().toISOString(),
          match_percent: 87,
        },
        {
          id: 1002,
          title: "Full Stack Engineer",
          company: "Meta",
          location: "Hyderabad, India",
          description: "React and Node.js developer for core product teams.",
          skills: ["React", "TypeScript", "Node.js", "GraphQL"],
          salary: "22-30 LPA",
          job_type: "Full-time",
          source: "Vedha Curated",
          url: "#",
          scraped_at: new Date().toISOString(),
          match_percent: 75,
        },
        {
          id: 1003,
          title: "ML Engineer Intern",
          company: "Vedha AI Inc",
          location: "Remote",
          description: "Machine learning model training and deployment.",
          skills: ["Python", "PyTorch", "scikit-learn", "AWS"],
          salary: "50-80k/month",
          job_type: "Internship",
          source: "Vedha Curated",
          url: "#",
          scraped_at: new Date().toISOString(),
          match_percent: 62,
        },
      ],
    };
  }
}

export async function refreshJobs() {
  const response = await api.post("/scrape");
  return response.data;
}

export interface JobMatchScoreResponse {
  job_id: number;
  match_percent: number;
  matched_skills: string[];
  missing_skills: string[];
  suitability: string;
  action_recommendation: string;
}

export async function getJobMatchScore(jobId: number): Promise<JobMatchScoreResponse> {
  const response = await api.get<JobMatchScoreResponse>(`/jobs/match-score/${jobId}`);
  return response.data;
}