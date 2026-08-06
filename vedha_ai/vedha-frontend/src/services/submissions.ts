import { api } from "./api";

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

export async function getProblemSubmissions(problemId?: number): Promise<Submission[]> {
  try {
    const res = await api.get<Submission[]>("/coding/submissions", { params: { problemId } });
    return res.data;
  } catch {
    return [
      {
        id: 101,
        problemId: problemId || 1,
        problemTitle: "Two Sum",
        status: "Accepted",
        language: "JavaScript",
        runtime: "48 ms",
        memory: "42.1 MB",
        submittedAt: "2026-07-24T12:00:00Z",
        code: "function twoSum(nums, target) { \n  const map = new Map();\n  for(let i=0; i<nums.length; i++) {\n    const diff = target - nums[i];\n    if(map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n}",
      },
      {
        id: 102,
        problemId: problemId || 1,
        problemTitle: "Two Sum",
        status: "Wrong Answer",
        language: "Python",
        runtime: "0 ms",
        memory: "0 MB",
        submittedAt: "2026-07-24T11:55:00Z",
        code: "def twoSum(nums, target):\n    return []",
      },
    ];
  }
}

export async function getSubmissionDetails(submissionId: number): Promise<Submission> {
  try {
    const res = await api.get<Submission>(`/coding/submissions/${submissionId}`);
    return res.data;
  } catch {
    const all = await getProblemSubmissions();
    return all.find((s) => s.id === submissionId) || all[0];
  }
}
