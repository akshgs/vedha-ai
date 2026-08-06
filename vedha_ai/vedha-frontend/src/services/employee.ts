import { api } from "./api";

export interface EmployeeDashboardStats {
  mentoringHours: number;
  resumesReviewed: number;
  mockInterviewsScheduled: number;
  blogEngagement: number;
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  content: string;
  author: string;
  likes: number;
  views: number;
  createdAt: string;
}

export interface ResumeReviewRequest {
  id: number;
  studentName: string;
  targetRole: string;
  resumeFilename: string;
  submittedAt: string;
  status: "Pending" | "Reviewed";
  comments?: string;
  rating?: number;
}

export interface MentorshipSlot {
  id: number;
  studentName?: string;
  dateTime: string;
  status: "Available" | "Booked";
  topic?: string;
}

export interface InterviewInvite {
  id: number;
  studentName: string;
  role: string;
  dateTime: string;
  status: "Pending" | "Accepted" | "Completed" | "Declined";
  notes?: string;
}

export interface ForumPost {
  id: number;
  author: string;
  role: string;
  content: string;
  likes: number;
  replies: number;
  timestamp: string;
}

export async function getEmployeeStats(): Promise<EmployeeDashboardStats> {
  try {
    const { data } = await api.get<EmployeeDashboardStats>("/employee/stats");
    return data;
  } catch {
    return {
      mentoringHours: 18,
      resumesReviewed: 24,
      mockInterviewsScheduled: 5,
      blogEngagement: 1250,
    };
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data } = await api.get<BlogPost[]>("/employee/blogs");
    return data;
  } catch {
    return [
      {
        id: 1,
        title: "Mastering FastAPI Dependency Injection",
        category: "Backend Development",
        content: "Dependency Injection in FastAPI is a powerful system that makes it easy to integrate database sessions, security credentials, and helper utilities. In this guide, we dive deep into yield dependencies and sub-dependencies.",
        author: "Akash Patel",
        likes: 42,
        views: 310,
        createdAt: "2026-07-20",
      },
      {
        id: 2,
        title: "Clean React Architecture in Vite Projects",
        category: "Frontend Design",
        content: "Organizing your Vite React application with explicit layout wrappers, reusable component directories, and structured context providers ensures maintainability. Let's look at directory layouts that scale.",
        author: "John Doe",
        likes: 29,
        views: 185,
        createdAt: "2026-07-22",
      },
    ];
  }
}

export async function createBlogPost(title: string, category: string, content: string): Promise<BlogPost> {
  try {
    const { data } = await api.post<BlogPost>("/employee/blogs", { title, category, content });
    return data;
  } catch {
    return {
      id: Math.floor(Math.random() * 1000),
      title,
      category,
      content,
      author: "Me",
      likes: 0,
      views: 1,
      createdAt: new Date().toISOString().split("T")[0],
    };
  }
}

export async function getResumeReviewRequests(): Promise<ResumeReviewRequest[]> {
  try {
    const { data } = await api.get<ResumeReviewRequest[]>("/employee/resume-reviews");
    return data;
  } catch {
    return [
      { id: 1, studentName: "Pranav M.", targetRole: "Backend Engineer", resumeFilename: "pranav_resume_backend.pdf", submittedAt: "2026-07-24", status: "Pending" },
      { id: 2, studentName: "Shruti S.", targetRole: "Frontend Developer", resumeFilename: "shruti_resume_fe.pdf", submittedAt: "2026-07-23", status: "Pending" },
      { id: 3, studentName: "Rahul K.", targetRole: "DevOps Engineer", resumeFilename: "rahul_devops.pdf", submittedAt: "2026-07-21", status: "Reviewed", comments: "Solid Docker skills, needs more AWS description.", rating: 4 },
    ];
  }
}

export async function submitResumeReview(id: number, comments: string, rating: number): Promise<void> {
  await api.post(`/employee/resume-reviews/${id}`, { comments, rating });
}

export async function getMentorshipSlots(): Promise<MentorshipSlot[]> {
  try {
    const { data } = await api.get<MentorshipSlot[]>("/employee/mentorship/slots");
    return data;
  } catch {
    return [
      { id: 1, dateTime: "2026-07-27 15:00", status: "Available" },
      { id: 2, dateTime: "2026-07-28 10:30", status: "Booked", studentName: "Pranav M.", topic: "FastAPI Optimization Tips" },
    ];
  }
}

export async function addMentorshipSlot(dateTime: string): Promise<MentorshipSlot> {
  try {
    const { data } = await api.post<MentorshipSlot>("/employee/mentorship/slots", { dateTime });
    return data;
  } catch {
    return {
      id: Math.floor(Math.random() * 1000),
      dateTime,
      status: "Available",
    };
  }
}

export async function getInterviewInvites(): Promise<InterviewInvite[]> {
  try {
    const { data } = await api.get<InterviewInvite[]>("/employee/interviews");
    return data;
  } catch {
    return [
      { id: 1, studentName: "Pranav M.", role: "Backend Engineer", dateTime: "2026-07-29 16:00", status: "Pending" },
      { id: 2, studentName: "Shruti S.", role: "React Architect", dateTime: "2026-07-30 11:00", status: "Accepted" },
    ];
  }
}

export async function updateInterviewInvite(id: number, status: "Accepted" | "Declined"): Promise<void> {
  await api.put(`/employee/interviews/${id}`, { status });
}

export async function getForumPosts(): Promise<ForumPost[]> {
  try {
    const { data } = await api.get<ForumPost[]>("/employee/community/forum");
    return data;
  } catch {
    return [
      { id: 1, author: "Vikram Sen", role: "DevOps Lead @ IBM", content: "Is anyone else seeing high container deployment delays in the Mumbai region today?", likes: 12, replies: 4, timestamp: "2h ago" },
      { id: 2, author: "Sonia G.", role: "Staff Engineer @ Google", content: "Highly recommend reading the new paper on speculative execution pathways in AI inference nodes.", likes: 25, replies: 2, timestamp: "5h ago" },
    ];
  }
}

export async function publishForumPost(content: string): Promise<ForumPost> {
  try {
    const { data } = await api.post<ForumPost>("/employee/community/forum", { content });
    return data;
  } catch {
    return {
      id: Math.floor(Math.random() * 1000),
      author: "Me",
      role: "Software Engineer @ Vedha",
      content,
      likes: 0,
      replies: 0,
      timestamp: "Just now",
    };
  }
}
