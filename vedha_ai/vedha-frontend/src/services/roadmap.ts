import { api } from "./api";

export interface RoadmapResponse {
  student_id: number;
  target_role: string;
  completed_skills: string[];
  missing_skills: string[];
  completion: number;
}

export async function getRoadmap(): Promise<RoadmapResponse> {
  try {
    const response = await api.get("/roadmap");
    return response.data;
  } catch {
    // Fallback when no resume uploaded or network error
    return {
      student_id: 0,
      target_role: "Full Stack Developer",
      completed_skills: ["Python", "React", "JavaScript", "HTML/CSS", "Git"],
      missing_skills: ["FastAPI", "Docker", "PostgreSQL", "AWS", "Kubernetes"],
      completion: 35.7,
    };
  }
}
