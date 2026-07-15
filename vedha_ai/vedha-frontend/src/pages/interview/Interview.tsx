import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import QuestionCard from "@/components/interview/QuestionCard";
import AnswerEditor from "@/components/interview/AnswerEditor";
import ProgressBar from "@/components/interview/ProgressBar";
import ScoreCard from "@/components/interview/ScoreCard";
import EvaluationCard from "@/components/interview/EvaluationCard";

import {
  generateInterview,
  evaluateInterview,
  type InterviewGenerateResponse,
  type InterviewEvaluateResponse,
} from "@/services/interview";

export default function Interview() {
  const [interview, setInterview] =
    useState<InterviewGenerateResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState<string[]>([]);

  const [result, setResult] =
    useState<InterviewEvaluateResponse | null>(null);

  const [evaluating, setEvaluating] =
    useState(false);

  useEffect(() => {
    async function loadInterview() {
      try {
        const data = await generateInterview({
          student_id: 2,
          target_role: "Machine Learning Engineer",
        });

        setInterview(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadInterview();
  }, []);

  const questions = useMemo(() => {
    if (!interview) return [];

    return [
      ...interview.base_questions.technical,
      ...interview.base_questions.hr,
      ...interview.ai_questions.technical,
      ...interview.ai_questions.follow_up,
      ...interview.ai_questions.scenario,
    ];
  }, [interview]);

  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(new Array(questions.length).fill(""));
    }
  }, [questions]);

  function updateAnswer(value: string) {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestion] = value;
      return updated;
    });
  }

  async function submitInterview() {
    if (!interview) return;

    try {
      setEvaluating(true);

      const response = await evaluateInterview({
        interview_id: interview.interview_id,
        question: questions[currentQuestion],
        answer: answers[currentQuestion] ?? "",
        target_role: "Machine Learning Engineer",
      });

      setResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setEvaluating(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-900 p-8 text-center text-white">
          Generating AI Interview...
        </div>
      </DashboardLayout>
    );
  }

  if (!interview) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-red-500/10 p-8 text-center text-red-400">
          Failed to generate interview.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">
              AI Interview
            </h1>

            <p className="mt-2 text-slate-400">
              Interview ID : {interview.interview_id}
            </p>
          </div>

          <div className="rounded-xl bg-cyan-500/20 px-5 py-3 font-bold text-cyan-400">
            {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        <ProgressBar
          current={currentQuestion + 1}
          total={questions.length}
        />

        <QuestionCard
          question={questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
        />

        <AnswerEditor
          value={answers[currentQuestion] ?? ""}
          onChange={updateAnswer}
        />

        <div className="flex justify-between">

          <button
            disabled={currentQuestion === 0}
            onClick={() =>
              setCurrentQuestion((prev) => prev - 1)
            }
            className="rounded-xl bg-slate-800 px-6 py-3 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={submitInterview}
              disabled={evaluating}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {evaluating
                ? "Evaluating..."
                : "Submit Interview"}
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentQuestion((prev) => prev + 1)
              }
              className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-500"
            >
              Next
            </button>
          )}

        </div>

        {result && (
          <div className="space-y-8">

            <div className="grid gap-6 md:grid-cols-3">

              <ScoreCard
                title="Technical Score"
                score={result.technical_score}
              />

              <ScoreCard
                title="Communication Score"
                score={result.communication_score}
              />

              <ScoreCard
                title="Overall Score"
                score={result.overall_score}
              />

            </div>

            <div className="grid gap-6 lg:grid-cols-3">

              <EvaluationCard
                title="Strengths"
                items={result.strengths}
                color="text-emerald-400"
              />

              <EvaluationCard
                title="Weaknesses"
                items={result.weaknesses}
                color="text-red-400"
              />

              <EvaluationCard
                title="Suggestions"
                items={result.suggestions}
                color="text-cyan-400"
              />

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}