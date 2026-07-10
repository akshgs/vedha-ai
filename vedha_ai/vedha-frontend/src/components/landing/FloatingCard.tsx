import { ArrowRight, PlayCircle } from "lucide-react";
import Button from "@/components/ui/button/Button";
import DashboardPreview from "./DashboardPreview";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900" />

      {/* Glow Effects */}
      <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-3xl" />

      <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-8 pt-28 lg:grid-cols-2 lg:px-10">

        {/* Left Content */}
        <div className="text-center lg:text-left">

          <span className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-medium text-cyan-300">
            🚀 AI Powered Career Platform
          </span>

          <h1 className="mt-8 max-w-2xl text-5xl font-black leading-tight text-white md:text-7xl">
            Learn Faster.
            <br />
            Build Better.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Get Hired Smarter.
            </span>
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-8 text-slate-400">
            One intelligent AI platform for Resume Analysis,
            Personalized Learning Roadmaps, AI Mock Interviews,
            Smart Job Matching and Career Growth.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5 lg:justify-start">

            <Button>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="px-8"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>

          </div>

        </div>

        {/* Right Dashboard */}
        <div className="hidden items-center justify-center lg:flex">
          <DashboardPreview />
        </div>

      </div>

    </section>
  );
}