import { useEffect, useState } from "react";
import { Users, Search, Eye, Star, Award, Code } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Input from "@/components/ui/input/Input";
import Button from "@/components/ui/button/Button";
import Modal from "@/components/ui/modal/Modal";
import { searchCandidates, type Candidate } from "@/services/recruiter";

export default function CandidateSearch() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [query, setQuery] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [skillFilter, setSkillFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Selected candidate detail preview modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  async function loadCandidates() {
    try {
      setLoading(true);
      const list = await searchCandidates(query, minScore, skillFilter);
      setCandidates(list);
    } catch {
      toast.error("Failed to query candidates registry.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCandidates();
  }, [minScore]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    void loadCandidates();
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="text-cyan-400" />
            Talent Search Directory
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Search candidates across the ecosystem. Filter by skills, experience, coding performance, and resume scores.
          </p>
        </div>

        {/* Filter Bar */}
        <Card variant="glass" className="p-6">
          <form onSubmit={handleSearchSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
            <div>
              <Input
                label="Search Keyword"
                placeholder="Name, role, major..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Skill Filter"
                placeholder="e.g. React, Docker"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Min ATS Score ({minScore}%)</label>
              <input
                type="range"
                min={0}
                max={100}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="w-full flex justify-center items-center gap-1 text-xs py-2.5">
                <Search size={14} />
                Search Talent
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setSkillFilter("");
                  setMinScore(0);
                  toast.info("Filter configurations reset.");
                }}
                className="text-xs border-slate-800 hover:bg-slate-900"
              >
                Clear
              </Button>
            </div>
          </form>
        </Card>

        {/* Candidate List */}
        {loading ? (
          <div className="text-center text-xs text-slate-500 py-12 animate-pulse">Querying directory...</div>
        ) : candidates.length === 0 ? (
          <Card variant="glass" className="p-12 text-center text-slate-500 italic">
            No candidates matched your search criteria.
          </Card>
        ) : (
          <div className="grid gap-6">
            {candidates.map((cand) => (
              <Card key={cand.id} variant="interactive" className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">{cand.name}</h3>
                  <p className="text-xs text-slate-400">Target Role: <span className="text-cyan-300 font-semibold">{cand.targetRole}</span> • Experience: {cand.experienceYears} Years</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cand.skills.map((s) => (
                      <span key={s} className="text-[9px] bg-slate-950/60 border border-slate-900 rounded px-2 py-0.5 text-slate-300">{s}</span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-6 items-center shrink-0 self-end sm:self-auto text-xs text-slate-400">
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">ATS Score</span>
                    <span className="text-cyan-400 font-black text-sm">{cand.resumeScore}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Coding Solves</span>
                    <span className="text-violet-400 font-black text-sm">{cand.codingSolved}</span>
                  </div>
                  <Button
                    onClick={() => setSelectedCandidate(cand)}
                    className="py-2 px-5 flex items-center gap-1 text-xs"
                  >
                    <Eye size={12} />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>

      {/* Details modal */}
      {selectedCandidate && (
        <Modal isOpen={true} onClose={() => setSelectedCandidate(null)} title="Candidate profile overview">
          <div className="space-y-6">
            <div className="border-b border-slate-900 pb-3">
              <h3 className="text-xl font-bold text-white">{selectedCandidate.name}</h3>
              <p className="text-xs text-cyan-400 mt-0.5">{selectedCandidate.targetRole}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-1">
                <Star className="text-cyan-400 mx-auto" size={16} />
                <span className="text-[9px] text-slate-500 block uppercase font-bold">ATS Score</span>
                <span className="text-white font-extrabold text-xs block">{selectedCandidate.resumeScore}%</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-1">
                <Code className="text-violet-400 mx-auto" size={16} />
                <span className="text-[9px] text-slate-500 block uppercase font-bold">Coding Solves</span>
                <span className="text-white font-extrabold text-xs block">{selectedCandidate.codingSolved} tasks</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-1">
                <Award className="text-emerald-400 mx-auto" size={16} />
                <span className="text-[9px] text-slate-500 block uppercase font-bold">Experience</span>
                <span className="text-white font-extrabold text-xs block">{selectedCandidate.experienceYears} Years</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400">Technical Skills</h4>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-900">
                {selectedCandidate.skills.map((s) => (
                  <span key={s} className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-cyan-300 font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
              <Button type="button" variant="outline" onClick={() => setSelectedCandidate(null)} className="text-xs">
                Close
              </Button>
              <Button
                onClick={() => {
                  toast.success(`Mentoring chat invitation dispatched to ${selectedCandidate.name}!`);
                  setSelectedCandidate(null);
                }}
                className="text-xs bg-cyan-600 hover:bg-cyan-500"
              >
                Invite to Pipeline
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
