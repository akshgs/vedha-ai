import { useEffect, useState } from "react";
import { Users, Plus, Clock, Video, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import { getMentorshipSlots, addMentorshipSlot, type MentorshipSlot } from "@/services/employee";

export default function Mentorship() {
  const [slots, setSlots] = useState<MentorshipSlot[]>([]);
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSlots() {
      try {
        setLoading(true);
        const data = await getMentorshipSlots();
        setSlots(data);
      } catch {
        toast.error("Failed to load mentorship slots.");
      } finally {
        setLoading(false);
      }
    }
    void loadSlots();
  }, []);

  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!dateTime.trim()) {
      toast.error("Please specify session date and time.");
      return;
    }

    try {
      const newSlot = await addMentorshipSlot(dateTime);
      setSlots([...slots, newSlot]);
      setDateTime("");
      toast.success("Mentorship session slot added successfully!");
    } catch {
      toast.error("Failed to register slot.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="text-cyan-400" />
            Industry Mentoring Sessions
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Publish available time slots, review scheduled bookings, and configure virtual meeting options.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xs text-slate-500 py-12 animate-pulse">Loading sessions...</div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Slot Creator & Active Bookings */}
            <div className="lg:col-span-2 space-y-8">
              {/* Creator Card */}
              <Card variant="glass" className="p-6">
                <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Publish New Meeting Slot</h3>
                <form onSubmit={handleAddSlot} className="flex gap-4 items-end flex-wrap sm:flex-nowrap">
                  <div className="w-full">
                    <Input
                      label="Slot Date and Time"
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="shrink-0 px-6 py-2.5 flex items-center gap-1">
                    <Plus size={14} />
                    Add Slot
                  </Button>
                </form>
              </Card>

              {/* Booked list */}
              <Card variant="glass" className="p-6">
                <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Booked Engagements</h3>
                {slots.filter(s => s.status === "Booked").length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">No scheduled student meetings confirmed yet.</p>
                ) : (
                  <div className="space-y-4">
                    {slots.filter(s => s.status === "Booked").map((slot) => (
                      <div key={slot.id} className="flex justify-between items-center rounded-xl bg-slate-950/40 p-4 border border-slate-850">
                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-sm">{slot.studentName}</h4>
                          <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {slot.dateTime}</span>
                          <span className="text-[10px] text-slate-500 block">Topic: {slot.topic}</span>
                        </div>
                        <Button
                          onClick={() => toast.success("Google Meet virtual link generated and shared!")}
                          className="text-xs py-1.5 px-4 bg-cyan-600 hover:bg-cyan-500 flex items-center gap-1"
                        >
                          <Video size={12} />
                          Launch Meet
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Right column: Slots slots settings */}
            <div>
              <Card variant="glass" className="p-6 space-y-4">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 mb-4">Availability Slots</h3>
                {slots.filter(s => s.status === "Available").length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">No empty slots listed. Create one above!</p>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {slots.filter(s => s.status === "Available").map((slot) => (
                      <div key={slot.id} className="flex justify-between items-center bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-xs text-white">
                        <span className="font-semibold text-slate-300">{slot.dateTime}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSlots(slots.filter(s => s.id !== slot.id));
                              toast.info("Slot removed from calendar.");
                            }}
                            className="text-slate-500 hover:text-red-400 transition"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
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
