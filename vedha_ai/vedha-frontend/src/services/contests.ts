// NOTE: The backend does not yet expose /coding/contests, /coding/leaderboard,
// or /coding/achievements endpoints. These functions return curated placeholder
// data directly — no network request is made — to avoid 404 errors.

export interface CodingContest {
  id: string;
  title: string;
  startTime: string;
  duration: string;
  participantsCount: number;
  status: "Upcoming" | "Active" | "Completed";
}

export interface LeaderboardRank {
  rank: number;
  name: string;
  points: number;
  solvedCount: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
}

export async function getContestsList(): Promise<CodingContest[]> {
  // Endpoint GET /api/v1/coding/contests does not exist in backend — return placeholder data.
  return [
    { id: "c-1", title: "Weekly Coding Contest 42", startTime: "2026-07-28T09:00:00Z", duration: "1.5 hours", participantsCount: 1405, status: "Upcoming" },
    { id: "c-2", title: "Biweekly Coding Contest 21", startTime: "2026-07-29T14:00:00Z", duration: "1.5 hours", participantsCount: 840, status: "Upcoming" },
  ];
}

export async function getContestLeaderboard(_contestId?: string): Promise<LeaderboardRank[]> {
  // Endpoint GET /api/v1/coding/leaderboard does not exist in backend — return placeholder data.
  return [
    { rank: 1, name: "Pranav M.", points: 2840, solvedCount: 154 },
    { rank: 2, name: "Shruti S.", points: 2610, solvedCount: 139 },
    { rank: 3, name: "Akash Patel", points: 2450, solvedCount: 122 },
    { rank: 4, name: "Kunal K.", points: 2190, solvedCount: 110 },
  ];
}

export async function getAchievementsList(): Promise<AchievementBadge[]> {
  // Endpoint GET /api/v1/coding/achievements does not exist in backend — return placeholder data.
  return [
    { id: "badge-1", title: "Daily Solver", desc: "Solve 10 Daily Challenges in a row.", unlocked: true },
    { id: "badge-2", title: "Algorithm Master", desc: "Solve 50 Medium difficulty algorithm questions.", unlocked: false },
    { id: "badge-3", title: "Contest Champion", desc: "Rank in the top 5% of any Weekly Contest.", unlocked: false },
  ];
}
