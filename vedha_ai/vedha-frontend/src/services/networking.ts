import { api } from "./api";

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  connectionsCount: number;
  followersCount: number;
  followingCount: number;
  skills: string[];
  experiences: { title: string; company: string; duration: string }[];
  badges: string[];
  followed?: boolean;
  connected?: boolean;
}

export interface Post {
  id: string;
  author: { id: string; name: string; avatar: string; role: string };
  text: string;
  likes: number;
  commentsCount: number;
  liked?: boolean;
  saved?: boolean;
  timestamp: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  joined?: boolean;
}

// 1. User Profiles
export async function getUserProfile(userId: string): Promise<UserProfile> {
  try {
    const res = await api.get<UserProfile>(`/profiles/${userId}`);
    return res.data;
  } catch {
    // Mock fallback
    return {
      id: userId,
      name: userId === "mentor-1" ? "Pranav M." : "Akash Sharma",
      role: userId === "mentor-1" ? "Principal AI Researcher" : "Software Engineer",
      avatar: "",
      bio: "Deep learning practitioner specializing in transformer optimizations and large language models architectures.",
      connectionsCount: 342,
      followersCount: 1205,
      followingCount: 450,
      skills: ["FastAPI", "React", "TypeScript", "Docker", "PyTorch"],
      experiences: [
        { title: "AI Research Fellow", company: "Vedha AI Labs", duration: "2025 - Present" },
        { title: "Software Engineer", company: "Google", duration: "2023 - 2025" },
      ],
      badges: ["Top Mentor 2026", "Gold Coder", "React Specialist"],
      followed: false,
      connected: false,
    };
  }
}

// 2. Connection actions
export async function toggleFollowUser(userId: string): Promise<boolean> {
  try {
    const res = await api.post<{ followed: boolean }>(`/profiles/${userId}/follow`);
    return res.data.followed;
  } catch {
    return true; // Mock toggle success
  }
}

export async function toggleConnectUser(userId: string): Promise<boolean> {
  try {
    const res = await api.post<{ connected: boolean }>(`/profiles/${userId}/connect`);
    return res.data.connected;
  } catch {
    return true; // Mock toggle success
  }
}

// 3. News Feed
export async function getNewsFeed(): Promise<Post[]> {
  try {
    const res = await api.get<Post[]>("/networking/feed");
    return res.data;
  } catch {
    return [
      {
        id: "post-1",
        author: { id: "user-abc", name: "Amit S.", avatar: "", role: "Student Candidate" },
        text: "Just completed the Python FastAPI upskilling roadmap inside Vedha Academy! Strongly recommend checking out the yield dependency sessions.",
        likes: 24,
        commentsCount: 3,
        liked: true,
        saved: false,
        timestamp: "3 hours ago",
      },
      {
        id: "post-2",
        author: { id: "mentor-1", name: "Pranav M.", avatar: "", role: "Principal AI Researcher" },
        text: "Sharing our latest research paper draft on low-latency transformer inference pipelines. We managed to optimize token decoding latency by 35% using custom key-value caching policies.",
        likes: 142,
        commentsCount: 12,
        liked: false,
        saved: true,
        timestamp: "5 hours ago",
      },
    ];
  }
}

export async function createFeedPost(text: string): Promise<Post> {
  try {
    const res = await api.post<Post>("/networking/feed", { text });
    return res.data;
  } catch {
    return {
      id: Math.random().toString(36).substring(7),
      author: { id: "current-user", name: "You (Student)", avatar: "", role: "Candidate Developer" },
      text,
      likes: 0,
      commentsCount: 0,
      timestamp: "Just now",
    };
  }
}

export async function toggleLikePost(postId: string): Promise<boolean> {
  try {
    const res = await api.post<{ liked: boolean }>(`/networking/feed/${postId}/like`);
    return res.data.liked;
  } catch {
    return true;
  }
}

// 4. Communities
export async function getCommunities(): Promise<Community[]> {
  try {
    const res = await api.get<Community[]>("/networking/communities");
    return res.data;
  } catch {
    return [
      { id: "group-1", name: "FastAPI Creators Ecosystem", description: "Discuss database connection pools, async configurations, and route parameters.", membersCount: 1402, joined: true },
      { id: "group-2", name: "Transformers Inference & Deployment", description: "Deploy PyTorch models to AWS Cloud clusters under Kubernetes architectures.", membersCount: 843, joined: false },
    ];
  }
}

export async function toggleJoinCommunity(id: string): Promise<boolean> {
  try {
    const res = await api.post<{ joined: boolean }>(`/networking/communities/${id}/join`);
    return res.data.joined;
  } catch {
    return true;
  }
}

// 5. Global Search
export async function queryGlobalNetwork(query: string): Promise<{ users: UserProfile[]; groups: Community[] }> {
  try {
    const res = await api.get<{ users: UserProfile[]; groups: Community[] }>(`/networking/search?q=${encodeURIComponent(query)}`);
    return res.data;
  } catch {
    return {
      users: [
        { id: "mentor-1", name: "Pranav M.", role: "Principal AI Researcher", avatar: "", bio: "Deep learning specialist", connectionsCount: 120, followersCount: 890, followingCount: 300, skills: ["FastAPI"], experiences: [], badges: ["Top Mentor"], followed: true },
      ],
      groups: [
        { id: "group-1", name: "FastAPI Creators Ecosystem", description: "Ecosystem discussions", membersCount: 1402, joined: true },
      ],
    };
  }
}
export default getNewsFeed;
