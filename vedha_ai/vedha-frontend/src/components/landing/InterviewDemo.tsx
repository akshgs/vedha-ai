import {
  Brain,
  Mic,
  MessageSquare,
  Star,
  TrendingUp,
} from "lucide-react";

const scores = [
  { label: "Communication", value: 94 },
  { label: "Technical Skills", value: 96 },
  { label: "Confidence", value: 91 },
];

export default function InterviewDemo() {
  return (
    <section className="bg-slate-950 py-28">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            AI Mock Interview
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Practice Before The Real Interview
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Get AI-powered interview questions, real-time feedback, and
            performance analytics to improve your confidence.
          </p>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-2">

          {/* Left Panel */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">

            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-400">
                <Brain size={30} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  Live AI Interview
                </h3>

                <p className="text-slate-400">
                  Question 3 of 10
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <p className="text-slate-300">
                Explain the difference between supervised and unsupervised
                machine learning with practical examples.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4 rounded-2xl bg-slate-950 p-6">
              <Mic className="text-red-400" />

              <div className="flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-red-500 to-orange-400" />
                </div>

                <p className="mt-3 text-sm text-slate-400">
                  Recording your answer...
                </p>
              </div>
            </div>

          </div>

          {/* Right Panel */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">

            <div className="flex items-center gap-3">
              <TrendingUp className="text-cyan-400" />

              <h3 className="text-xl font-bold text-white">
                AI Performance Analysis
              </h3>
            </div>

            <div className="mt-8 space-y-6">

              {scores.map((score) => (
                <div key={score.label}>
                  <div className="mb-2 flex justify-between">
                    <span className="text-slate-300">
                      {score.label}
                    </span>

                    <span className="font-semibold text-white">
                      {score.value}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                      style={{ width: `${score.value}%` }}
                    />
                  </div>
                </div>
              ))}

            </div>

            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950 p-6">

              <div className="flex items-center gap-2">
                <MessageSquare className="text-yellow-400" />

                <h4 className="font-semibold text-white">
                  AI Feedback
                </h4>
              </div>

              <p className="mt-4 leading-7 text-slate-400">
                Excellent technical explanation. Improve eye contact,
                reduce filler words, and provide more real-world examples.
              </p>

              <div className="mt-6 flex gap-1 text-yellow-400">
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star size={20} />
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}