import { useEffect, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";
import SkillBadge from "@/components/roadmap/SkillBadge";

import {
  getRoadmap,
  type RoadmapResponse,
} from "@/services/roadmap";

export default function Roadmap() {
  const [roadmap, setRoadmap] =
    useState<RoadmapResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoadmap() {
      try {
        const data = await getRoadmap();
        setRoadmap(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load roadmap.");
      } finally {
        setLoading(false);
      }
    }

    loadRoadmap();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-900 p-8 text-center text-white">
          Loading Roadmap...
        </div>
      </DashboardLayout>
    );
  }

  if (error || !roadmap) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <h2 className="text-xl font-bold text-red-400">
            {error || "Failed to load roadmap."}
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  const progressColor =
    roadmap.completion >= 80
      ? "bg-emerald-500"
      : roadmap.completion >= 60
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8">

        <div>
          <h1 className="text-4xl font-bold text-white">
            AI Learning Roadmap
          </h1>

          <p className="mt-2 text-slate-400">
            Target Role :
            <span className="ml-2 font-semibold text-cyan-400">
              {roadmap.target_role}
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Overall Progress
            </h2>

            <span className="text-2xl font-bold text-cyan-400">
              {roadmap.completion}%
            </span>
          </div>

          <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{
                width: `${roadmap.completion}%`,
              }}
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-emerald-400">
              Completed Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {roadmap.completed_skills.length > 0 ? (
                roadmap.completed_skills.map((skill) => (
                  <SkillBadge
                    key={skill}
                    skill={skill}
                    completed
                  />
                ))
              ) : (
                <p className="text-slate-500">
                  No completed skills yet.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-red-400">
              Missing Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {roadmap.missing_skills.length > 0 ? (
                roadmap.missing_skills.map((skill) => (
                  <SkillBadge
                    key={skill}
                    skill={skill}
                  />
                ))
              ) : (
                <p className="text-slate-500">
                  No missing skills.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}