import { useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import ResumeUploader from "@/components/resume/ResumeUploader";
import ResumeResult from "@/components/resume/ResumeResult";

import type { ResumeAnalysisResponse } from "@/services/resume";

export default function Resume() {
  const [analysis, setAnalysis] =
    useState<ResumeAnalysisResponse | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            AI Resume Analyzer
          </h1>

          <p className="mt-2 text-slate-400">
            Upload your resume and receive an AI-powered
            analysis with skill matching, career feedback,
            and improvement suggestions.
          </p>
        </div>

        {!analysis ? (
          <ResumeUploader
            onAnalysis={setAnalysis}
          />
        ) : (
          <ResumeResult
            analysis={analysis}
          />
        )}
      </div>
    </DashboardLayout>
  );
}