import Button from "@/components/ui/button/Button";
import ResumeScore from "@/components/resume/ResumeScore";
import ResumeSkills from "@/components/resume/ResumeSkills";
import ResumeSuggestions from "@/components/resume/ResumeSuggestions";
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

        <p className="mt-3 text-slate-400">
          Target Role:
          <span className="ml-2 font-semibold text-cyan-400">
            {analysis.target_role}
          </span>
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        <ResumeScore score={analysis.ats_score} />

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">
            Match Percentage
          </p>

          <h3 className="mt-3 text-5xl font-bold text-cyan-400">
            {analysis.match_percent}%
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

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">
            Missing Skills
          </p>

          <h3 className="mt-3 text-5xl font-bold text-red-400">
            {analysis.missing_skills.length}
          </h3>
        </div>

      </div>

      {/* Skills */}
      <ResumeSkills
        matchedSkills={analysis.matched_skills}
        missingSkills={analysis.missing_skills}
      />

      {/* AI Feedback */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h3 className="mb-6 text-2xl font-bold text-white">
          AI Career Feedback
        </h3>

        <ResumeSuggestions
          feedback={analysis.ai_feedback}
        />
      </div>

      {/* Analyze Again */}
      <div className="flex justify-center">
        <Button onClick={() => window.location.reload()}>
          Analyze Another Resume
        </Button>
      </div>
    </div>
  );
}