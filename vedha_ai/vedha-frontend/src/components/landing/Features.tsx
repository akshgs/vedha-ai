import {
  Brain,
  FileText,
  Briefcase,
  GraduationCap,
  MessageSquare,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Resume Analyzer",
    description:
      "Analyze resumes with ATS scoring and actionable AI feedback.",
  },
  {
    icon: GraduationCap,
    title: "Learning Roadmaps",
    description:
      "Receive personalized learning paths based on your career goals.",
  },
  {
    icon: MessageSquare,
    title: "AI Mock Interviews",
    description:
      "Practice technical and HR interviews with instant AI feedback.",
  },
  {
    icon: Briefcase,
    title: "Smart Job Matching",
    description:
      "Discover jobs that match your skills and profile.",
  },
  {
    icon: Brain,
    title: "Skill Gap Analysis",
    description:
      "Identify missing skills and receive AI-powered recommendations.",
  },
  {
    icon: BarChart3,
    title: "Career Analytics",
    description:
      "Track your progress, interview readiness, and career growth.",
  },
];

export default function Features() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-white">
            Everything You Need To Build Your Career
          </h2>

          <p className="mt-6 text-lg text-slate-400">
            Vedha AI combines intelligent career tools into one powerful
            platform for students and professionals.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500"
            >
              <div className="mb-6 inline-flex rounded-2xl bg-blue-500/10 p-4 text-blue-400">
                <Icon size={28} />
              </div>

              <h3 className="text-2xl font-semibold text-white">
                {title}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}