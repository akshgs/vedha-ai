import { api } from "@/services/api";
import type {
  ChatMessage,
  CareerMentorResponse,
  ResumeAnalysisResponse,
  SkillGapResponse,
  RoadmapResponse,
  CodingHelpResponse,
  MockInterviewResponse,
  JobMatchResponse,
  CareerPredictionResponse,
  ResearchAssistantResponse,
  PdfChatResponse,
} from "../types";

// Dynamic availability detection state
let backendOnline = false;

export async function checkBackendAvailability(): Promise<boolean> {
  try {
    const res = await api.get("/health", { timeout: 1500 });
    backendOnline = res.status === 200;
  } catch {
    backendOnline = false;
  }
  return backendOnline;
}

// Auto-trigger backend availability check
checkBackendAvailability();

export function isBackendOnline(): boolean {
  return backendOnline;
}

// 1. AI Career Mentor
export async function chatWithCareerMentor(
  message: string,
  _history: ChatMessage[]
): Promise<CareerMentorResponse> {
  if (isBackendOnline()) {
    const res = await api.post<{ reply: string; session_active: boolean; status: string }>("/ai/mentor/chat", {
      message,
      current_role: "Student",
      target_role: "Software Engineer",
      skills: [],
    });
    return {
      reply: res.data.reply,
      predictedRoles: [],
    };
  }
  // Mock fallback
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reply: `That is an excellent goal! Deepening your knowledge in database connectivity pools like SQL and PostgreSQL will make you highly competitive. I recommend focusing on FastAPI's dependency yield yield pattern.`,
        predictedRoles: ["Backend Engineer", "DevOps Practitioner"],
      });
    }, 800);
  });
}

// 2. AI Resume Analyzer & Builder & ATS score checks
export async function analyzeResume(
  resumeFileContent: string,
  targetRole: string
): Promise<ResumeAnalysisResponse> {
  if (isBackendOnline()) {
    const res = await api.post<ResumeAnalysisResponse>("/ai/resume/analyze", {
      resumeFileContent,
      targetRole,
    });
    return res.data;
  }
  // Mock fallback
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        atsScore: 89,
        extractedSkills: ["React", "TypeScript", "JavaScript", "HTML/CSS"],
        missingSkills: ["Docker", "FastAPI", "PostgreSQL"],
        feedback: [
          {
            section: "Impact Metrics",
            score: 75,
            suggestions: ["Use more action verbs", "Quantify project metrics by adding percentages (e.g. Optimized queries by 35%)."],
          },
          {
            section: "ATS Compatibility",
            score: 95,
            suggestions: ["Layout is clean and standard single-column format."],
          },
        ],
      });
    }, 1000);
  });
}

// 3. AI Skill Gap Analysis
export async function analyzeSkillGap(
  currentSkills: string[],
  targetRole: string
): Promise<SkillGapResponse> {
  if (isBackendOnline()) {
    const res = await api.post<any>("/ai/resume/skill-gap", {
      target_role: targetRole,
      current_skills: currentSkills,
      matched_skills: [],
      missing_skills: []
    });
    const data = res.data;
    return {
      matchPercentage: 100 - (data.gap_score ?? 30),
      presentSkills: currentSkills.map((s) => ({ name: s, proficiency: 85 })),
      missingSkills: [
        ...data.critical_missing.map((s: string) => ({ name: s, priority: "High" as const })),
        ...data.nice_to_have.map((s: string) => ({ name: s, priority: "Medium" as const }))
      ]
    };
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        matchPercentage: 70,
        presentSkills: currentSkills.map((s) => ({ name: s, proficiency: 85 })),
        missingSkills: [
          { name: "FastAPI", priority: "High" },
          { name: "Docker", priority: "High" },
          { name: "SQL PostgreSQL", priority: "Medium" },
        ],
      });
    }, 600);
  });
}

