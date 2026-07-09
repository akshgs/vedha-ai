import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          Vedha AI
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-slate-600 hover:text-blue-600">
            Features
          </a>

          <a href="#about" className="text-slate-600 hover:text-blue-600">
            About
          </a>

          <a href="#contact" className="text-slate-600 hover:text-blue-600">
            Contact
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-100"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;