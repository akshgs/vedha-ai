interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
  color: string;
}

const activities: Activity[] = [
  {
    id: 1,
    title: "Resume Uploaded",
    description: "Your resume was successfully uploaded and analyzed.",
    time: "Today",
    color: "bg-cyan-500",
  },
  {
    id: 2,
    title: "AI Interview Completed",
    description: "You completed an AI mock interview.",
    time: "Yesterday",
    color: "bg-emerald-500",
  },
  {
    id: 3,
    title: "Roadmap Generated",
    description: "A personalized learning roadmap was created.",
    time: "2 days ago",
    color: "bg-violet-500",
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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <h2 className="mb-6 text-xl font-bold text-white">
        Recent Activity
      </h2>

      <div className="space-y-6">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4"
          >
            <div className="flex flex-col items-center">
              <div
                className={`h-3 w-3 rounded-full ${activity.color}`}
              />
              <div className="mt-1 h-full w-px bg-slate-700" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">
                  {activity.title}
                </h3>

                <span className="text-xs text-slate-400">
                  {activity.time}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-400">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}