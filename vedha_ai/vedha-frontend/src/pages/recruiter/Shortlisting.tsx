import { useEffect, useState } from "react";
import { Star, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import { searchCandidates, type Candidate } from "@/services/recruiter";

export default function Shortlisting() {
  const [shortlisted, setShortlisted] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // Notes state
  const [activeNotes, setActiveNotes] = useState<Record<number, string>>({});

  useEffect(() => {
    async function loadShortlist() {
      try {
        setLoading(true);
        const data = await searchCandidates("", 88);
        setShortlisted(data);
      } catch {
        toast.error("Failed to load shortlist database.");
      } finally {
        setLoading(false);
      }
    }
    void loadShortlist();
  }, []);

  function handleSaveNote(id: number, text: string) {
    setActiveNotes({ ...activeNotes, [id]: text });
    toast.success("Recruiter comment logs saved successfully!");
  }

  function handleRemove(id: number) {
    setShortlisted(shortlisted.filter(c => c.id !== id));
    toast.info("Candidate removed from shortlist registry.");
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Star className="text-cyan-400" />
            Shortlist Manager
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Maintain active shortlists, add private evaluation notes, and forward candidates to upcoming mock scheduling boards.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xs text-slate-500 py-12 animate-pulse">Loading shortlist queue...</div>
        ) : shortlisted.length === 0 ? (
          <Card variant="glass" className="p-12 text-center text-slate-500 italic">
            No candidates shortlisted yet. Open the AI Ranking matrix to add profiles.
          </Card>
        ) : (
          <div className="grid gap-6">
            {shortlisted.map((cand) => (
              <Card key={cand.id} variant="default" className="p-6 space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white">{cand.name}</h3>
                    <p className="text-xs text-slate-400">Position: {cand.targetRole} • Experience: {cand.experienceYears} Years</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="text-cyan-400 font-bold">ATS: {cand.resumeScore}%</span>
                    <span className="text-violet-400 font-bold">Coding: {cand.codingSolved} solves</span>
                  </div>
                </div>

                {/* Recruiter Private Notes */}
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">Recruiter Evaluation Note</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add private evaluation notes (e.g. Strong React skills, weak system design basics)..."
                      defaultValue={activeNotes[cand.id] || ""}
                      onBlur={(e) => handleSaveNote(cand.id, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-900 pt-3">
                  <button
                    onClick={() => handleRemove(cand.id)}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Remove Candidate
                  </button>
                  <Button
                    onClick={() => {
                      toast.success(`Candidate ${cand.name} promoted to next scheduling slot!`);
                    }}
                    className="text-xs py-1.5 px-4 bg-cyan-600 hover:bg-cyan-500 flex items-center gap-1"
                  >
                    <UserPlus size={12} />
                    Promote Candidate
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
