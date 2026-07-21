import { api } from "./api";

export interface ResumeAnalysisResponse {
  student_id: number;
  filename: string;
  target_role: string;

  ats_score: number;

  extracted_skills: string[];
  matched_skills: string[];
  missing_skills: string[];

  total_skills_found: number;
  match_percent: number;

  ai_feedback: string;
}

export async function uploadResume(
  file: File,
  targetRole: string
): Promise<ResumeAnalysisResponse> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("target_role", targetRole);

  const response = await api.post(
    "/resume/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}