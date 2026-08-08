import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import { getRankedCandidates, getRecruiterJobs, shortlistCandidate, type Candidate, type RecruiterJob } from "@/services/recruiter";

export default function AIRanking() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const list = await getRecruiterJobs();
        setJobs(list);
        if (list.length > 0) {
          setSelectedJobId(list[0].id);
        } else {
          setLoading(false);
        }
      } catch {
        toast.error("Failed to query job positions.");
      }
    }
    void loadJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId === null) return;
    async function loadRankings() {
      try {
        setLoading(true);
        const list = await getRankedCandidates(selectedJobId as number);
        setCandidates(list);
      } catch {
        toast.error("Failed to query AI ranking matrix.");
      } finally {
        setLoading(false);
      }
    }
    void loadRankings();
  }, [selectedJobId]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="text-cyan-400" />
            AI Candidate Ranking Matrix
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Leverage LLM-driven similarity analysis to rank candidates automatically based on custom job description requirements.
          </p>
        </div>

        {/* Job selector */}
        <Card variant="glass" className="p-6">
          <div className="max-w-xs space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400">Select Target Position</label>
            {jobs.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No jobs available. Create your first job posting to rank candidates.</p>
            ) : (
              <select
                value={selectedJobId || ""}
                onChange={(e) => setSelectedJobId(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-500"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.company})
                  </option>
                ))}
              </select>
            )}
          </div>
        </Card>

        {/* Rankings Table */}
        {loading ? (
          <div className="text-center text-xs text-slate-500 py-12 animate-pulse">Running similarity computations...</div>
        ) : (
          <Card variant="glass" className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="pb-3 font-semibold uppercase tracking-wider">Rank</th>
                    <th className="pb-3 font-semibold uppercase tracking-wider">Candidate Name</th>
                    <th className="pb-3 font-semibold uppercase tracking-wider">Resume ATS</th>
                    <th className="pb-3 font-semibold uppercase tracking-wider">Coding Solves</th>
                    <th className="pb-3 font-semibold uppercase tracking-wider">Compatibility Rating</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  {candidates.map((cand, idx) => (
                    <tr key={cand.id} className="hover:bg-slate-900/20 transition">
                      <td className="py-4 font-black text-cyan-400">#{idx + 1}</td>
                      <td className="py-4">
                        <div>
                          <p className="font-bold text-white text-sm">{cand.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Exp: {cand.experienceYears} Years</p>
                        </div>
                      </td>
                      <td className="py-4 text-slate-400">{cand.resumeScore}%</td>
                      <td className="py-4 text-slate-400">{cand.codingSolved} tasks</td>
                      <td className="py-4">
                        <span className="rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-2 py-0.5 font-bold">
                          {cand.matchScore ?? 85}% Match
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Button
                          onClick={async () => {
                            if (selectedJobId !== null) {
                              try {
                                await shortlistCandidate(cand.id, selectedJobId);
                                toast.success(`Successfully shortlisted ${cand.name}!`);
                              } catch {
                                toast.error("Failed to shortlist candidate.");
                              }
                            }
                          }}
                          className="text-[10px] py-1.5 px-4"
                        >
                          Shortlist Candidate
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
}
