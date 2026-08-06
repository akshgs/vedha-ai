import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Award, ArrowLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import { getCourseDetails, type CourseDetailResponse } from "@/services/course";
import LessonCard from "@/components/ui/learning/LessonCard";
import QuizCard from "@/components/ui/learning/QuizCard";
import AssignmentCard from "@/components/ui/learning/AssignmentCard";
import ProgressTracker from "@/components/ui/learning/ProgressTracker";

function getCourseRoadmapTrail(courseId: number): string[] {
  const trails: Record<number, string[]> = {
    101: ["Frontend Engineer Roadmap", "HTML/CSS", "JavaScript", "Vite + React", "State Management", "Production Build"],
    102: ["System Architecture Roadmap", "Clean Architecture", "REST/gRPC APIs", "Microservices", "Message Queues", "Load Balancing"],
    103: ["Backend Engineer Roadmap", "Python Basics", "FastAPI", "SQL & Databases", "Docker Containers", "Cloud Deployment"],
    104: ["DevOps Engineering Roadmap", "Linux & Bash", "AWS Core Services", "CI/CD Pipelines", "Terraform IaC", "Monitoring & Alerts"],
  };
  return trails[courseId] || ["General Roadmap", "Core Concepts", "Advanced Lessons"];
}

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CourseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetails() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getCourseDetails(Number(id));
        setData(res);
      } catch {
        toast.error("Failed to query course details.");
      } finally {
        setLoading(false);
      }
    }
    void loadDetails();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Loading course specifications...
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center text-red-400">
          Course parameters not found.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Roadmap Breadcrumb Trail */}
        {data && (
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-slate-400 bg-slate-900/30 border border-slate-850 px-4 py-2.5 rounded-xl">
            <span className="text-slate-500 uppercase tracking-wider mr-2 text-[9px]">Roadmap Context:</span>
            {getCourseRoadmapTrail(data.course.id).map((step, idx, arr) => {
              const isCurrent = step.toLowerCase().includes("fastapi") && data.course.id === 103 || step.toLowerCase().includes("react") && data.course.id === 101 || step.toLowerCase().includes("microservices") && data.course.id === 102 || step.toLowerCase().includes("aws") && data.course.id === 104;
              return (
                <div key={step} className="flex items-center gap-1.5">
                  <span className={isCurrent ? "text-cyan-400 font-extrabold" : "text-slate-500"}>
                    {step}
                  </span>
                  {idx < arr.length - 1 && <span className="text-slate-700">➔</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* Back Button & Header */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/student/learning")}
            className="flex items-center gap-1 text-slate-500 hover:text-white transition text-xs font-semibold"
          >
            <ArrowLeft size={12} />
            Back to Catalog
          </button>
          <div>
            <span className="rounded bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-400">
              {data.course.category}
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2">{data.course.title}</h1>
            <p className="mt-2 text-slate-400 text-xs leading-relaxed max-w-2xl">{data.course.desc}</p>
            {data.course.skills && data.course.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold text-slate-500">Skills covered:</span>
                {data.course.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-medium text-cyan-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-5">
              <Button
                onClick={() => {
                  const nextLesson = data.lessons.find((l) => !l.completed) || data.lessons[0];
                  if (nextLesson) {
                    navigate(`/student/learning/course/${data.course.id}/lesson/${nextLesson.id}`);
                  }
                }}
                variant="primary"
                className="flex items-center gap-2 text-xs py-2.5 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/20"
              >
                Continue Learning
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main syllabus modules */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="glass" className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2.5">Syllabus Video Lessons</h3>
              <div className="space-y-3">
                {data.lessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    id={lesson.id}
                    title={lesson.title}
                    duration={lesson.duration}
                    completed={lesson.completed}
                    onSelect={() => navigate(`/student/learning/course/${data.course.id}/lesson/${lesson.id}`)}
                  />
                ))}
              </div>
            </Card>

            {/* Assignments checklists */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Practical Assignments & Projects</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {data.assignments.map((item) => (
                  <AssignmentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    desc={item.desc}
                    submitted={item.submitted}
                    onSuccess={() => {
                      toast.success(`Submitting code review metrics for '${item.title}'...`);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Quizzes modules */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Milestones Quiz</h3>
              {data.quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  id={quiz.id}
                  title={quiz.title}
                  question={quiz.question}
                  options={quiz.options}
                  answer={quiz.answer}
                  onSuccess={() => {
                    toast.success("Milestone score logged!");
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sidebar tracker progress */}
          <div className="space-y-6">
            <ProgressTracker
              completion={data.course.progress}
              totalLessons={data.lessons.length}
              completedLessons={data.lessons.filter((l) => l.completed).length}
            />

            {data.course.progress === 100 && (
              <Card variant="glass" className="p-6 border-amber-500/10 text-center space-y-3">
                <Award size={32} className="text-amber-400 mx-auto animate-bounce" />
                <div>
                  <h4 className="font-bold text-white text-xs">Course Track Completed!</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Claim your verified certificate credentials below</p>
                </div>
                <Button
                  onClick={() => toast.success("Certificate claimed successfully!")}
                  className="w-full text-xs py-2 bg-gradient-to-r from-amber-500 to-orange-500"
                >
                  Claim Certificate
                </Button>
              </Card>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
