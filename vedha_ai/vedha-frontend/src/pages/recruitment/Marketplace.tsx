import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Input from "@/components/ui/input/Input";
import JobCard from "@/components/ui/career/JobCard";
import FilterPanel from "@/components/ui/collaboration/FilterPanel";
import PageHeader from "@/components/ui/layout/PageHeader";
import { getRecommendedJobs, type Job } from "@/services/jobs";
import { submitResumeForJob } from "@/services/applications";

export default function Marketplace() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const res = await getRecommendedJobs();
        setJobs(res.recommended_jobs);
      } catch {
        toast.error("Failed to load recommended jobs list.");
      } finally {
        setLoading(false);
      }
    }
    void loadJobs();
  }, []);

  const jobTypes = ["ALL", "Full-time", "Internship", "Remote"];

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === "ALL" ||
      (selectedType === "Remote" && j.location.toLowerCase().includes("remote")) ||
      (selectedType === "Internship" && j.job_type.toLowerCase().includes("intern")) ||
      (selectedType === "Full-time" && !j.job_type.toLowerCase().includes("intern"));

    return matchesSearch && matchesType;
  });

  async function handleApplyJob(jobId: number) {
    try {
      await submitResumeForJob(jobId, "https://vedha.ai/resumes/my-resume.pdf");
      toast.success("Successfully applied for this position! Track status in Applications.");
    } catch {
      toast.error("Application submission failed.");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Loading job marketplace listings...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Master Page Header */}
        <PageHeader
          title="Vedha Recruitment Marketplace"
          subtitle="Access AI-curated job matches aligned directly to your upskilled roadmap achievements and assessment scores."
          icon={<Briefcase size={22} />}
        />

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search job title, company name, or technology keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <FilterPanel
            categories={jobTypes}
            selectedCategory={selectedType}
            onSelectCategory={setSelectedType}
            title="Filter by Role Type"
          />
        </div>

        {/* Jobs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              salary={job.salary}
              job_type={job.job_type}
              match_percent={job.match_percent}
              onApply={() => handleApplyJob(job.id)}
              onSave={() => toast.success("Job added to saved list.")}
            />
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
