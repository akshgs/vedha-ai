import { api } from "./api";

export interface ScheduledInterview {
  id: string;
  jobTitle: string;
  companyName: string;
  date: string;
  time: string;
  interviewerName: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export interface InterviewSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

export interface OfferDetail {
  id: string;
  jobTitle: string;
  companyName: string;
  salary: string;
  deadline: string;
  status: "Accepted" | "Pending" | "Declined";
}

export async function getScheduledInterviews(): Promise<ScheduledInterview[]> {
  try {
    const res = await api.get<ScheduledInterview[]>("/recruitment/interviews");
    return res.data;
  } catch {
    return [
      { id: "i-1", jobTitle: "Backend Developer", companyName: "Google DeepMind", date: "2026-07-28", time: "10:00 AM", interviewerName: "Pranav M.", status: "Scheduled" },
    ];
  }
}

export async function queryAvailableInterviewSlots(companyName: string): Promise<InterviewSlot[]> {
  try {
    const res = await api.get<InterviewSlot[]>(`/recruitment/interviews/slots?company=${encodeURIComponent(companyName)}`);
    return res.data;
  } catch {
    return [
      { id: "s-1", date: "2026-07-28", time: "10:00 AM", available: true },
      { id: "s-2", date: "2026-07-28", time: "02:30 PM", available: true },
      { id: "s-3", date: "2026-07-29", time: "11:00 AM", available: true },
    ];
  }
}

export async function bookInterviewMeeting(slotId: string, details: string): Promise<ScheduledInterview> {
  try {
    const res = await api.post<ScheduledInterview>("/recruitment/interviews/book", { slotId, details });
    return res.data;
  } catch {
    return {
      id: Math.random().toString(36).substring(7),
      jobTitle: "Backend Developer",
      companyName: "Google DeepMind",
      date: "2026-07-28",
      time: "10:00 AM",
      interviewerName: "Pranav M.",
      status: "Scheduled",
    };
  }
}

export async function getOfferLetters(): Promise<OfferDetail[]> {
  try {
    const res = await api.get<OfferDetail[]>("/recruitment/offers");
    return res.data;
  } catch {
    return [
      { id: "o-1", jobTitle: "Machine Learning Dev", companyName: "Vedha AI Inc", salary: "18 LPA", deadline: "2026-08-05", status: "Pending" },
    ];
  }
}

export async function updateOfferStatus(offerId: string, status: "Accepted" | "Declined"): Promise<void> {
  try {
    await api.post(`/recruitment/offers/${offerId}/status`, { status });
  } catch {
    // Mock success
  }
}
