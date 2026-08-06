import { api } from "./api";

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
  rating: number;
  reviewsCount: number;
  skills: string[];
  bio: string;
}

export interface BookingSlot {
  id: string;
  date: string;
  time: string;
  booked: boolean;
}

export interface MentorshipSession {
  id: string;
  mentorName: string;
  role: string;
  date: string;
  time: string;
  status: "Pending" | "Scheduled" | "Completed" | "Cancelled";
  notes?: string;
  goal?: string;
}

// 1. Discover Mentors
export async function queryMentorsDirectory(skill?: string): Promise<Mentor[]> {
  try {
    const url = skill ? `/mentorship/mentors?skill=${encodeURIComponent(skill)}` : "/mentorship/mentors";
    const res = await api.get<Mentor[]>(url);
    return res.data;
  } catch {
    return [
      { id: "mentor-1", name: "Pranav M.", avatar: "", role: "Principal AI Researcher", company: "Google DeepMind", rating: 4.9, reviewsCount: 42, skills: ["FastAPI", "Python", "Deep Learning"], bio: "Principal researcher helping students navigate backend Rest API architectures and system scaling deployments." },
      { id: "mentor-2", name: "Siddharth K.", avatar: "", role: "Lead Frontend Architect", company: "Meta", rating: 4.8, reviewsCount: 31, skills: ["React", "TypeScript", "Performance"], bio: "Lead engineer optimizing UI render cycles, caching networks, and responsive layouts design." },
    ];
  }
}

// 1.5 Get ecosystem-matched mentors based on student missing skills
export async function queryMatchedMentors(): Promise<Mentor[]> {
  try {
    const res = await api.get<Mentor[]>("/mentorship/match");
    return res.data;
  } catch {
    return [
      { id: "mentor-1", name: "Pranav M.", avatar: "", role: "Principal AI Researcher", company: "Google DeepMind", rating: 4.9, reviewsCount: 42, skills: ["FastAPI", "Python", "Deep Learning"], bio: "Principal researcher helping students navigate backend Rest API architectures and system scaling deployments." },
      { id: "mentor-2", name: "Siddharth K.", avatar: "", role: "Lead Frontend Architect", company: "Meta", rating: 4.8, reviewsCount: 31, skills: ["React", "TypeScript", "Performance"], bio: "Lead engineer optimizing UI render cycles, caching networks, and responsive layouts design." },
    ];
  }
}

// 2. Availability slots
export async function getMentorAvailability(mentorId: string): Promise<BookingSlot[]> {
  try {
    const res = await api.get<BookingSlot[]>(`/mentorship/mentors/${mentorId}/slots`);
    return res.data;
  } catch {
    return [
      { id: "slot-1", date: "2026-07-28", time: "10:00 AM", booked: false },
      { id: "slot-2", date: "2026-07-28", time: "02:30 PM", booked: false },
      { id: "slot-3", date: "2026-07-29", time: "11:00 AM", booked: false },
    ];
  }
}

// 3. Book Mentorship
export async function bookMentorshipSession(mentorId: string, slotId: string, goalText: string): Promise<MentorshipSession> {
  try {
    const res = await api.post<MentorshipSession>(`/mentorship/mentors/${mentorId}/book`, { slotId, goalText });
    return res.data;
  } catch {
    return {
      id: Math.random().toString(36).substring(7),
      mentorName: mentorId === "mentor-1" ? "Pranav M." : "Siddharth K.",
      role: mentorId === "mentor-1" ? "Principal AI Researcher" : "Lead Frontend Architect",
      date: "2026-07-28",
      time: "10:00 AM",
      status: "Pending",
      goal: goalText,
    };
  }
}

// 4. Session History
export async function getSessionsHistory(): Promise<MentorshipSession[]> {
  try {
    const res = await api.get<MentorshipSession[]>("/mentorship/sessions");
    return res.data;
  } catch {
    return [
      { id: "sess-1", mentorName: "Pranav M.", role: "Principal AI Researcher", date: "2026-07-22", time: "02:00 PM", status: "Completed", notes: "Review finished. Suggested learning Docker to solidify container structures.", goal: "FastAPI REST API design" },
      { id: "sess-2", mentorName: "Siddharth K.", role: "Lead Frontend Architect", date: "2026-07-15", time: "10:00 AM", status: "Completed", notes: "Discussed React render bottlenecks and virtualized list hooks.", goal: "React Virtual DOM optimization" },
    ];
  }
}

// 5. Submit review
export async function submitMentorReview(mentorId: string, rating: number, text: string): Promise<void> {
  try {
    await api.post(`/mentorship/mentors/${mentorId}/review`, { rating, text });
  } catch {
    // Mock success
  }
}
export default queryMentorsDirectory;
