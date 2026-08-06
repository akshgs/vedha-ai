import { api } from "./api";

export interface AssessedSkill {
  skill_name: string;
  proficiency_level: string;
}

export interface OnboardingPayload {
  target_role: string;
  skills: AssessedSkill[];
  college?: string;
  degree?: string;
  experience?: string;
  interests?: string;
}

export interface IndustryIntelligence {
  trending_skills: string[];
  companies_hiring: string[];
  outlook: string;
  average_salary: number;
  demand_index: number;
}

export interface RoadmapStage {
  title: string;
  duration: string;
  topics: string[];
}

export interface RoadmapTemplate {
  target_role: string;
  required_skills: string[];
  stages: RoadmapStage[];
}

// 1. Submit Onboarding Data (Goal & Skills)
export async function completeStudentOnboarding(payload: OnboardingPayload): Promise<void> {
  await api.post("/onboarding/complete", payload);
}

// 2. Fetch Industry Intelligence Trends for target role
export async function getOnboardingTrends(role: string): Promise<IndustryIntelligence> {
  try {
    const res = await api.get<IndustryIntelligence>(`/onboarding/trends?role=${encodeURIComponent(role)}`);
    return res.data;
  } catch {
    // Fallback mock trends matching getSalaryBands / getCareerTracks
    return {
      trending_skills: ["Python", "FastAPI", "React", "Docker", "AWS"],
      companies_hiring: ["Google DeepMind", "Meta", "Spotify", "Razorpay"],
      outlook: "Strong market demand for modern full-stack integrations.",
      average_salary: (role.includes("Backend") || role.includes("AI")) ? 14.0 : 11.5,
      demand_index: role.includes("AI") ? 92 : 80
    };
  }
}

// 3. Fetch Initial Roadmap Preview for target role
export async function getOnboardingRoadmap(role: string): Promise<RoadmapTemplate> {
  try {
    const res = await api.get<RoadmapTemplate>(`/onboarding/roadmap?role=${encodeURIComponent(role)}`);
    return res.data;
  } catch {
    // Fallback template
    return {
      target_role: role,
      required_skills: ["React", "FastAPI", "SQL", "Docker", "AWS"],
      stages: [
        { title: "Foundations", duration: "4 weeks", topics: ["Programming basics", "Version Control"] },
        { title: "Core Development", duration: "6 weeks", topics: ["API architectures", "Databases"] },
        { title: "DevOps & Cloud", duration: "4 weeks", topics: ["Containers", "Cloud Deployment"] }
      ]
    };
  }
}

export interface SkillDNA {
  programming: number;
  logic: number;
  math: number;
  communication: number;
  devops: number;
}

// 4. Fetch student Skill DNA scores for radar chart
export async function getSkillDNA(): Promise<SkillDNA> {
  try {
    const res = await api.get<SkillDNA>("/onboarding/skill-dna");
    return res.data;
  } catch {
    // Fallback demo scores — always safe for presentation
    return {
      programming: 65,
      logic: 55,
      math: 40,
      communication: 70,
      devops: 25,
    };
  }
}

export async function completeOnboardingSkill(skillName: string): Promise<any> {
  const res = await api.post("/courses/complete-skill", { skill_name: skillName });
  return res.data;
}
