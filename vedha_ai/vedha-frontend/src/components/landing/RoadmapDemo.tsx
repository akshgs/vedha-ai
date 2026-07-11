import {
  GraduationCap,
  CheckCircle2,
  Clock3,
  Target,
} from "lucide-react";

const roadmap = [
  {
    title: "Python & Programming",
    duration: "2 Weeks",
    completed: true,
  },
  {
    title: "Data Structures & Algorithms",
    duration: "4 Weeks",
    completed: true,
  },
  {
    title: "Machine Learning",
    duration: "6 Weeks",
    completed: false,
  },
  {
    title: "FastAPI & Backend",
    duration: "3 Weeks",
    completed: false,
  },
  {
    title: "React & Frontend",
    duration: "4 Weeks",
    completed: false,
  },
];

export default function RoadmapDemo() {
  return (
    <section className="bg-slate-950 py-28">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            AI Learning Roadmap
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Personalized Learning Journey
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Vedha AI builds a custom roadmap based on your skills,
            goals, and dream job.
          </p>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-2">

          {/* Left */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">

            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-violet-500/10 p-4 text-violet-400">
                <GraduationCap size={28} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  AI Generated Roadmap
                </h3>

                <p className="text-slate-400">
                  Tailored for AI Engineer
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">

              {roadmap.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-2xl bg-slate-950 p-5"
                >
                  <div>
                    <h4 className="font-semibold text-white">
                      {item.title}
                    </h4>

                    <p className="mt-1 text-sm text-slate-400">
                      {item.duration}
                    </p>
                  </div>

                  {item.completed ? (
                    <CheckCircle2 className="text-emerald-400" />
                  ) : (
                    <Clock3 className="text-yellow-400" />
                  )}
                </div>
              ))}

            </div>

          </div>

          {/* Right */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">

            <div className="flex items-center gap-3">
              <Target className="text-cyan-400" />

              <h3 className="text-xl font-bold text-white">
                Learning Progress
              </h3>
            </div>

            <div className="mt-10 text-center">

              <h1 className="text-7xl font-black text-violet-400">
                42%
              </h1>

              <p className="mt-3 text-slate-400">
                Roadmap Completed
              </p>

            </div>

            <div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
            </div>

            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <h4 className="font-semibold text-white">
                Next Recommendation
              </h4>

              <p className="mt-3 leading-7 text-slate-400">
                Complete the Machine Learning module before
                starting FastAPI to maximize backend AI development.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}