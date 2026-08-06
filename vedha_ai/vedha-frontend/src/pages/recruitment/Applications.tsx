import { useEffect, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import ApplicationCard from "@/components/ui/career/ApplicationCard";
import Timeline from "@/components/ui/career/Timeline";
import PageHeader from "@/components/ui/layout/PageHeader";
import { getSentApplications, type JobApplication } from "@/services/applications";

export default function Applications() {
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);
        const data = await getSentApplications();
        setApps(data);
        if (data.length > 0) {
          setSelectedApp(data[0]);
        }
      } catch {
        toast.error("Failed to retrieve application logs.");
      } finally {
        setLoading(false);
      }
    }
    void loadApplications();
  }, []);

  // Map steps to label checklist
  const mapStepsToTimeline = (step: number) => {
    const labels = [
      { label: "Resume Submitted", desc: "Successfully parsed resume document." },
      { label: "Resume Review", desc: "Acquiring screening scores checks." },
      { label: "Technical Interviewing", desc: "Interactive mock simulations coding review." },
      { label: "Salary Offer", desc: "Letter dispatched detailing earnings package." },
      { label: "Placement Hired", desc: "Verified credential logged." },
    ];

    return labels.map((l, idx) => ({
      label: l.label,
      desc: l.desc,
      completed: idx < step - 1,
      active: idx === step - 1,
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Connecting application pipelines...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Master Page Header */}
        <PageHeader
          title="Sent Applications Pipeline"
          subtitle="Monitor screening status, review scheduler requests, and track pending offer letters in real-time."
          icon={<ClipboardCheck size={22} />}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Applications list */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Sent Resumes List</h3>
            <div className="space-y-3">
              {apps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`cursor-pointer transition rounded-xl ${
                    selectedApp?.id === app.id ? "ring-1 ring-cyan-500" : ""
                  }`}
                >
                  <ApplicationCard
                    id={app.id}
                    jobTitle={app.jobTitle}
                    companyName={app.companyName}
                    location={app.location}
                    status={app.status}
                    appliedAt={app.appliedAt}
                    step={app.step}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Timeline tracker details sidebar */}
          <div className="space-y-6">
            {selectedApp ? (
              <Timeline
                steps={mapStepsToTimeline(selectedApp.step)}
                title={`Stages: ${selectedApp.jobTitle}`}
              />
            ) : (
              <Card variant="glass" className="p-8 text-center text-slate-500 italic text-xs leading-relaxed">
                Select an application to view its stages progression timeline.
              </Card>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
