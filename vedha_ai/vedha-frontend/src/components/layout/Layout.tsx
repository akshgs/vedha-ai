import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustedCompanies from "@/components/landing/TrustedCompanies";

export default function Layout() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <Navbar />

      <Hero />

      <TrustedCompanies />
    </main>
  );
}