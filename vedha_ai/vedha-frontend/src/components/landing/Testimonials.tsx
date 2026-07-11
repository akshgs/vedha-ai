import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Arjun Nair",
    role: "Software Engineer",
    company: "Infosys",
    quote:
      "Vedha AI helped me improve my resume and prepare for interviews. I landed my first software job with much more confidence.",
  },
  {
    name: "Anjali Menon",
    role: "Data Science Student",
    company: "CUSAT",
    quote:
      "The personalized roadmap showed me exactly what to learn next. It saved me weeks of confusion.",
  },
  {
    name: "Rahul Kumar",
    role: "AI Engineer",
    company: "Startup",
    quote:
      "The AI mock interviews felt realistic, and the feedback helped me identify weak areas before my actual interviews.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-950 py-28">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            Testimonials
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Loved by Students & Professionals
          </h2>

          <p className="mt-6 text-lg text-slate-400">
            People use Vedha AI to improve resumes, prepare for interviews,
            and build focused learning plans.
          </p>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 transition hover:border-cyan-500"
            >
              <div className="mb-6 flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              <p className="leading-8 text-slate-300">
                "{item.quote}"
              </p>

              <div className="mt-8">
                <h4 className="font-bold text-white">
                  {item.name}
                </h4>

                <p className="text-slate-400">
                  {item.role} • {item.company}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}