import { useEffect, useState } from "react";
import { Calendar, Video, UserPlus } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import { searchCandidates, scheduleInterview, type Candidate } from "@/services/recruiter";

export default function InterviewScheduling() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number>(0);
  const [dateTime, setDateTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidates() {
      try {
        setLoading(true);
        const data = await searchCandidates("", 80);
        setCandidates(data);
        if (data.length > 0) setSelectedCandidateId(data[0].id);
      } catch {
        toast.error("Failed to query candidates database.");
      } finally {
        setLoading(false);
      }
    }
    void loadCandidates();
  }, []);

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!dateTime.trim()) {
      toast.error("Please specify meeting date and time.");
      return;
    }

    try {
      await scheduleInterview(selectedCandidateId, dateTime, notes);
      setDateTime("");
      setNotes("");
      toast.success("Interview slot booked and notifications dispatched.");
    } catch {
      toast.error("Failed to register schedule slot.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Calendar className="text-cyan-400" />
            Interview Scheduler
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Set up interviews with shortlisted candidates, connect virtual meeting URLs, and coordinate scheduling times.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xs text-slate-500 py-12 animate-pulse">Loading schedulers...</div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-6">
              <Card variant="glass" className="p-6">
                <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Arrange Live Evaluation Slot</h3>
                <form onSubmit={handleSchedule} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Select Candidate</label>
                    <select
                      value={selectedCandidateId}
                      onChange={(e) => setSelectedCandidateId(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-500"
                    >
                      {candidates.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} ({c.targetRole})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Date and Time"
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Evaluator Instructions</label>
                    <textarea
                      placeholder="Add system specifications, target algorithms, or private guidelines for the evaluator..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-white focus:border-cyan-500 outline-none focus:ring-1 focus:ring-cyan-500/20"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" className="text-xs bg-cyan-600 hover:bg-cyan-500 flex items-center gap-1">
                      <UserPlus size={12} />
                      Confirm Schedule Slot
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Confirmed list sidebar */}
            <div>
              <Card variant="glass" className="p-6 space-y-4">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 mb-4">Upcoming Session Schedule</h3>
                <div className="space-y-3">
                  {[
                    { id: 1, name: "Pranav M.", time: "2026-07-28 10:30", role: "Backend Developer" },
                    { id: 2, name: "Akash Patel", time: "2026-07-29 14:00", role: "Full Stack Engineer" },
                  ].map((session) => (
                    <div key={session.id} className="rounded-xl bg-slate-955 p-3.5 border border-slate-850 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-300">{session.name}</span>
                        <span className="text-[9px] text-cyan-400 font-bold">{session.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">{session.role}</p>
                      <Button
                        onClick={() => toast.success("Google Meet invite link sent to evaluator!")}
                        className="w-full text-xs py-1 flex items-center justify-center gap-1.5"
                      >
                        <Video size={10} />
                        Virtual Link
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
