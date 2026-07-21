import { api } from "./api";

export interface Project {
  id?: number;
  project_name: string;
  role: string;
  description: string;
  technologies: string;
  github_url?: string | null;
  live_url?: string | null;
  start_date: string;
  end_date?: string | null;
  currently_working: boolean;
  team_size?: number | null;
  featured: boolean;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export const getProjects = async () => {
  const response = await api.get("/project/");
  return response.data;
};

export const createProject = async (data: Project) => {
  const response = await api.post("/project/create", data);
  return response.data;
};

export const updateProject = async (
  id: number,
  data: Partial<Project>
) => {
  const response = await api.put(`/project/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number) => {
  const response = await api.delete(`/project/${id}`);
  return response.data;
};