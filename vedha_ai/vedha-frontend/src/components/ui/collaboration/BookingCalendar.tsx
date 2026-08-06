import { useState } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";

interface Slot {
  id: string;
  date: string;
  time: string;
  booked: boolean;
}

interface BookingCalendarProps {
  slots: Slot[];
  onBook: (slotId: string, goalText: string) => void;
  loading?: boolean;
}

export default function BookingCalendar({ slots, onBook, loading = false }: BookingCalendarProps) {
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [goalText, setGoalText] = useState("");

  function handleSubmit() {
    if (!selectedSlotId || !goalText.trim()) return;
    onBook(selectedSlotId, goalText);
    setSelectedSlotId("");
    setGoalText("");
  }

  return (
    <Card variant="glass" className="p-5 space-y-4">
      <div className="flex gap-2 items-center border-b border-slate-800 pb-2.5">
        <CalendarIcon size={16} className="text-cyan-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Select Available Time Slot</h4>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {slots.map((s) => {
          const isSelected = selectedSlotId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSlotId(s.id)}
              disabled={s.booked}
              className={`rounded-xl border p-3 text-center text-xs transition ${
                isSelected
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-inner"
                  : "border-slate-850 bg-slate-900/20 text-slate-400 hover:border-slate-750 hover:text-white"
              } disabled:opacity-50`}
            >
              <span className="block font-bold">{s.date}</span>
              <span className="text-[10px] text-slate-500 mt-1 block flex items-center justify-center gap-1">
                <Clock size={10} />
                {s.time}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2 border-t border-slate-900 pt-3">
        <label className="text-[10px] uppercase font-bold text-slate-500 block">Session Learning Goals</label>
        <textarea
          placeholder="e.g. Discuss low-latency designs or backend database query optimization..."
          value={goalText}
          onChange={(e) => setGoalText(e.target.value)}
          className="w-full bg-slate-950/60 border border-slate-850 rounded-xl p-3 text-xs text-slate-350 outline-none focus:border-cyan-500 h-16 resize-none"
        />
      </div>

      <div className="flex justify-end pt-1">
        <Button
          onClick={handleSubmit}
          disabled={!selectedSlotId || !goalText.trim() || loading}
          className="text-xs py-2 px-6"
        >
          {loading ? "Scheduling session..." : "Book Mentorship Session"}
        </Button>
      </div>
    </Card>
  );
}
