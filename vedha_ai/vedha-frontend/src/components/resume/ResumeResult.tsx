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
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h2 className="text-3xl font-bold text-white">
          Resume Analysis
        </h2>

        <p className="mt-2 text-slate-400">
          Target Role:
          <span className="ml-2 font-semibold text-cyan-400">
            {analysis.target_role}
          </span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ResumeScore score={analysis.ats_score} />

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">
            Skills Found
          </p>

          <h3 className="mt-3 text-5xl font-bold text-emerald-400">
            {analysis.total_skills_found}
          </h3>
        </div>
      </div>

      <ResumeSkills
        matchedSkills={analysis.matched_skills}
        missingSkills={analysis.missing_skills}
      />

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h3 className="mb-6 text-2xl font-bold">
          AI Career Feedback
        </h3>

        <ResumeSuggestions
          feedback={analysis.ai_feedback}
        />
      </div>

      <div className="flex justify-center">
        <Button onClick={() => window.location.reload()}>
          Analyze Another Resume
        </Button>
      </div>
    </div>
  );
}