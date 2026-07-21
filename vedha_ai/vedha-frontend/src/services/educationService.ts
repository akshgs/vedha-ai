import { api } from "./api";

export interface Education {
  id?: number;
  institution: string;
  degree: string;
  field_of_study: string;
  cgpa?: number | null;
  percentage?: number | null;
  start_date: string;
  end_date?: string;
  currently_studying: boolean;
  description?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export const getEducations = async () => {
  const response = await api.get("/education/");
  return response.data;
};

export const createEducation = async (data: Education) => {
  const response = await api.post("/education/create", data);
  return response.data;
};

export const updateEducation = async (
  id: number,
  data: Partial<Education>
) => {
  const response = await api.put(`/education/${id}`, data);
  return response.data;
};

export const deleteEducation = async (id: number) => {
  const response = await api.delete(`/education/${id}`);
  return response.data;
};