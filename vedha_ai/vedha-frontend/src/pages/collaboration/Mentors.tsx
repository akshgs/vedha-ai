import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Compass } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Input from "@/components/ui/input/Input";
import MentorCard from "@/components/ui/collaboration/MentorCard";
import BookingCalendar from "@/components/ui/collaboration/BookingCalendar";
import SessionCard from "@/components/ui/collaboration/SessionCard";
import {
  queryMentorsDirectory,
  getMentorAvailability,
  bookMentorshipSession,
  getSessionsHistory,
  type Mentor,
  type BookingSlot,
  type MentorshipSession,
} from "@/services/mentorship";

import PageHeader from "@/components/ui/layout/PageHeader";

export default function Mentors() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<BookingSlot[]>([]);
  const [activeTab, setActiveTab] = useState<"directory" | "sessions">("directory");

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [mentorsList, sessionsList] = await Promise.all([
          queryMentorsDirectory(),
          getSessionsHistory(),
        ]);
        setMentors(mentorsList);
        setSessions(sessionsList);
      } catch {
        toast.error("Failed to load mentorship directory.");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, []);

  async function handleSelectMentor(mentor: Mentor) {
    setSelectedMentor(mentor);
    try {
      const slots = await getMentorAvailability(mentor.id);
      setAvailabilitySlots(slots);
    } catch {
      toast.error("Failed to retrieve availability slots.");
    }
  }

  async function handleBookSession(slotId: string, goalText: string) {
    if (!selectedMentor) return;
    setBookingLoading(true);
    try {
      const created = await bookMentorshipSession(selectedMentor.id, slotId, goalText);
      setSessions([created, ...sessions]);
      setSelectedMentor(null);
      toast.success("Mentorship session requested successfully!");
      setActiveTab("sessions");
    } catch {
      toast.error("Failed to confirm mentorship slot.");
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Indexing Mentorship networks...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        <PageHeader
          title="Vedha Mentorship Network"
          subtitle="Schedule 1-on-1 consultations with verified experts to discuss roadmaps, review code, or request mock reviews."
          action={
            <div className="flex rounded-xl bg-slate-900/60 p-1 border border-slate-800">
              <button
                onClick={() => setActiveTab("directory")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition ${
                  activeTab === "directory" ? "bg-cyan-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                <Compass size={14} />
                Directory
              </button>
              <button
                onClick={() => setActiveTab("sessions")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition ${
                  activeTab === "sessions" ? "bg-cyan-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                <Award size={14} />
                My Sessions ({sessions.length})
              </button>
            </div>
          }
        />

        {/* Tab 1: Directory */}
        {activeTab === "directory" && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Mentors list */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search */}
              <Card variant="glass" className="p-4">
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Search expertise, company, or language tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </Card>

              <div className="grid gap-6 sm:grid-cols-2">
                {mentors
                  .filter(
                    (m) =>
                      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      m.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((mentor) => (
                    <MentorCard
                      key={mentor.id}
                      id={mentor.id}
                      name={mentor.name}
                      role={mentor.role}
                      company={mentor.company}
                      rating={mentor.rating}
                      reviewsCount={mentor.reviewsCount}
                      skills={mentor.skills}
                      bio={mentor.bio}
                      onBook={() => handleSelectMentor(mentor)}
                      onChat={() => navigate("/collaboration/messages")}
                    />
                  ))}
              </div>
            </div>

            {/* Selected Booking Calendar slots drawer */}
            <div className="space-y-6">
              {selectedMentor ? (
                <div className="space-y-4">
                  <Card variant="glass" className="p-4 border-cyan-500/20 text-center">
                    <h4 className="font-bold text-white text-xs">Booking slots for: {selectedMentor.name}</h4>
                    <p className="text-[10px] text-slate-550 mt-1">Review dates availability and select a slot below</p>
                  </Card>
                  <BookingCalendar
                    slots={availabilitySlots}
                    onBook={handleBookSession}
                    loading={bookingLoading}
                  />
                </div>
              ) : (
                <Card variant="glass" className="p-8 text-center text-slate-500 italic text-xs leading-relaxed">
                  Choose a mentor from the directory to review slot availability and book a simulated mock review.
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Booked Session History */}
        {activeTab === "sessions" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((sess) => (
              <SessionCard
                key={sess.id}
                id={sess.id}
                mentorName={sess.mentorName}
                role={sess.role}
                date={sess.date}
                time={sess.time}
                status={sess.status}
                notes={sess.notes}
                goal={sess.goal}
                onReviewSubmit={() => {
                  toast.success("Review logged for session!");
                }}
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
