import { api } from "./api";

export interface Profile {
  id: number;
  user_id: number;

  phone: string;
  about: string;
  location: string;

  college: string;
  degree: string;
  department: string;
  year: string;

  company: string;
  designation: string;
  experience: string;

  skills: string;

  github_url: string;
  linkedin_url: string;
  portfolio_url: string;

  target_role: string;

  profile_image: string | null;
  career_readiness: number;
}

export interface ProfileUpdate {
  phone?: string;
  about?: string;
  location?: string;

  college?: string;
  degree?: string;
  department?: string;
  year?: string;

  company?: string;
  designation?: string;
  experience?: string;

  skills?: string;

  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;

  target_role?: string;
}

export async function getProfile(): Promise<Profile> {
  const response = await api.get("/profile/me");
  return response.data;
}

export async function updateProfile(data: ProfileUpdate) {
  const response = await api.put("/profile/update", data);
  return response.data;
}