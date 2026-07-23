import { api } from "./api";

export interface ResumeAnalysisResult {
  student_id: number;
  filename: string;
  target_role: string;

  extracted_skills: string[];
  total_skills_found: number;

  match_percent: number;
  ats_score: number;

  matched_skills: string[];
  missing_skills: string[];

  ai_feedback: string;
}

export async function analyzeResume(
  file: File,
  targetRole: string
): Promise<ResumeAnalysisResult> {
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