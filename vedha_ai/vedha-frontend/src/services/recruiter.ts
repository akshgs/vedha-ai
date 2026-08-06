import { api } from "./api";

export interface Candidate {
  id: number;
  name: string;
  targetRole: string;
  skills: string[];
  resumeScore: number;
  codingSolved: number;
  experienceYears: number;
  matchScore?: number;
}

export interface PipelineStage {
  id: string;
  title: string;
  candidates: {
    id: number;
    name: string;
    targetRole: string;
    notes?: string;
  }[];
}

export interface RecruiterStats {
  openPostings: number;
  totalApplicants: number;
  shortlistedCount: number;
  interviewsHeld: number;
}

export async function getRecruiterStats(): Promise<RecruiterStats> {
  try {
    const { data } = await api.get<RecruiterStats>("/recruiter/stats");
    return data;
  } catch {
    return {
      openPostings: 5,
      totalApplicants: 142,
      shortlistedCount: 32,
      interviewsHeld: 15,
    };
  }
}

export async function searchCandidates(query: string, minScore = 0, skillFilter?: string): Promise<Candidate[]> {
  try {
    const { data } = await api.get<Candidate[]>("/recruiter/candidates", { params: { query, minScore, skillFilter } });
    return data;
  } catch {
    const all = [
      { id: 1, name: "Pranav M.", targetRole: "Backend Engineer", skills: ["React", "FastAPI", "PostgreSQL", "Docker"], resumeScore: 88, codingSolved: 72, experienceYears: 2 },
      { id: 2, name: "Shruti S.", targetRole: "Frontend Developer", skills: ["React", "TypeScript", "Tailwind", "Next.js"], resumeScore: 91, codingSolved: 45, experienceYears: 3 },
      { id: 3, name: "Akash Patel", targetRole: "Full Stack Developer", skills: ["React", "TypeScript", "FastAPI", "Docker", "PostgreSQL"], resumeScore: 89, codingSolved: 120, experienceYears: 2 },
      { id: 4, name: "Kunal K.", targetRole: "DevOps Engineer", skills: ["Kubernetes", "Docker", "Terraform", "AWS"], resumeScore: 82, codingSolved: 30, experienceYears: 4 },
    ];
    
    return all.filter((c) => {
      if (skillFilter && !c.skills.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase()))) return false;
      if (c.resumeScore < minScore) return false;
      if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !c.targetRole.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }
}

export async function getRankedCandidates(jobId: number): Promise<Candidate[]> {
  try {
    const { data } = await api.get<Candidate[]>(`/recruiter/jobs/${jobId}/rankings`);
    return data;
  } catch {
    return [
      { id: 3, name: "Akash Patel", targetRole: "Full Stack Developer", skills: ["React", "TypeScript", "FastAPI", "Docker"], resumeScore: 89, codingSolved: 120, experienceYears: 2, matchScore: 94 },
      { id: 1, name: "Pranav M.", targetRole: "Backend Engineer", skills: ["React", "FastAPI", "PostgreSQL"], resumeScore: 88, codingSolved: 72, experienceYears: 2, matchScore: 89 },
      { id: 2, name: "Shruti S.", targetRole: "Frontend Developer", skills: ["React", "TypeScript", "Tailwind"], resumeScore: 91, codingSolved: 45, experienceYears: 3, matchScore: 78 },
    ];
  }
}

export async function getPipeline(): Promise<PipelineStage[]> {
  try {
    const { data } = await api.get<PipelineStage[]>("/recruiter/pipeline");
    return data;
  } catch {
    return [
      {
        id: "screening",
        title: "Screening",
        candidates: [
          { id: 10, name: "Amit Shah", targetRole: "Node Developer", notes: "Awaiting resume screening check." },
        ],
      },
      {
        id: "technical",
        title: "Technical Round",
        candidates: [
          { id: 1, name: "Pranav M.", targetRole: "Backend Engineer", notes: "Assigned code challenge." },
          { id: 2, name: "Shruti S.", targetRole: "Frontend Developer", notes: "Monaco sandbox complete." },
        ],
      },
      {
        id: "hr",
        title: "HR Round",
        candidates: [
          { id: 3, name: "Akash Patel", targetRole: "Full Stack Developer", notes: "Culture fit schedule set." },
        ],
      },
      {
        id: "offer",
        title: "Offer Stage",
        candidates: [],
      },
    ];
  }
}

export async function updateCandidateStage(candidateId: number, fromStage: string, toStage: string): Promise<void> {
  await api.post("/recruiter/pipeline/move", { candidateId, fromStage, toStage });
}

export async function scheduleInterview(candidateId: number, dateTime: string, notes: string): Promise<void> {
  await api.post("/recruiter/interviews/schedule", { candidateId, dateTime, notes });
}
