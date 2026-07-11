import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/button/Button";

export default function CTA() {
  return (
    <section className="bg-slate-950 py-28">
      <div className="mx-auto max-w-5xl px-6">

        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-violet-600/20 p-12 text-center">

          <h2 className="text-4xl font-black text-white md:text-5xl">
            Start Your AI Career Journey Today
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Analyze your resume, build a personalized roadmap,
            practice interviews, and discover your next opportunity
            with Vedha AI.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">

            <Button>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button variant="outline">
              Watch Demo
            </Button>

          </div>

        </div>

      </div>
    </section>
  );
}