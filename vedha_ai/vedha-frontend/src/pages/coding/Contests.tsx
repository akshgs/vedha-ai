import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import ContestCard from "@/components/ui/career/ContestCard";
import Leaderboard from "@/components/ui/career/Leaderboard";
import BadgeCard from "@/components/ui/career/BadgeCard";
import {
  getContestsList,
  getContestLeaderboard,
  getAchievementsList,
  type CodingContest,
  type LeaderboardRank,
  type AchievementBadge,
} from "@/services/contests";

import PageHeader from "@/components/ui/layout/PageHeader";

export default function Contests() {
  const [contests, setContests] = useState<CodingContest[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRank[]>([]);
  const [badges, setBadges] = useState<AchievementBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContestData() {
      try {
        setLoading(true);
        const [contestData, leaderboardData, badgesData] = await Promise.all([
          getContestsList(),
          getContestLeaderboard(),
          getAchievementsList(),
        ]);
        setContests(contestData);
        setLeaderboard(leaderboardData);
        setBadges(badgesData);
      } catch {
        toast.error("Failed to load coding contest standings.");
      } finally {
        setLoading(false);
      }
    }
    void loadContestData();
  }, []);

  function handleRegisterContest(contestId: string) {
    toast.success("Successfully registered for contest! We'll alert you 10 mins before start.");
    setContests((prev) =>
      prev.map((c) => (c.id === contestId ? { ...c, participantsCount: c.participantsCount + 1 } : c))
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Connecting coding contest servers...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        <PageHeader
          title="Algorithm Contest Arena"
          subtitle="Participate in weekly algorithm matches, optimize complexity scores, rank against global coders, and unlock achievements."
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contests & Badges list */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Upcoming Contests Schedule</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {contests.map((c) => (
                  <ContestCard
                    key={c.id}
                    id={c.id}
                    title={c.title}
                    startTime={c.startTime}
                    duration={c.duration}
                    participantsCount={c.participantsCount}
                    status={c.status}
                    onRegister={handleRegisterContest}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-900 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Achievements & Milestones</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {badges.map((b) => (
                  <BadgeCard
                    key={b.id}
                    id={b.id}
                    title={b.title}
                    desc={b.desc}
                    unlocked={b.unlocked}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Standings Leaderboard sidebar */}
          <div className="space-y-6">
            <Leaderboard users={leaderboard} />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
