import { api } from "./api";

/* ===========================
   Generate Interview
=========================== */

export interface InterviewGenerateRequest {
  student_id: number;
  target_role: string;
}

export interface BaseQuestions {
  technical: string[];
  hr: string[];
}

export interface AIQuestions {
  technical: string[];
  follow_up: string[];
  scenario: string[];
}

export interface InterviewGenerateResponse {
  interview_id: number;
  base_questions: BaseQuestions;
  ai_questions: AIQuestions;
}

export async function generateInterview(
  data: InterviewGenerateRequest
): Promise<InterviewGenerateResponse> {
  const response = await api.post(
    "/interview/generate",
    data
  );

  return response.data;
}

/* ===========================
   Evaluate Interview
=========================== */

export interface InterviewEvaluateRequest {
  interview_id: number;
  question: string;
  answer: string;
  target_role: string;
}

export interface InterviewEvaluateResponse {
  technical_score: number;
  communication_score: number;
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export async function evaluateInterview(
  data: InterviewEvaluateRequest
): Promise<InterviewEvaluateResponse> {
  const response = await api.post(
    "/interview/evaluate",
    data
  );

  return response.data;
}
/* ===========================
   Interview History
=========================== */

export interface InterviewHistoryItem {
  interview_id: number;
  target_role: string;
  status: string;
  overall_score: number | null;
  created_at: string;
  completed_at: string | null;
}

export interface InterviewHistoryResponse {
  history: InterviewHistoryItem[];
}

export async function getInterviewHistory(): Promise<InterviewHistoryResponse> {
  const response = await api.get("/interview/history");

  return response.data;
}