import { useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import InterviewCard from "@/components/ui/career/InterviewCard";
import OfferCard from "@/components/ui/career/OfferCard";
import BookingCalendar from "@/components/ui/collaboration/BookingCalendar";
import PageHeader from "@/components/ui/layout/PageHeader";
import {
  getScheduledInterviews,
  queryAvailableInterviewSlots,
  bookInterviewMeeting,
  getOfferLetters,
  updateOfferStatus,
  type ScheduledInterview,
  type OfferDetail,
} from "@/services/interviews";

interface BookingSlotType {
  id: string;
  date: string;
  time: string;
  booked: boolean;
}

export default function Interviews() {
  const [interviews, setInterviews] = useState<ScheduledInterview[]>([]);
  const [offers, setOffers] = useState<OfferDetail[]>([]);
  const [slots, setSlots] = useState<BookingSlotType[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [interviewsList, offersList, slotsList] = await Promise.all([
          getScheduledInterviews(),
          getOfferLetters(),
          queryAvailableInterviewSlots("Google DeepMind"),
        ]);
        setInterviews(interviewsList);
        setOffers(offersList);
        // Map slot type
        setSlots(slotsList.map((s) => ({ id: s.id, date: s.date, time: s.time, booked: !s.available })));
      } catch {
        toast.error("Failed to retrieve scheduling profiles.");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, []);

  async function handleBookMeeting(slotId: string, details: string) {
    setBookingLoading(true);
    try {
      const booked = await bookInterviewMeeting(slotId, details);
      setInterviews([booked, ...interviews]);
      toast.success("Interview scheduled! Join link generated.");
    } catch {
      toast.error("Scheduling transaction failed.");
    } finally {
      setBookingLoading(false);
    }
  }

  async function handleAcceptOffer(offerId: string) {
    try {
      await updateOfferStatus(offerId, "Accepted");
      setOffers(offers.map((o) => (o.id === offerId ? { ...o, status: "Accepted" as const } : o)));
      toast.success("Congratulations! Placement recorded.");
    } catch {
      toast.error("Offer transaction failed.");
    }
  }

  async function handleDeclineOffer(offerId: string) {
    try {
      await updateOfferStatus(offerId, "Declined");
      setOffers(offers.map((o) => (o.id === offerId ? { ...o, status: "Declined" as const } : o)));
      toast.success("Offer declined successfully.");
    } catch {
      toast.error("Offer transaction failed.");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Loading scheduling dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Master Page Header */}
        <PageHeader
          title="Interview Scheduler & Offer Desk"
          subtitle="Book slots with corporate recruiters, join secure coding interview rooms, and track job offers."
          icon={<CalendarIcon size={22} />}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Interviews & Offers list */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Scheduled Interviews</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {interviews.map((i) => (
                  <InterviewCard key={i.id} interview={i} />
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-900 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Offer Desk Letters</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {offers.map((o) => (
                  <OfferCard
                    key={o.id}
                    id={o.id}
                    jobTitle={o.jobTitle}
                    companyName={o.companyName}
                    salary={o.salary}
                    deadline={o.deadline}
                    status={o.status}
                    onAccept={handleAcceptOffer}
                    onDecline={handleDeclineOffer}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Book Slot sidebar */}
          <div className="space-y-6">
            <BookingCalendar
              slots={slots}
              onBook={handleBookMeeting}
              loading={bookingLoading}
            />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
