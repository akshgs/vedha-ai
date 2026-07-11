import {
  Briefcase,
  Building2,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/button/Button";

const jobs = [
  {
    company: "Google",
    role: "AI Engineer",
    location: "Bangalore",
    match: "98%",
  },
  {
    company: "Microsoft",
    role: "Machine Learning Engineer",
    location: "Hyderabad",
    match: "95%",
  },
  {
    company: "Amazon",
    role: "Backend AI Developer",
    location: "Chennai",
    match: "92%",
  },
];

export default function JobMatching() {
  return (
    <section className="bg-slate-950 py-28">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
            Smart Job Matching
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Find Jobs That Match Your Skills
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Vedha AI compares your resume, roadmap, and interview
            performance to recommend the most relevant jobs.
          </p>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          {jobs.map((job) => (
            <div
              key={job.company}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-orange-500"
            >
              <div className="flex items-center justify-between">

                <div className="rounded-2xl bg-orange-500/10 p-4 text-orange-400">
                  <Briefcase size={28} />
                </div>

                <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                  {job.match} Match
                </div>

              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                {job.role}
              </h3>

              <div className="mt-6 space-y-3">

                <div className="flex items-center gap-3 text-slate-400">
                  <Building2 size={18} />
                  {job.company}
                </div>

                <div className="flex items-center gap-3 text-slate-400">
                  <MapPin size={18} />
                  {job.location}
                </div>

              </div>

              <div className="mt-8">
                <Button className="w-full">
                  Apply with AI
                  <ArrowRight size={18} />
                </Button>
              </div>

            </div>
          ))}

        </div>

        <div className="mt-16 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center">

          <Sparkles className="mx-auto text-cyan-400" size={34} />

          <h3 className="mt-6 text-3xl font-bold text-white">
            AI Recommendation
          </h3>

          <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-400">
            Based on your current skills and resume score,
            Vedha AI recommends improving Docker and AWS
            before applying to Senior AI Engineer roles.
          </p>

        </div>

      </div>
    </section>
  );
}