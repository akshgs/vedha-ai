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

  useEffect(() => {
    async function loadRoadmap() {
      try {
        const data = await getRoadmap();
        setRoadmap(data);
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

  if (!roadmap) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-900 p-8 text-center text-red-400">
          Failed to load roadmap.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

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

        <div className="rounded-2xl bg-slate-900 p-6">
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
              className="h-full rounded-full bg-cyan-500"
              style={{
                width: `${roadmap.completion}%`,
              }}
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-2xl bg-slate-900 p-6">
            <h2 className="mb-6 text-2xl font-bold text-emerald-400">
              Completed Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {roadmap.completed_skills.map((skill) => (
                <SkillBadge
                  key={skill}
                  skill={skill}
                  completed
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <h2 className="mb-6 text-2xl font-bold text-red-400">
              Missing Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {roadmap.missing_skills.map((skill) => (
                <SkillBadge
                  key={skill}
                  skill={skill}
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}