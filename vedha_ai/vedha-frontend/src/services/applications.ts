import { api } from "./api";

export interface JobApplication {
  id: number;
  jobTitle: string;
  companyName: string;
  location: string;
  status: "Applied" | "Resume Review" | "Interviewing" | "Offered" | "Rejected";
  appliedAt: string;
  step: number; // 1-5 progress timeline step
}

export async function getSentApplications(): Promise<JobApplication[]> {
  try {
    const res = await api.get<JobApplication[]>("/recruitment/applications");
    return res.data;
  } catch {
    return [
      { id: 201, jobTitle: "Backend Developer", companyName: "Google DeepMind", location: "Bangalore", status: "Interviewing", appliedAt: "2026-07-22", step: 3 },
      { id: 202, jobTitle: "Full Stack Engineer", companyName: "Meta", location: "Hyderabad", status: "Applied", appliedAt: "2026-07-24", step: 1 },
      { id: 203, jobTitle: "Machine Learning Dev", companyName: "Vedha AI Inc", location: "Mumbai", status: "Offered", appliedAt: "2026-07-18", step: 5 },
    ];
  }
}

export async function submitResumeForJob(jobId: number, fileUrl: string): Promise<JobApplication> {
  try {
    const res = await api.post<JobApplication>(`/recruitment/jobs/${jobId}/apply`, { fileUrl });
    return res.data;
  } catch {
    return {
      id: Math.random() * 1000,
      jobTitle: "Software Developer",
      companyName: "Google DeepMind",
      location: "Bangalore",
      status: "Applied",
      appliedAt: new Date().toISOString().split("T")[0],
      step: 1,
    };
  }
}
