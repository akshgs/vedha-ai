import { useState } from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";

interface Slot {
  id: string;
  date: string;
  time: string;
  booked: boolean;
}

interface AvailabilityCalendarProps {
  slots: Slot[];
  onPublishSlot: (date: string, time: string) => void;
}

export default function AvailabilityCalendar({ slots, onPublishSlot }: AvailabilityCalendarProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time) return;
    onPublishSlot(date, time);
    setDate("");
    setTime("");
  }

  return (
    <Card variant="glass" className="p-5 space-y-5">
      <div className="flex gap-2 items-center border-b border-slate-800 pb-2.5">
        <CalendarIcon size={16} className="text-cyan-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Availability Scheduler Console</h4>
      </div>

      {/* Slots List */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Availability Slots</span>
        <div className="grid gap-2 sm:grid-cols-2">
          {slots.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center rounded-xl bg-slate-950/60 p-2.5 border border-slate-900 text-xs text-slate-300"
            >
              <span>{s.date} at {s.time}</span>
              <span
                className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  s.booked ? "bg-emerald-500/10 text-emerald-450" : "bg-cyan-500/10 text-cyan-400"
                }`}
              >
                {s.booked ? "Booked" : "Available"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Slot Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-end border-t border-slate-900 pt-4">
        <div className="flex-1 space-y-1">
          <label className="text-[9px] uppercase font-bold text-slate-500">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-[9px] uppercase font-bold text-slate-500">Time</label>
          <input
            type="text"
            placeholder="e.g. 10:00 AM"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
          />
        </div>
        <Button type="submit" disabled={!date || !time} className="text-xs py-1.5 px-4 flex items-center gap-1">
          <Plus size={12} />
          Publish
        </Button>
      </form>
    </Card>
  );
}
