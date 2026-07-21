import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";

import QuestionCard from "@/components/interview/QuestionCard";
import AnswerEditor from "@/components/interview/AnswerEditor";
import ProgressBar from "@/components/interview/ProgressBar";
import ScoreCard from "@/components/interview/ScoreCard";
import EvaluationCard from "@/components/interview/EvaluationCard";

import {
  generateInterview,
  evaluateInterview,
  completeInterview,
  type InterviewGenerateResponse,
  type InterviewEvaluateResponse,
} from "@/services/interview";

export default function Interview() {
  const navigate = useNavigate();
  const location = useLocation();

  const targetRole: string =
    (location.state as { target_role?: string })?.target_role ??
    "Machine Learning Engineer";

  const [interview, setInterview] =
    useState<InterviewGenerateResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<string[]>([]);

  const [result, setResult] =
    useState<InterviewEvaluateResponse | null>(null);

  const [evaluating, setEvaluating] = useState(false);

  // Fix #3: track whether the score for the current question has been
  // shown to the user yet. "Next" first reveals the score, then advances.
  const [awaitingAdvance, setAwaitingAdvance] = useState(false);

  useEffect(() => {
    async function loadInterview() {
      const storedId = Number(localStorage.getItem("student_id"));

      if (!storedId) {
        setLoadError("You must be logged in to start an interview.");
        setLoading(false);
        return;
      }

      try {
        const data = await generateInterview({
          student_id: storedId,
          target_role: targetRole,
        });

        setInterview(data);
      } catch (error) {
        console.error(error);
        setLoadError("Failed to load interview. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadInterview();
  }, [targetRole]);

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

  async function runEvaluation() {
    if (!interview) return null;

    if (!answers[currentQuestion]?.trim()) {
      alert("Please answer the current question.");
      return null;
    }

    try {
      setEvaluating(true);

      const response = await evaluateInterview({
        interview_id: interview.interview_id,
        question: questions[currentQuestion],
        answer: answers[currentQuestion],
        target_role: targetRole,
      });

      setResult(response);
      return response;
    } catch (error) {
      console.error(error);
      alert("Failed to evaluate your answer. Please try again.");
      return null;
    } finally {
      setEvaluating(false);
    }
  }

  async function handleNext() {
    // Step 1: evaluate and show the score, without advancing yet.
    if (!awaitingAdvance) {
      const response = await runEvaluation();

      if (response) {
        setAwaitingAdvance(true);
      }

      return;
    }

    // Step 2: user has seen the score, now advance.
    setResult(null);
    setAwaitingAdvance(false);
    setCurrentQuestion((prev) => prev + 1);
  }

  async function handleSubmit() {
    if (!interview) return;

    // Same two-step flow on the last question: evaluate + show score first.
    if (!awaitingAdvance) {
      const response = await runEvaluation();

      if (response) {
        setAwaitingAdvance(true);
      }

      return;
    }

    try {
      setEvaluating(true);

      await completeInterview({
        interview_id: interview.interview_id,
      });

      navigate(`/interview/report/${interview.interview_id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to submit interview. Please try again.");
    } finally {
      setEvaluating(false);
    }
  }

  const isLastQuestion = currentQuestion === questions.length - 1;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-500">
          Loading interview...
        </div>
      </DashboardLayout>
    );
  }

  if (loadError || !interview || questions.length === 0) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-red-500">
          {loadError || "Failed to load interview. Please try again."}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
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

        {result && (
          <>
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
          </>
        )}

        <div className="flex justify-end gap-3">
          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={evaluating}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
            >
              {evaluating
                ? "Evaluating..."
                : awaitingAdvance
                ? "Next Question"
                : "Evaluate Answer"}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={evaluating}
              className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-50"
            >
              {evaluating
                ? "Submitting..."
                : awaitingAdvance
                ? "Finish & View Report"
                : "Evaluate Answer"}
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}