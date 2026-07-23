import { api } from "./api";

export interface Skill {
  id?: number;
  user_id?: number;

  skill_name: string;
  category?: string | null;
  proficiency_level: string;
  years_of_experience?: number | null;
  last_used?: string | null;
  is_primary: boolean;

  created_at?: string;
  updated_at?: string;
}

export const getSkills = async () => {
  const response = await api.get<Skill[]>("/skill/");
  return response.data;
};

export const createSkill = async (
  data: Skill
) => {
  const response = await api.post<Skill>(
    "/skill/create",
    data
  );

  return response.data;
};

export const updateSkill = async (
  id: number,
  data: Partial<Skill>
) => {
  const response = await api.put<Skill>(
    `/skill/${id}`,
    data
  );

  return response.data;
};

export const deleteSkill = async (id: number) => {
  await api.delete(`/skill/${id}`);
};