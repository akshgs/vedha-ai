import { Menu } from "lucide-react";
import Button from "@/components/ui/button/Button";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-xl font-bold text-white shadow-lg shadow-blue-600/30">
            V
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              Vedha AI
            </h1>

            <p className="text-xs text-slate-400">
              Learn • Build • Get Hired
            </p>
          </div>

        </div>

        <nav className="hidden items-center gap-8 lg:flex">

          <a href="#" className="text-slate-300 hover:text-white">
            Features
          </a>

          <a href="#" className="text-slate-300 hover:text-white">
            Roadmaps
          </a>

          <a href="#" className="text-slate-300 hover:text-white">
            Resume AI
          </a>

          <a href="#" className="text-slate-300 hover:text-white">
            Interview
          </a>

          <a href="#" className="text-slate-300 hover:text-white">
            Jobs
          </a>

        </nav>

        <div className="hidden items-center gap-3 lg:flex">

          <Button variant="outline">
            Login
          </Button>

          <Button>
            Get Started
          </Button>

        </div>

        <button className="lg:hidden text-white">
          <Menu size={28} />
        </button>

      </div>
    </header>
  );
}