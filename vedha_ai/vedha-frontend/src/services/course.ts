import { api } from "./api";

export interface Course {
  id: number;
  title: string;
  category: string;
  provider: string;
  duration: string;
  saved: boolean;
  progress: number;
  level: "Beginner" | "Intermediate" | "Expert";
  desc?: string;
  skills?: string[];
}

export interface Lesson {
  id: number;
  title: string;
  videoUrl: string;
  duration: string;
  notes?: string;
  completed: boolean;
}

export interface CourseDetailResponse {
  course: Course;
  lessons: Lesson[];
  assignments: { id: number; title: string; desc: string; submitted: boolean }[];
  quizzes: { id: number; title: string; question: string; options: string[]; answer: string }[];
}

export interface DiscussionThread {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

// 1. Get Course Catalog
export async function getCourseCatalog(): Promise<Course[]> {
  try {
    const res = await api.get<Course[]>("/courses");
    return res.data;
  } catch {
    // Mock fallback
    return [
      { id: 101, title: "Vite + React: The Complete Guide", category: "Frontend Design", provider: "Vedha Learning Platform", duration: "24h video lessons", saved: true, progress: 85, level: "Beginner" },
      { id: 102, title: "Advanced System Design & Microservices", category: "Backend Development", provider: "Industry Experts", duration: "18h lessons", saved: false, progress: 100, level: "Expert" },
      { id: 103, title: "Python Backends with FastAPI & SQL", category: "Backend Development", provider: "Vedha AI Academics", duration: "15h video lessons", saved: false, progress: 25, level: "Intermediate" },
      { id: 104, title: "AWS Cloud Operations & DevOps", category: "Cloud Infrastructure", provider: "Vedha AI Academics", duration: "12h video lessons", saved: false, progress: 0, level: "Intermediate" },
    ];
  }
}

// 2. Get Course Detail
export async function getCourseDetails(courseId: number): Promise<CourseDetailResponse> {
  try {
    const res = await api.get<CourseDetailResponse>(`/courses/${courseId}`);
    return res.data;
  } catch {
    return {
      course: {
        id: courseId,
        title: courseId === 101 ? "Vite + React: The Complete Guide" : "Python Backends with FastAPI & SQL",
        category: courseId === 101 ? "Frontend Design" : "Backend Development",
        provider: "Vedha AI Academics",
        duration: "15h video lessons",
        saved: false,
        progress: courseId === 101 ? 85 : 25,
        level: "Intermediate",
        desc: "Deep-dive into industrial architectures and learn deployment configurations step-by-step.",
      },
      lessons: [
        { id: 1, title: "Module Overview & Frameworks setup", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "12 mins", completed: true },
        { id: 2, title: "Components State, Props, and Yield hooks", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "24 mins", completed: courseId === 101 },
        { id: 3, title: "Advanced Context setup and global state managers", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "32 mins", completed: false },
      ],
      assignments: [
        { id: 11, title: "Coding Challenge: Array manipulation", desc: "Submit a React UI filtering an input checklist array.", submitted: true },
        { id: 12, title: "Project: Building a modular custom dashboard", desc: "Build a single page application managing re-orderable widgets.", submitted: false },
      ],
      quizzes: [
        {
          id: 21,
          title: "Core Mechanics Quiz",
          question: "Which pattern manages side effects cleanly inside functional elements?",
          options: ["useState", "useEffect", "useReducer"],
          answer: "useEffect",
        },
      ],
    };
  }
}

// 3. Update Lesson progress
export async function updateLessonProgress(courseId: number, lessonId: number, completed: boolean): Promise<void> {
  try {
    await api.post(`/courses/${courseId}/lessons/${lessonId}`, { completed });
  } catch {
    // Mock success
  }
}

// 4. Toggle Bookmarks
export async function toggleBookmark(courseId: number): Promise<boolean> {
  try {
    const res = await api.post<{ saved: boolean }>(`/courses/${courseId}/bookmark`);
    return res.data.saved;
  } catch {
    return true; // Mock success toggle state
  }
}

// 5. Discussion Threads
export async function getDiscussionThreads(courseId: number): Promise<DiscussionThread[]> {
  try {
    const res = await api.get<DiscussionThread[]>(`/courses/${courseId}/discussion`);
    return res.data;
  } catch {
    return [
      { id: 1, author: "Amit S.", text: "Can anyone explain the advantage of yield dependencies in FastAPI over raw session setups?", timestamp: "2 hours ago" },
      { id: 2, author: "Pranav M. (Mentor)", text: "Dependency injection using yield guarantees cleanup and transactional rollbacks, preventing session database locks.", timestamp: "1 hour ago" },
    ];
  }
}

export async function postDiscussionComment(courseId: number, text: string): Promise<DiscussionThread> {
  try {
    const res = await api.post<DiscussionThread>(`/courses/${courseId}/discussion`, { text });
    return res.data;
  } catch {
    return {
      id: Math.floor(Math.random() * 100),
      author: "Student (You)",
      text,
      timestamp: "Just now",
    };
  }
}
export default getCourseCatalog;
