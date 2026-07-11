import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustedCompanies from "@/components/landing/TrustedCompanies";
import Features from "@/components/landing/Features";
import AIJourney from "@/components/landing/AIJourney";
import ResumeDemo from "@/components/landing/ResumeDemo";
import RoadmapDemo from "@/components/landing/RoadmapDemo";
import InterviewDemo from "@/components/landing/InterviewDemo";
import JobMatching from "@/components/landing/JobMatching";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Layout() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <Navbar />

      <Hero />

      <TrustedCompanies />

      <Features />

      <AIJourney />

      <ResumeDemo />

      <RoadmapDemo />

      <InterviewDemo />

      <JobMatching />

      <Testimonials />

      <CTA />

      <Footer />
    </main>
  );
}