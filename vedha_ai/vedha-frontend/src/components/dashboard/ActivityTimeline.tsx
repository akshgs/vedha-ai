interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
  color: string; // Tailwind bullet bg class (e.g. "bg-blue-500")
}

const activities: Activity[] = [
  {
    id: 1,
    title: "Resume Uploaded",
    description: "Your resume was successfully uploaded and analyzed.",
    time: "Today",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "AI Interview Completed",
    description: "You completed an AI mock interview.",
    time: "Yesterday",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Roadmap Generated",
    description: "A personalized learning roadmap was created.",
    time: "2 days ago",
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Jobs Recommended",
    description: "New job recommendations are available.",
    time: "3 days ago",
    color: "bg-amber-500",
  },
];

export default function ActivityTimeline() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {activities.map((activity, idx) => (
        <div
          key={activity.id}
          style={{ display: 'flex', alignItems: 'start', gap: 14 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div
              className={`h-3 w-3 rounded-full mt-1.5 ${activity.color}`}
              style={{ border: '2.5px solid #111827', boxShadow: '0 0 0 1px #1F2937' }}
            />
            {idx < activities.length - 1 && (
              <div className="w-px bg-slate-800" style={{ height: 40, marginTop: 8 }} />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', flexGrow: 1 }}>
                {activity.title}
              </h3>

              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
                {activity.time}
              </span>
            </div>

            <p style={{ marginTop: 4, fontSize: 14, color: '#94A3B8', lineHeight: 1.5 }}>
              {activity.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}