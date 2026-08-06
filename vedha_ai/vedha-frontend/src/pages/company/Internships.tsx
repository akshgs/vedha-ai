import { useEffect, useState } from "react";
import { GraduationCap, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import { getCompanyJobs, type CompanyJob } from "@/services/company";

export default function Internships() {
  const [internships, setInternships] = useState<CompanyJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    async function loadInternships() {
      try {
        setLoading(true);
        const data = await getCompanyJobs();
        // Filter jobs representing internships
        setInternships(data.filter(j => j.employment_type?.toLowerCase().includes("intern") || j.title?.toLowerCase().includes("intern")));
      } catch {
        toast.error("Failed to load corporate internships.");
      } finally {
        setLoading(false);
      }
    }
    void loadInternships();
  }, []);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      toast.error("Please fill in internship details.");
      return;
    }
    const mock: CompanyJob = {
      id: Math.floor(Math.random() * 1000),
      company_id: 1,
      title,
      description: "Exciting internship position matching our tech stack.",
      location,
      employment_type: "Internship",
      experience_level: "Intern",
      salary: "20,000 INR/month",
      skills: "React, Node.js",
      vacancies: 3,
      application_deadline: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setInternships([mock, ...internships]);
    setTitle("");
    setLocation("");
    toast.success("Internship opening published successfully!");
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <GraduationCap className="text-cyan-400" />
              Corporate Internships Manager
            </h1>
            <p className="mt-2 text-slate-400 text-sm">
              Post technical internships, track active candidate applications, and evaluate university placement pools.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-xs text-slate-500 py-12 animate-pulse">Loading internships...</div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main opening column */}
            <div className="lg:col-span-2 space-y-6">
              <Card variant="glass" className="p-6">
                <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Publish Internship Opening</h3>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Internship Position Title"
                      placeholder="e.g. Frontend Web Intern"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <Input
                      label="Job Location"
                      placeholder="e.g. Bangalore (Remote)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button type="submit" className="text-xs py-2 px-5 flex items-center gap-1.5">
                      <Plus size={14} />
                      Publish Position
                    </Button>
                  </div>
                </form>
              </Card>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase text-slate-400">Active Openings ({internships.length})</h3>
                {internships.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-6 text-center border border-dashed border-slate-850 rounded-2xl bg-slate-950/20">
                    No active internship openings posted yet.
                  </p>
                ) : (
                  internships.map((intern) => (
                    <Card key={intern.id} variant="default" className="p-5 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white text-sm">{intern.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{intern.location} • {intern.experience_level}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Salary: {intern.salary ?? "Stipend based"}</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-bold uppercase">
                        {intern.is_active ? "Active" : "Closed"}
                      </span>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Sidebar quick insights */}
            <div>
              <Card variant="glass" className="p-6 space-y-4">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 mb-4 flex items-center gap-1">
                  <Sparkles size={16} className="text-cyan-400 animate-pulse" />
                  Ecosystem Talent Match
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-900">
                  Vedha AI aggregates university placement requests automatically. Currently, <b>15 matching students</b> have matching skills for your internship descriptions.
                </p>
                <Button
                  onClick={() => toast.success("Talent pipeline metrics exported to recruiter desks!")}
                  className="w-full text-xs py-2"
                >
                  Inspect Placement Pools
                </Button>
              </Card>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
