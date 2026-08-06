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
  companyTags: string[];
  editorial: string;
  hints: string[];
  discussionCount: number;
}

export interface DiscussionComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export async function queryCodingProblems(difficulty?: string, category?: string): Promise<CodingProblem[]> {
  try {
    const res = await api.get<CodingProblem[]>("/coding/problems", { params: { difficulty, category } });
    return (res.data || []).map((p) => ({
      ...p,
      companyTags: p.companyTags || [],
      editorial: p.editorial || "",
      hints: p.hints || [],
      discussionCount: p.discussionCount || 0,
    }));
  } catch {
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
        companyTags: ["Google", "Amazon", "Meta"],
        editorial: "Use a hash map to look up targets in O(1) time.",
        hints: ["Try matching indices", "Can we search faster with hashing?"],
        discussionCount: 42,
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
        companyTags: ["Google", "Adobe"],
        editorial: "Use a sliding window map with two pointers.",
        hints: ["Keep track of letter indexes", "Adjust pointers left and right"],
        discussionCount: 19,
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
        companyTags: ["Microsoft", "Google"],
        editorial: "Use a min-heap to keep list heads sorted.",
        hints: ["Compare first elements", "Re-add next elements into heap"],
        discussionCount: 8,
      },
    ];
  }
}

export async function getProblemDetails(id: number): Promise<CodingProblem> {
  try {
    const res = await api.get<CodingProblem>(`/coding/problems/${id}`);
    const p = res.data;
    return {
      ...p,
      companyTags: p.companyTags || [],
      editorial: p.editorial || "",
      hints: p.hints || [],
      discussionCount: p.discussionCount || 0,
    };
  } catch {
    const all = await queryCodingProblems();
    return all.find((p) => p.id === id) || all[0];
  }
}

// NOTE: GET /api/v1/coding/problems/{id}/discussion does not exist in backend — return placeholder data.
export async function getProblemDiscussion(_id: number): Promise<DiscussionComment[]> {
  return [
    { id: "1", author: "Pranav M.", text: "A hash map gives O(N) runtime complexity. Clean and fast.", timestamp: "2 hours ago" },
    { id: "2", author: "Akash Sharma", text: "Make sure you check edge cases like empty arrays.", timestamp: "1 hour ago" },
  ];
}

// NOTE: POST /api/v1/coding/problems/{id}/discussion does not exist in backend — return placeholder data.
export async function postProblemComment(_id: number, text: string): Promise<DiscussionComment> {
  return {
    id: Math.random().toString(36).substring(7),
    author: "You (Student)",
    text,
    timestamp: "Just now",
  };
}
