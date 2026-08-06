export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface CareerMentorRequest {
  message: string;
  history: ChatMessage[];
}

export interface CareerMentorResponse {
  reply: string;
  predictedRoles?: string[];
}

export interface ResumeAnalysisRequest {
  resumeFileContent: string;
  targetRole: string;
}

export interface ResumeAnalysisResponse {
  atsScore: number;
  extractedSkills: string[];
  missingSkills: string[];
  feedback: {
    section: string;
    score: number;
    suggestions: string[];
  }[];
}

export interface SkillGapRequest {
  currentSkills: string[];
  targetRole: string;
}

export interface SkillGapResponse {
  matchPercentage: number;
  presentSkills: { name: string; proficiency: number }[];
  missingSkills: { name: string; priority: "High" | "Medium" | "Low" }[];
}

export interface RoadmapNode {
  id: number;
  name: string;
  desc: string;
  status: "completed" | "in_progress" | "locked";
  estimatedHours: number;
}

export interface RoadmapResponse {
  targetRole: string;
  completion: number;
  nodes: RoadmapNode[];
}

export interface CodingHelpRequest {
  code: string;
  problemId: number;
  language: string;
  errorLog?: string;
}

export interface CodingHelpResponse {
  debugHint: string;
  explanation: string;
  suggestedFix: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface InterviewTranscriptItem {
  question: string;
  answer: string;
  score?: number;
  feedback?: string;
}

export interface MockInterviewResponse {
  nextQuestion: string;
  isFinished: boolean;
  overallScore?: number;
  transcripts?: InterviewTranscriptItem[];
}

export interface JobMatchRequest {
  studentSkills: string[];
  jobDescription: string;
}

export interface JobMatchResponse {
  suitabilityScore: number;
  alignmentReasoning: string;
  suggestedAction: string;
}

export interface CareerPredictionResponse {
  careerRoadmap: string[];
  growthProbability: number;
  salaryProjection: { region: string; values: { year: string; lpa: number }[] }[];
  supplyDemandIndex: { skill: string; supply: number; demand: number }[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  year: string;
  abstract: string;
  citationCount: number;
}

export interface ResearchAssistantResponse {
  papers: ResearchPaper[];
  summaryMarkdown: string;
}

export interface PdfChatResponse {
  answer: string;
  citations: { filename: string; page: number; snippet: string }[];
}
