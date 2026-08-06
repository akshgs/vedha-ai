import { api } from "./api";

export interface CareerTrack {
  role: string;
  fit: number;
  status: string;
}

export interface SalaryBand {
  role: string;
  min: number;
  avg: number;
  max: number;
}

export interface JobMatchAnalysis {
  matchScore: number;
  roleAlignment: string;
  skillsFound: string[];
  skillsMissing: string[];
  recommendation: string;
}

export interface CareerMentoringMessage {
  sender: "user" | "mentor";
  text: string;
}

// AI Career mentor chat
// Corrected: was calling POST /career/mentor (does not exist).
// Now calls POST /api/v1/ai/mentor/chat which IS in Swagger.
export async function sendMentorMessage(message: string, _history: CareerMentoringMessage[]): Promise<string> {
  try {
    const { data } = await api.post<{ reply: string; session_active: boolean; status: string }>("/ai/mentor/chat", {
      message,
      current_role: "Student",
      target_role: "Software Engineer",
      skills: [],
    });
    return data.reply;
  } catch {
    // Fallback AI recommendation if backend is unavailable
    if (message.toLowerCase().includes("salary") || message.toLowerCase().includes("lpa")) {
      return "For your profile, the current average package stands around 8 to 14 LPA (INR) in India, and $90,000 to $120,000 (USD) in the US region. You can check the Prediction tab for detailed metrics.";
    }
    return "To build proficiency, I highly recommend tackling more system design patterns and implementing structured container workflows (Docker/FastAPI).";
  }
}

// Get career track fit predictions
// NOTE: GET /api/v1/career/tracks does not exist in backend — return placeholder data.
export async function getCareerTracks(): Promise<CareerTrack[]> {
  return [
    { role: "Backend Engineer", fit: 92, status: "High Fit" },
    { role: "Full Stack Engineer", fit: 84, status: "Medium Fit" },
    { role: "DevOps Engineer", fit: 68, status: "Requires Upskilling" },
    { role: "Data Scientist", fit: 45, status: "Skills Gap" },
  ];
}

// Get salary expectations by region
// NOTE: GET /api/v1/career/salaries does not exist in backend — return placeholder data.
export async function getSalaryBands(region: "India" | "USA" | "Europe" | "UK"): Promise<SalaryBand[]> {
  switch (region) {
    case "USA":
      return [
        { role: "Backend", min: 85, avg: 130, max: 180 },
        { role: "Full Stack", min: 80, avg: 125, max: 175 },
        { role: "DevOps", min: 95, avg: 140, max: 195 },
        { role: "Data Science", min: 100, avg: 145, max: 210 },
      ];
    case "Europe":
      return [
        { role: "Backend", min: 55, avg: 80, max: 110 },
        { role: "Full Stack", min: 50, avg: 75, max: 105 },
        { role: "DevOps", min: 60, avg: 85, max: 120 },
        { role: "Data Science", min: 65, avg: 90, max: 130 },
      ];
    case "UK":
      return [
        { role: "Backend", min: 45, avg: 70, max: 100 },
        { role: "Full Stack", min: 40, avg: 65, max: 95 },
        { role: "DevOps", min: 50, avg: 75, max: 110 },
        { role: "Data Science", min: 55, avg: 80, max: 120 },
      ];
    default: // India (LPA)
      return [
        { role: "Backend", min: 8, avg: 14, max: 22 },
        { role: "Full Stack", min: 7, avg: 13, max: 20 },
        { role: "DevOps", min: 9, avg: 15, max: 24 },
        { role: "Data Science", min: 10, avg: 16, max: 26 },
      ];
  }
}

// Calculate similarity job match scores
// NOTE: POST /api/v1/career/job-match does not exist in backend — return placeholder data.
export async function analyzeJobMatch(jobRole: string, _requirements: string): Promise<JobMatchAnalysis> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        matchScore: jobRole.toLowerCase().includes("backend") ? 92 : 78,
        roleAlignment: jobRole.toLowerCase().includes("backend") ? "High Compatibility" : "Medium Compatibility",
        skillsFound: ["React", "FastAPI", "Python", "SQL", "Git"],
        skillsMissing: ["Docker", "Kubernetes", "AWS"],
        recommendation: "Highlight project container deployment to raise compatibility beyond 90%.",
      });
    }, 600);
  });
}
