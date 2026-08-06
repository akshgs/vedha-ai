import RegisterForm from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <main className="min-h-screen flex bg-[#0B1220] font-sans">
      {/* Left Column — Value Prop (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] border-r border-[#1F2937] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Grid Line Background */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04, zIndex: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }} />

        <div className="relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3B82F6] text-lg font-bold text-white shadow-sm">
            V
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-md my-auto">
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
            Start your journey in the career ecosystem.
          </h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Create an account to gain access to learning, mentorship, real industry projects, and direct recruitment opportunities with leading corporate companies.
          </p>

          <div className="space-y-4 pt-4 text-xs font-semibold text-[#94A3B8]">
            <div className="flex items-center gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">✓</span>
              <span>Verify your core developer skills</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">✓</span>
              <span>Collaborate in learning groups</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">✓</span>
              <span>Direct application channels to partners</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-[#94A3B8] font-medium">
          © {new Date().getFullYear()} Vedha AI Ecosystem. All rights reserved.
        </div>
      </div>

      {/* Right Column — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-lg bg-[#111827] border border-[#1F2937] rounded-xl p-8 shadow-lg">
          <div className="mb-6 text-center lg:text-left">
            <div className="lg:hidden mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#3B82F6] text-lg font-bold text-white">
              V
            </div>

            <h1 className="text-2xl font-bold text-white">
              Create an account
            </h1>

            <p className="mt-1.5 text-xs text-[#94A3B8] font-medium">
              Join Vedha AI and start building your career today.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
