export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-center md:flex-row">

        <div>
          <h3 className="text-xl font-bold text-white">
            Vedha AI
          </h3>

          <p className="mt-2 text-slate-400">
            Learn • Build • Get Hired
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-slate-400">
          <a href="#">Features</a>
          <a href="#">Resume</a>
          <a href="#">Roadmaps</a>
          <a href="#">Interview</a>
          <a href="#">Jobs</a>
        </div>

        <p className="text-sm text-slate-500">
          © 2026 Vedha AI. All rights reserved.
        </p>

      </div>
    </footer>
  );
}