import {
  CheckCircle2,
  FileText,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const skills = [
  "Python",
  "FastAPI",
  "React",
  "Machine Learning",
  "SQL",
  "Git",
];

const suggestions = [
  "Add Docker experience",
  "Include measurable achievements",
  "Improve ATS keywords",
];

export default function ResumeDemo() {
  return (
    <section className="bg-slate-950 py-28">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            AI Resume Analyzer
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Get Instant Resume Feedback
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Upload your resume and receive ATS scoring, skill analysis,
            and personalized improvement suggestions powered by AI.
          </p>
        </div>

        {/* Content */}
        <div className="mt-20 grid gap-10 lg:grid-cols-2">

          {/* Left Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">

            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-400">
                <FileText size={28} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  Resume.pdf
                </h3>

                <p className="text-slate-400">
                  Successfully analyzed
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-3 rounded-xl bg-slate-950 p-4"
                >
                  <CheckCircle2
                    size={18}
                    className="text-emerald-400"
                  />

                  <span className="text-slate-300">
                    {skill}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-xl font-bold text-white">
                  ATS Score
                </h3>

                <p className="text-slate-400">
                  AI Evaluation
                </p>
              </div>

              <Sparkles className="text-cyan-400" />
            </div>

            <div className="mt-8 text-center">

              <h1 className="text-7xl font-black text-cyan-400">
                95
              </h1>

              <p className="mt-2 text-slate-400">
                Excellent Resume
              </p>

            </div>

            <div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-800">

              <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />

            </div>

            <div className="mt-10">

              <h4 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
                <TrendingUp size={18} />
                AI Suggestions
              </h4>

              <div className="space-y-3">

                {suggestions.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-300"
                  >
                    {item}
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}