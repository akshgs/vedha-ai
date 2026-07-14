import ReactMarkdown from "react-markdown";
import type { ResumeAnalysisResponse } from "@/services/resume";

type Props = {
  analysis: ResumeAnalysisResponse;
};

export default function ResumeResult({
  analysis,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h2 className="text-3xl font-bold text-white">
          Resume Analysis
        </h2>

        <p className="mt-2 text-slate-400">
          Target Role:{" "}
          <span className="font-semibold text-cyan-400">
            {analysis.target_role}
          </span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">
            Match Percentage
          </p>

          <h3 className="mt-3 text-5xl font-bold text-cyan-400">
            {analysis.match_percent.toFixed(1)}%
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">
            Skills Found
          </p>

          <h3 className="mt-3 text-5xl font-bold text-emerald-400">
            {analysis.total_skills_found}
          </h3>
        </div>
      </div>

      {/* Skills */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-5 text-xl font-bold">
            Extracted Skills
          </h3>

          <div className="flex flex-wrap gap-3">
            {analysis.extracted_skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-cyan-500/20 px-4 py-2 text-sm text-cyan-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-5 text-xl font-bold">
            Missing Skills
          </h3>

          <div className="flex flex-wrap gap-3">
            {analysis.missing_skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-red-500/20 px-4 py-2 text-sm text-red-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Matched Skills */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-5 text-xl font-bold">
          Matched Skills
        </h3>

        <div className="flex flex-wrap gap-3">
          {analysis.matched_skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm text-emerald-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* AI Feedback */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h3 className="mb-6 text-2xl font-bold">
          AI Career Feedback
        </h3>

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>
            {analysis.ai_feedback}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}