import { api } from "./api";

export interface RoadmapResponse {
  student_id: number;
  target_role: string;
  completed_skills: string[];
  missing_skills: string[];
  completion: number;
}

export async function getRoadmap(): Promise<RoadmapResponse> {
  const response = await api.get("/roadmap");
  return response.data;
}