// 4. AI Learning Roadmap
export async function getAILearningRoadmap(targetRole: string): Promise<RoadmapResponse> {
  if (isBackendOnline()) {
    const res = await api.get<RoadmapResponse>(`/ai/roadmap?role=${encodeURIComponent(targetRole)}`);
    return res.data;
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        targetRole,
        completion: 60,
        nodes: [
          { id: 1, name: "Web Basics (HTML/CSS)", desc: "Build foundational static interfaces.", status: "completed", estimatedHours: 12 },
          { id: 2, name: "JavaScript Advanced & Async", desc: "Master asynchronous code execution, callbacks, and promises.", status: "completed", estimatedHours: 18 },
          { id: 3, name: "React Web Applications", desc: "Build modular interfaces, component lifecycles, states, and hooks.", status: "in_progress", estimatedHours: 24 },
          { id: 4, name: "Backend Rest API Design", desc: "Configure FastAPI routes, database integrations, and auth schemas.", status: "locked", estimatedHours: 20 },
          { id: 5, name: "Cloud Containers (Docker/K8s)", desc: "Scale and deploy containers onto AWS.", status: "locked", estimatedHours: 15 },
        ],
      });
    }, 700);
  });
}

// 5. AI Coding Assistant
export async function getCodingAssistantHelp(
  code: string,
  problemId: number,
  language: string,
  errorLog?: string
): Promise<CodingHelpResponse> {
  if (isBackendOnline()) {
    const res = await api.post<CodingHelpResponse>("/ai/coding/assistant", {
      code,
      problemId,
      language,
      errorLog,
    });
    return res.data;
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        debugHint: "Ensure you handle index boundaries correctly. Your current loop might result in an IndexOutOfBounds exception when the array is empty.",
        explanation: "This algorithm targets finding two elements summing up to a target value. A hashmap yields O(n) runtime complexity instead of nesting double loops.",
        suggestedFix: `// Optimization using HashMap:\nconst map = new Map();\nfor (let i = 0; i < nums.length; i++) {\n  const complement = target - nums[i];\n  if (map.has(complement)) return [map.get(complement), i];\n  map.set(nums[i], i);\n}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      });
    }, 900);
  });
}

// 6. AI Mock Interview & Feedback
export async function conductMockInterview(
  interviewId: number,
  transcript: { question: string; answer: string }[]
): Promise<MockInterviewResponse> {
  if (isBackendOnline()) {
    const res = await api.post<MockInterviewResponse>("/ai/interview/simulate", {
      interviewId,
      transcript,
    });
    return res.data;
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      const questionIndex = transcript.length;
      const questions = [
        "What is the difference between client-side rendering and server-side rendering?",
        "Explain how React Virtual DOM updates UI changes efficiently.",
        "How do you manage race conditions in asynchronous actions in Redux or React Hooks?",
      ];
      if (questionIndex >= questions.length) {
        resolve({
          nextQuestion: "Interview completed.",
          isFinished: true,
          overallScore: 84,
          transcripts: transcript.map((t, idx) => ({
            ...t,
            score: 80 + idx * 5,
            feedback: "Answer is clear. Incorporating actual project metrics would enhance authenticity.",
          })),
        });
      } else {
        resolve({
          nextQuestion: questions[questionIndex],
          isFinished: false,
        });
      }
    }, 800);
  });
}

// 7. AI Job Matching
export async function matchJobSuitability(
  studentSkills: string[],
  jobDescription: string
): Promise<JobMatchResponse> {
  if (isBackendOnline()) {
    const res = await api.post<any>("/ai/resume/job-match", {
      student_skills: studentSkills,
      job_description: jobDescription,
    });
    return {
      suitabilityScore: res.data.suitabilityScore,
      alignmentReasoning: res.data.alignmentReasoning,
      suggestedAction: res.data.suggestedAction,
    };
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        suitabilityScore: 85,
        alignmentReasoning: "Your skill profile overlaps strongly with React, TypeScript, and Git requirements. Lack of Docker is the only gap.",
        suggestedAction: "Complete the Docker Container milestone inside your roadmap to boost compatibility to 95%.",
      });
    }, 700);
  });
}

// 8. AI Career & Salary Prediction & Industry Trends
export async function predictCareerPath(): Promise<CareerPredictionResponse> {
  if (isBackendOnline()) {
    try {
      const [profileRes, skillsRes] = await Promise.all([
        api.get<any>("/profile/me").catch(() => ({ data: null })),
        api.get<any[]>("/skill/").catch(() => ({ data: [] })),
      ]);

      const skills = skillsRes.data?.map((s: any) => s.skill_name) || [];
      const currentRole = profileRes.data?.target_role || "Student";
      const experienceYears = parseInt(profileRes.data?.experience) || 0;
      const location = profileRes.data?.location || "India";

      const [careerRes, salaryRes, trendsRes] = await Promise.all([
        api.post<any>("/ai/mentor/career-path", {
          current_role: currentRole,
          experience_years: experienceYears,
          skills: skills,
          interests: [],
        }),
        api.post<any>("/ai/mentor/salary", {
          role: currentRole,
          skills: skills,
          experience_years: experienceYears,
          location: location,
        }),
        api.post<any>("/ai/mentor/trends", {
          domain: "AI/ML",
          skills: skills,
        }),
      ]);

      const careerData = careerRes.data;
      const salaryData = salaryRes.data;
      const trendsData = trendsRes.data;

      return {
        careerRoadmap: careerData.predicted_roles?.map((r: any) => `${r.role} (${r.timeline})`) || [currentRole],
        growthProbability: Math.round((careerData.growth_probability ?? 0.8) * 100),
        salaryProjection: [
          {
            region: `${salaryData.location || location} (LPA / k Currency)`,
            values: [
              { year: "Entry Level", lpa: salaryData.entry_level?.max || 6 },
              { year: "Mid Level", lpa: salaryData.mid_level?.max || 12 },
              { year: "Senior Level", lpa: salaryData.senior_level?.max || 20 },
            ],
          },
        ],
        supplyDemandIndex: trendsData.trending_skills?.map((skill: string) => ({
          skill,
          supply: Math.floor(Math.random() * 30) + 10,
          demand: Math.floor(Math.random() * 40) + 60,
        })) || [],
      };
    } catch (error) {
      console.error("Failed to query career predictions from backend, falling back to mocks", error);
    }
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        careerRoadmap: ["Junior Frontend Developer", "Full Stack Architect", "Technical Director"],
        growthProbability: 92,
        salaryProjection: [
          {
            region: "India (LPA INR)",
            values: [
              { year: "Year 1", lpa: 8 },
              { year: "Year 2", lpa: 11 },
              { year: "Year 3", lpa: 15 },
              { year: "Year 4", lpa: 21 },
            ],
          },
        ],
        supplyDemandIndex: [
          { skill: "FastAPI", supply: 30, demand: 85 },
          { skill: "React", supply: 90, demand: 95 },
          { skill: "Docker", supply: 25, demand: 75 },
        ],
      });
    }, 800);
  });
}

// 9. AI Research Assistant
export async function queryResearchPapers(query: string): Promise<ResearchAssistantResponse> {
  if (isBackendOnline()) {
    const res = await api.post<ResearchAssistantResponse>("/ai/research/query", { query });
    return res.data;
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        papers: [
          {
            id: "paper-1",
            title: "Attention Is All You Need",
            authors: "Vaswani et al.",
            year: "2017",
            abstract: "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
            citationCount: 112000,
          },
          {
            id: "paper-2",
            title: "BERT: Pre-training of Deep Bidirectional Transformers",
            authors: "Devlin et al.",
            year: "2018",
            abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers.",
            citationCount: 45000,
          },
        ],
        summaryMarkdown: "### Key Takeaways:\n- Transformers replaced RNNs/LSTMs in sequence tasks.\n- Multi-head self-attention enables parallelized processing of long contexts.",
      });
    }, 1000);
  });
}

// 10. AI PDF Chat
export async function chatWithPdf(
  _fileId: string,
  question: string
): Promise<PdfChatResponse> {
  if (isBackendOnline()) {
    const res = await api.post<any>("/ai/mentor/pdf/chat", {
      question,
      session_id: "pdf",
    });
    return {
      answer: res.data.answer,
      citations: [],
    };
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        answer: "Based on the uploaded syllabus document, Section 4 details FastAPI route parameters setups, yield dependencies setup, and PostgreSQL connection pool sizing.",
        citations: [
          { filename: "FastAPI_Syllabus.pdf", page: 4, snippet: "The db session dependency is initialized using yield session context managers..." },
        ],
      });
    }, 900);
  });
}

// 11. PDF Document Upload
export async function uploadPdf(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/ai/mentor/pdf/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

