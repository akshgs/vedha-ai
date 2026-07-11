import {
  Upload,
  Brain,
  GraduationCap,
  MessageSquare,
  Briefcase,
  BarChart3,
  ArrowDown,
} from "lucide-react";

const workflow = [
  {
    icon: Upload,
    title: "Upload Resume",
    description: "Upload your latest resume in seconds.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Vedha AI analyzes ATS score, skills and gaps.",
  },
  {
    icon: GraduationCap,
    title: "Learning Roadmap",
    description: "Receive a personalized roadmap for your goals.",
  },
  {
    icon: MessageSquare,
    title: "Mock Interview",
    description: "Practice interviews with AI feedback.",
  },
  {
    icon: Briefcase,
    title: "Job Matching",
    description: "Discover jobs matched to your profile.",
  },
  {
    icon: BarChart3,
    title: "Career Dashboard",
    description: "Track your growth and interview readiness.",
  },
];

export default function Workflow() {
  return (
    <section className="bg-slate-950 py-32">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            How It Works
          </span>

          <h2 className="mt-6 text-5xl font-black text-white">
            Your AI Career Journey
          </h2>

          <p className="mt-6 text-lg text-slate-400">
            From resume upload to landing your dream job —
            Vedha AI guides every step.
          </p>
        </div>

        <div className="mt-20 flex flex-col items-center">

          {workflow.map(({ icon: Icon, title, description }, index) => (
            <div key={title} className="flex flex-col items-center">

              <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-white">
                  {title}
                </h3>

                <p className="mt-3 text-slate-400">
                  {description}
                </p>

              </div>

              {index !== workflow.length - 1 && (
                <ArrowDown className="my-6 text-cyan-500" size={32} />
              )}

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}