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
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:border-cyan-500 hover:shadow-cyan-500/20">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">
            {job.title}
          </h2>

          <div className="mt-4 space-y-2 text-slate-400">
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

          <div className="mt-6 rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">
              AI Match Score
            </p>

            <p className="mt-2 text-xl font-bold text-cyan-400">
              {job.match_percent}%
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <span className="rounded-lg bg-cyan-500/20 px-4 py-2 font-bold text-cyan-400">
            {job.match_percent}% Match
          </span>

          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-500"
          >
            Apply Now
            <ExternalLink size={18} />
          </a>

          <span className="mt-4 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300">
            {job.source}
          </span>
        </div>
      </div>
    </div>
  );
}