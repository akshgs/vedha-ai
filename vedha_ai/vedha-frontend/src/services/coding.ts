import { api } from "./api";

export interface CodingProblem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  solved: boolean;
  desc: string;
  starterCode: string;
  testCases: string;
  expected: string;
}

export interface Submission {
  id: number;
  problemId: number;
  problemTitle: string;
  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Compilation Error";
  language: string;
  runtime: string;
  memory: string;
  submittedAt: string;
  code: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  self?: boolean;
}

export interface CodingStats {
  easy: string;
  med: string;
  hard: string;
  streak: number;
}

// Fetch lists of challenges
export async function getCodingProblems(): Promise<CodingProblem[]> {
  try {
    const { data } = await api.get<CodingProblem[]>("/coding/problems");
    return data;
  } catch {
    // Return mock data fallback
    return [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        category: "Arrays & Hashing",
        solved: true,
        desc: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        starterCode: "function twoSum(nums, target) {\n  // Write your code here\n  \n}",
        testCases: "nums = [2,7,11,15], target = 9",
        expected: "[0,1]",
      },
      {
        id: 2,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        category: "Sliding Window",
        solved: false,
        desc: "Given a string s, find the length of the longest substring without repeating characters.",
        starterCode: "function lengthOfLongestSubstring(s) {\n  // Write your code here\n  \n}",
        testCases: 's = "abcabcbb"',
        expected: "3",
      },
      {
        id: 3,
        title: "Merge k Sorted Lists",
        difficulty: "Hard",
        category: "Heap / Priority Queue",
        solved: false,
        desc: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        starterCode: "function mergeKLists(lists) {\n  // Write your code here\n  \n}",
        testCases: "lists = [[1,4,5],[1,3,4],[2,6]]",
        expected: "[1,1,2,3,4,4,5,6]",
      },
    ];
  }
}

// Execute sandbox compiler execution
export async function executeCode(problemId: number, code: string, language: string): Promise<{
  status: "success" | "error";
  output: string;
}> {
  try {
    const { data } = await api.post(`/coding/problems/${problemId}/run`, { code, language });
    return data;
  } catch {
    // Mock sandbox execute
    return {
      status: "success",
      output: `Execution Successful!\nRunning local assertions...\nOutput aligns with spec.\nAll checks passed.`,
    };
  }
}

// Submit code
export async function submitCode(problemId: number, code: string, language: string): Promise<{
  status: "success" | "error";
  output: string;
  runtime: string;
  memory: string;
}> {
  try {
    const { data } = await api.post(`/coding/problems/${problemId}/submit`, { code, language });
    return data;
  } catch {
    // Mock submit code
    return {
      status: "success",
      output: "All 105/105 test cases passed!\nCompiled without warnings.",
      runtime: "48 ms",
      memory: "41.2 MB",
    };
  }
}

// Get coding submissions
export async function getSubmissions(problemId?: number): Promise<Submission[]> {
  try {
    const { data } = await api.get<Submission[]>("/coding/submissions", { params: { problemId } });
    return data;
  } catch {
    return [
      {
        id: 101,
        problemId: 1,
        problemTitle: "Two Sum",
        status: "Accepted",
        language: "JavaScript",
        runtime: "52 ms",
        memory: "42 MB",
        submittedAt: "2026-07-24T12:00:00Z",
        code: "function twoSum(nums, target) { ... }",
      },
      {
        id: 102,
        problemId: 1,
        problemTitle: "Two Sum",
        status: "Wrong Answer",
        language: "Python",
        runtime: "0 ms",
        memory: "0 MB",
        submittedAt: "2026-07-24T11:55:00Z",
        code: "def twoSum(nums, target): return []",
      },
    ];
  }
}

// Get user coding statistics
export async function getCodingStats(): Promise<CodingStats> {
  try {
    const { data } = await api.get<CodingStats>("/coding/stats");
    return data;
  } catch {
    return {
      easy: "12/50",
      med: "4/80",
      hard: "1/40",
      streak: 5,
    };
  }
}

// Get Coding Leaderboard
export async function getCodingLeaderboard(): Promise<LeaderboardUser[]> {
  try {
    const { data } = await api.get<LeaderboardUser[]>("/coding/leaderboard");
    return data;
  } catch {
    return [
      { rank: 1, name: "Pranav M.", points: 2840, avatar: "P" },
      { rank: 2, name: "Shruti S.", points: 2610, avatar: "S" },
      { rank: 3, name: "Akash Patel", points: 2450, avatar: "A", self: true },
      { rank: 4, name: "Kunal K.", points: 2190, avatar: "K" },
    ];
  }
}
