export default function TrustedCompanies() {
  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Netflix",
    "OpenAI",
  ];

  return (
    <section className="border-y border-slate-800 bg-slate-950 py-16">
      <div className="mx-auto max-w-7xl px-6">

        <p className="mb-10 text-center text-sm uppercase tracking-[0.3em] text-slate-500">
          Trusted Skills For Careers At
        </p>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {companies.map((company) => (
            <div
              key={company}
              className="flex h-20 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 text-lg font-semibold text-slate-300 transition hover:border-blue-500 hover:text-white"
            >
              {company}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}