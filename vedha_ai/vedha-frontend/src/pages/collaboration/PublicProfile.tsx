import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Star } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import ProfileHeader from "@/components/ui/collaboration/ProfileHeader";
import ProfileTimeline from "@/components/ui/collaboration/ProfileTimeline";
import { getUserProfile, type UserProfile } from "@/services/networking";

export default function PublicProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getUserProfile(id);
        setProfile(res);
      } catch {
        toast.error("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    }
    void loadProfile();
  }, [id]);

  const mockTimeline = [
    { id: "1", activity: "Completed 'Python Backends with FastAPI & SQL' certificate", timestamp: "Yesterday" },
    { id: "2", activity: "Published a research update on low-latency Transformer inference caching", timestamp: "3 days ago" },
    { id: "3", activity: "Scheduled a technical mock interview review slot with mentor Pranav M.", timestamp: "1 week ago" },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-slate-905 border border-slate-800 p-8 text-center text-slate-500 animate-pulse">
          Querying profile registries...
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center text-red-400">
          User profile not found.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-500 hover:text-white transition text-xs font-semibold"
          >
            <ArrowLeft size={12} />
            Back to previous workspace
          </button>
        </div>

        {/* Profile Header Block */}
        <ProfileHeader
          userId={profile.id}
          name={profile.name}
          role={profile.role}
          bio={profile.bio}
          connections={profile.connectionsCount}
          followers={profile.followersCount}
          following={profile.followingCount}
          followed={profile.followed}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Experience & Skills Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Experience list */}
            <Card variant="glass" className="p-6 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">Professional Experience</h3>
              <div className="space-y-4">
                {profile.experiences.map((exp, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4 text-xs bg-slate-950/20 p-3 rounded-xl border border-slate-900">
                    <div>
                      <h4 className="font-bold text-white">{exp.title}</h4>
                      <p className="text-slate-400 mt-1">{exp.company}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{exp.duration}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Badges / Verified Awards */}
            <Card variant="glass" className="p-6 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">Credentials Badges</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {profile.badges.map((badge, idx) => (
                  <div key={idx} className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-4 flex items-center gap-3">
                    <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400 shrink-0">
                      <Award size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{badge}</h4>
                      <span className="text-[8px] text-slate-500 mt-0.5 block">Verified by Vedha Academics</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Timeline & Skills Column */}
          <div className="space-y-6">
            {/* Skills Radar / list */}
            <Card variant="glass" className="p-6 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">Endorsed Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-[9px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-bold"
                  >
                    <Star size={10} className="fill-current" />
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

            {/* Public Timeline */}
            <ProfileTimeline items={mockTimeline} />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
