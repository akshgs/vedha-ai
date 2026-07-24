import { useEffect, useState } from "react";
import { Calendar, Users, Clock, Video, RefreshCw } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import { toast } from "sonner";
import { getCompanyJobs, getJobApplications, type ApplicationResponse } from "@/services/company";

interface ScheduledMeeting {
  id: string;
  candidateId: number;
  jobTitle: string;
  date: string;
  time: string;
  link: string;
}

export default function Interviews() {
  const [loading, setLoading] = useState(true);
  const [interviewCandidates, setInterviewCandidates] = useState<{ app: ApplicationResponse; jobTitle: string }[]>([]);
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<{ app: ApplicationResponse; jobTitle: string } | null>(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");

  useEffect(() => {
    // Load local storage mock scheduled meetings if any
    const saved = localStorage.getItem("company_scheduled_meetings");
    if (saved) {
      setMeetings(JSON.parse(saved));
    }
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const companyJobs = await getCompanyJobs();

      const candidates: { app: ApplicationResponse; jobTitle: string }[] = [];
      await Promise.all(
        companyJobs.map(async (job) => {
          try {
            const apps = await getJobApplications(job.id);
            apps
              .filter((a) => a.status === "interview")
              .forEach((app) => {
                candidates.push({ app, jobTitle: job.title });
              });
          } catch (err) {
            console.error(err);
          }
        })
      );
      setInterviewCandidates(candidates);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleScheduleMeeting() {
    if (!selectedCandidate || !meetingDate || !meetingTime) {
      toast.error("Please select a candidate, date, and time.");
      return;
    }

    const newMeeting: ScheduledMeeting = {
      id: Math.random().toString(36).substr(2, 9),
      candidateId: selectedCandidate.app.student_id,
      jobTitle: selectedCandidate.jobTitle,
      date: meetingDate,
      time: meetingTime,
      link: `https://meet.jit.si/vedha-ai-interview-${selectedCandidate.app.id}`,
    };

    const updated = [newMeeting, ...meetings];
    setMeetings(updated);
    localStorage.setItem("company_scheduled_meetings", JSON.stringify(updated));
    toast.success("Interview scheduled and meeting invitation sent!");
    setSelectedCandidate(null);
    setMeetingDate("");
    setMeetingTime("");
  }

  function handleCancelMeeting(meetingId: string) {
    const updated = meetings.filter((m) => m.id !== meetingId);
    setMeetings(updated);
    localStorage.setItem("company_scheduled_meetings", JSON.stringify(updated));
    toast.success("Meeting canceled successfully.");
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-slate-400">
          <RefreshCw size={24} className="animate-spin mr-2" />
          Loading Scheduler Dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 font-sans">
        <div>
          <h1 className="text-3xl font-bold">Interview Scheduler</h1>
          <p className="mt-2 text-slate-400">
            Organize live discussions with candidates currently set to the Interview stage.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Scheduling Panel */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm lg:col-span-1">
            <h2 className="text-lg font-bold border-b border-slate-800 pb-3 mb-4">New Meeting Invite</h2>

            {interviewCandidates.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-500">
                No applicants currently in the "Interview" stage. Set a candidate status to "Interview" first in the Applicants portal.
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Candidate</label>
                  <select
                    value={selectedCandidate ? `${selectedCandidate.app.id}` : ""}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const match = interviewCandidates.find((c) => c.app.id === id);
                      setSelectedCandidate(match || null);
                    }}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 outline-none focus:border-emerald-500"
                  >
                    <option value="">Choose Candidate</option>
                    {interviewCandidates.map((c) => (
                      <option key={c.app.id} value={c.app.id}>
                        Student #{c.app.student_id} ({c.jobTitle})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Date</label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Time</label>
                  <input
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 outline-none focus:border-emerald-500"
                  />
                </div>

                <Button onClick={handleScheduleMeeting} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 text-xs">
                  <Calendar size={14} />
                  Confirm & Send Invite
                </Button>
              </div>
            )}
          </div>

          {/* Meetings List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="text-lg font-bold border-b border-slate-800 pb-3 mb-4">Scheduled Meetings</h2>

              {meetings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-sm">
                  No upcoming interviews scheduled yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-4 gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-emerald-400" />
                          <h4 className="font-semibold text-white text-sm">Candidate #{meeting.candidateId}</h4>
                        </div>
                        <p className="text-xs text-slate-400">Job Target: {meeting.jobTitle}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {meeting.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {meeting.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={meeting.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30"
                        >
                          <Video size={12} />
                          Join Call
                        </a>
                        <button
                          onClick={() => handleCancelMeeting(meeting.id)}
                          className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
