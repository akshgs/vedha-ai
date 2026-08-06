import { useEffect, useState } from "react";
import { MessageSquare, Video, Clock, Check, X as XIcon } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import { getInterviewInvites, updateInterviewInvite, type InterviewInvite } from "@/services/employee";

export default function InterviewRequests() {
  const [invites, setInvites] = useState<InterviewInvite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvites() {
      try {
        setLoading(true);
        const data = await getInterviewInvites();
        setInvites(data);
      } catch {
        toast.error("Failed to load interview invites.");
      } finally {
        setLoading(false);
      }
    }
    void loadInvites();
  }, []);

  async function handleResponse(id: number, status: "Accepted" | "Declined") {
    try {
      await updateInterviewInvite(id, status);
      setInvites(
        invites.map((inv) =>
          inv.id === id ? { ...inv, status } : inv
        )
      );
      toast.success(`Session status updated to: ${status}`);
    } catch {
      toast.error("Failed to update session status.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="text-cyan-400" />
            Mock Interview Requests
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Approve mock interview session bookings and schedule technical tests with candidates.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xs text-slate-500 py-12 animate-pulse">Loading mock requests...</div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Pending Requests Column */}
            <div className="lg:col-span-2 space-y-6">
              <Card variant="glass" className="p-6">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 mb-4">Pending Invitations</h3>
                {invites.filter((i) => i.status === "Pending").length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">No pending mock session invitations.</p>
                ) : (
                  <div className="space-y-4">
                    {invites.filter((i) => i.status === "Pending").map((inv) => (
                      <div key={inv.id} className="rounded-xl border border-slate-850 p-4 bg-slate-950/40 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white text-sm">{inv.studentName}</h4>
                            <p className="text-xs text-slate-400">Target Role: {inv.role}</p>
                          </div>
                          <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                            <Clock size={10} />
                            {inv.dateTime}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 italic">"Requires code reviews checklist and system design mocks."</p>
                        <div className="flex gap-2 justify-end border-t border-slate-900/60 pt-2">
                          <button
                            onClick={() => handleResponse(inv.id, "Declined")}
                            className="rounded-xl border border-red-500/25 bg-red-500/5 p-2 px-4 text-xs font-semibold text-red-400 hover:bg-red-500/15 transition flex items-center gap-1"
                          >
                            <XIcon size={12} />
                            Decline
                          </button>
                          <Button
                            onClick={() => handleResponse(inv.id, "Accepted")}
                            className="text-xs py-2 px-5 bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1"
                          >
                            <Check size={12} />
                            Accept Interview
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Scheduled slots sidebar */}
            <div>
              <Card variant="glass" className="p-6 space-y-4">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 mb-4">Confirmed Calendar</h3>
                {invites.filter((i) => i.status === "Accepted").length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">No confirmed sessions on calendar.</p>
                ) : (
                  <div className="space-y-3">
                    {invites.filter((i) => i.status === "Accepted").map((inv) => (
                      <div key={inv.id} className="rounded-xl bg-slate-905 border border-slate-850 p-3.5 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-200">{inv.studentName}</span>
                          <span className="text-[9px] text-cyan-400">{inv.dateTime}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Role: {inv.role}</p>
                        <Button
                          onClick={() => toast.success("Opening Google Meet session link...")}
                          className="w-full text-xs py-1 flex items-center justify-center gap-1"
                        >
                          <Video size={10} />
                          Join Meeting
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
