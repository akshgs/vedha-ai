import { api } from "./api";

export interface Experience {
  id?: number;
  company: string;
  job_title: string;
  employment_type: string;
  location?: string | null;
  start_date: string;
  end_date?: string | null;
  currently_working: boolean;
  technologies?: string | null;
  description?: string | null;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export const getExperiences = async () => {
  const response = await api.get("/experience/");
  return response.data;
};

export const createExperience = async (
  data: Experience
) => {
  const response = await api.post(
    "/experience/create",
    data
  );

  return response.data;
};

export const updateExperience = async (
  id: number,
  data: Partial<Experience>
) => {
  const response = await api.put(
    `/experience/${id}`,
    data
  );

  return response.data;
};

export const deleteExperience = async (
  id: number
) => {
  const response = await api.delete(
    `/experience/${id}`
  );

  return response.data;
};