import {
  Brain,
  Briefcase,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessagesSquare,
} from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Upload Resume",
    description: "Upload your latest resume in seconds.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Analyze ATS score, skills and gaps.",
  },
  {
    icon: GraduationCap,
    title: "Learning Roadmap",
    description: "Receive a personalized roadmap.",
  },
  {
    icon: MessagesSquare,
    title: "Mock Interview",
    description: "Practice with AI interview sessions.",
  },
  {
    icon: Briefcase,
    title: "Smart Job Match",
    description: "Find jobs matching your skills.",
  },
  {
    icon: LayoutDashboard,
    title: "Career Dashboard",
    description: "Track your complete career growth.",
  },
];

export default function AIJourney() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-28">

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">

        <div className="mx-auto mb-20 max-w-3xl text-center">

          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            How Vedha AI Works
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Your AI Career Journey
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            From uploading your resume to getting hired,
            Vedha AI guides every step with intelligent
            recommendations and personalized learning.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-slate-800 bg-slate-900/60 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40 hover:bg-slate-900"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={30} />
                </div>

                <h3 className="text-2xl font-bold text-white">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {step.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}