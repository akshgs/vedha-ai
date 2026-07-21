import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";

import {
  getInterviewReport,
  type InterviewReportResponse,
} from "@/services/interview";

export default function InterviewReport() {
  const { interviewId } = useParams();

  const [loading, setLoading] = useState(true);

  const [report, setReport] =
    useState<InterviewReportResponse | null>(null);

  useEffect(() => {
    async function loadReport() {
      try {
        if (!interviewId) return;

        const data = await getInterviewReport(
          Number(interviewId)
        );

        setReport(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [interviewId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-900 p-8 text-center text-white">
          Loading Interview Report...
        </div>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <h2 className="text-xl font-bold text-red-400">
            Failed to load interview report
          </h2>

          <p className="mt-2 text-slate-300">
            Please try again later.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8">

        <div>
          <h1 className="text-4xl font-bold text-white">
            Interview Report
          </h1>

          <p className="mt-2 text-slate-400">
            Interview ID : {interviewId}
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
          <h2 className="mb-3 text-2xl font-bold text-cyan-400">
            Overall Assessment
          </h2>

          <p className="text-slate-300">
            {report.overall_assessment}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl bg-slate-900 p-6">
            <h3 className="mb-2 text-xl font-semibold text-white">
              Technical Level
            </h3>

            <p className="text-cyan-400">
              {report.technical_level}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <h3 className="mb-2 text-xl font-semibold text-white">
              Communication Level
            </h3>

            <p className="text-cyan-400">
              {report.communication_level}
            </p>
          </div>

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl bg-slate-900 p-6">
            <h3 className="mb-4 text-xl font-bold text-emerald-400">
              Strengths
            </h3>

            {report.strengths.length === 0 ? (
              <p className="text-slate-500">No strengths available.</p>
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-slate-300">
                {report.strengths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <h3 className="mb-4 text-xl font-bold text-red-400">
              Weaknesses
            </h3>

            {report.weaknesses.length === 0 ? (
              <p className="text-slate-500">No weaknesses available.</p>
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-slate-300">
                {report.weaknesses.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl bg-slate-900 p-6">
            <h3 className="mb-4 text-xl font-bold text-cyan-400">
              Recommended Topics
            </h3>

            {report.recommended_topics.length === 0 ? (
              <p className="text-slate-500">No recommended topics available.</p>
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-slate-300">
                {report.recommended_topics.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <h3 className="mb-4 text-xl font-bold text-cyan-400">
              Recommended Projects
            </h3>

            {report.recommended_projects.length === 0 ? (
              <p className="text-slate-500">No recommended projects available.</p>
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-slate-300">
                {report.recommended_projects.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>

        </div>

        <div className="rounded-2xl bg-slate-900 p-6 space-y-6">

          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Job Readiness
            </h3>

            <p className="text-yellow-400">
              {report.job_readiness}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Next Learning Plan
            </h3>

            <p className="text-slate-300">
              {report.next_learning_plan}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Hiring Recommendation
            </h3>

            <p className="text-slate-300">
              {report.hiring_recommendation}
            </p>
          </div>

        </div>

        <div className="flex justify-end">
          <Link
            to="/interview/history"
            className="rounded-lg bg-cyan-600 px-6 py-3 text-white transition hover:bg-cyan-700"
          >
            View Interview History
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}