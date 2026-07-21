type Props = {
  resumeScore: number;
  roadmapProgress: number;
  completedInterviews: number;
  totalJobs: number;
};

export default function AIInsights({
  resumeScore,
  roadmapProgress,
  completedInterviews,
  totalJobs,
}: Props) {
  const insights: string[] = [];

  if (resumeScore < 70) {
    insights.push(
      "Improve your resume to increase ATS compatibility."
    );
  }

  if (roadmapProgress < 50) {
    insights.push(
      "Continue your roadmap to strengthen your skills."
    );
  }

  if (completedInterviews < 3) {
    insights.push(
      "Practice more AI interviews to improve confidence."
    );
  }

  if (totalJobs > 0) {
    insights.push(
      `You have ${totalJobs} matching jobs available.`
    );
  }

  if (insights.length === 0) {
    insights.push(
      "Excellent progress! Keep maintaining your performance."
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4"
        >
          <span className="text-xl">🤖</span>

          <p className="text-slate-200">
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}