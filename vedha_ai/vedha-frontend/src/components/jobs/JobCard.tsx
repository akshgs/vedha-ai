import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  ExternalLink,
} from "lucide-react";

import type { Job } from "@/services/jobs";

type Props = {
  job: Job;
};

export default function JobCard({ job }: Props) {
  const matchColor =
    job.match_percent >= 80
      ? "bg-green-500/20 text-green-400"
      : job.match_percent >= 60
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-red-500/20 text-red-400";

  const skills = job.skills ?? [];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:border-cyan-500 hover:shadow-cyan-500/20">
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">
            {job.title}
          </h2>

          <div className="mt-4 space-y-3 text-slate-400">
            <div className="flex items-center gap-2">
              <Building2 size={18} />
              <span>{job.company}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase size={18} />
              <span>{job.job_type}</span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign size={18} />
              <span>{job.salary || "Not Disclosed"}</span>
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div className="mt-6">
              <p className="line-clamp-3 text-slate-300">
                {job.description}
              </p>
            </div>
          )}

          {/* Skills */}
          <div className="mt-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-400">
              Required Skills
            </h3>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Skills not available.
              </p>
            )}
          </div>

          {/* AI Match */}
          <div className="mt-6 rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">
              AI Match Score
            </p>

            <p className="mt-2 text-3xl font-bold text-cyan-400">
              {job.match_percent ?? 0}%
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <span
            className={`rounded-lg px-4 py-2 font-bold ${matchColor}`}
          >
            {job.match_percent ?? 0}% Match
          </span>

          <span className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300">
            {job.source || "Unknown"}
          </span>

          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-500"
          >
            Apply Now
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}