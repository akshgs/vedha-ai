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
  const response = await api.get(
    "/interview/history"
  );

  return response.data;
}

/* ===========================
   Complete Interview
=========================== */

export interface InterviewCompleteRequest {
  interview_id: number;
}

export interface InterviewCompleteResponse {
  interview_id: number;
  status: string;
  overall_score: number;
  message: string;
}

export async function completeInterview(
  data: InterviewCompleteRequest
): Promise<InterviewCompleteResponse> {
  const response = await api.post(
    "/interview/complete",
    data
  );

  return response.data;
}

/* ===========================
   Interview Report
=========================== */

export interface InterviewReportResponse {
  overall_assessment: string;
  technical_level: string;
  communication_level: string;
  strengths: string[];
  weaknesses: string[];
  recommended_topics: string[];
  recommended_projects: string[];
  job_readiness: string;
  next_learning_plan: string;
  hiring_recommendation: string;
}

export async function getInterviewReport(
  interviewId: number
): Promise<InterviewReportResponse> {
  const response = await api.get(
    `/interview/report/${interviewId}`
  );

  return response.data;
}