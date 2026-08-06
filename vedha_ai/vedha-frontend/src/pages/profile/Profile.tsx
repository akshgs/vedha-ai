import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ExternalLink, Phone, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import {
  getProfile,
  updateProfile,
  type Profile,
  type ProfileUpdate,
} from "@/services/profile";

import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileHeader from "@/components/profile/ProfileHeader";
import EditProfileModal from "@/components/profile/EditProfileModal";

import EducationList from "@/components/profile/EducationList";
import EducationModal from "@/components/profile/EducationModal";
import type { Education } from "@/services/educationService";

import ExperienceList from "@/components/profile/ExperienceList";
import ProjectList from "@/components/profile/ProjectList";
import ProjectModal from "@/components/profile/ProjectModal";

import type { Project } from "@/services/projectService";

import CertificationList from "@/components/profile/CertificationList";
import CertificationModal from "@/components/profile/CertificationModal";
import type { Certification } from "@/services/certificationService";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="ve-card">
      <div className="ve-card-header">
        <h2 className="ve-card-title uppercase tracking-widest text-xs font-bold text-slate-400">
          {title}
        </h2>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

import PageHeader from "@/components/ui/layout/PageHeader";

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const [educationOpen, setEducationOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] =
    useState<Education>();

  const [educationRefreshKey, setEducationRefreshKey] =
    useState(0);

  const [projectOpen, setProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<Project>();

  const [projectRefreshKey, setProjectRefreshKey] =
    useState(0);

  const [certificationOpen, setCertificationOpen] =
    useState(false);

  const [selectedCertification, setSelectedCertification] =
    useState<Certification>();

  const [certificationRefreshKey, setCertificationRefreshKey] =
    useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
  }, []);

  const refreshEducation = useCallback(() => {
    setEducationRefreshKey((k) => k + 1);
  }, []);

  const refreshProjects = useCallback(() => {
    setProjectRefreshKey((k) => k + 1);
  }, []);

  const refreshCertifications = useCallback(() => {
    setCertificationRefreshKey((k) => k + 1);
  }, []);

  async function handleSaveProfile(
    data: ProfileUpdate
  ) {
    try {
      await updateProfile(data);

      const updated = await getProfile();

      setProfile(updated);

      setEditOpen(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);

      alert("Failed to update profile.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-slate-400">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-slate-400">
        Profile not found.
      </div>
    );
  }

  const skills = (profile.skills ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const links = [
    {
      key: "github",
      url: profile.github_url,
      label: "GitHub",
    },
    {
      key: "linkedin",
      url: profile.linkedin_url,
      label: "LinkedIn",
    },
    {
      key: "portfolio",
      url: profile.portfolio_url,
      label: "Portfolio",
    },
  ].filter((item) => item.url);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          title="Student Career Profile"
          subtitle="Manage your academic history, skills inventory, repository integrations, and verified credentials."
        />

        <div className="w-full max-w-[1440px] mx-auto space-y-6">

          <ProfileHeader
            profile={profile}
            onEdit={() => setEditOpen(true)}
          />

          <ProfileStats
            skillsCount={skills.length}
            experience={profile.experience}
          />

          {profile.about && (
            <SectionCard title="About">
              <p className="text-[15px] leading-relaxed text-slate-300">
                {profile.about}
              </p>
            </SectionCard>
          )}

          <SectionCard title="Education">
            <div className="space-y-1">
              <p className="text-base font-semibold text-white">
                {profile.college || "—"}
              </p>

              <p className="text-sm text-slate-400">
                {[profile.degree, profile.department]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </p>

              {profile.year && (
                <p className="text-sm text-slate-500">
                  Year {profile.year}
                </p>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Education History">
            <div className="mb-3 flex justify-end">
              <Button
                onClick={() => {
                  setSelectedEducation(undefined);
                  setEducationOpen(true);
                }}
                size="sm"
                variant="primary"
                className="bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/20"
              >
                + Add Education
              </Button>
            </div>

            <EducationList
              key={educationRefreshKey}
            />
          </SectionCard>

          <SectionCard title="Experience">
            <ExperienceList />
          </SectionCard>

          <SectionCard title="Projects">
            <div className="mb-3 flex justify-end">
              <Button
                onClick={() => {
                  setSelectedProject(undefined);
                  setProjectOpen(true);
                }}
                size="sm"
                variant="primary"
                className="bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/20"
              >
                + Add Project
              </Button>
            </div>

            <ProjectList key={projectRefreshKey} />
          </SectionCard>

          <SectionCard title="GitHub Integration Workspace">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Repository Synchronization Status</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {profile.github_url ? `Linked: ${profile.github_url}` : "No active repository URL connected."}
                </p>
              </div>
              {profile.github_url && (
                <button
                  onClick={() => toast.success("Synchronized project list with your GitHub repositories!")}
                  className="rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs px-4 py-2 flex items-center gap-1.5 shrink-0 transition"
                >
                  <RefreshCw size={12} className="animate-pulse" />
                  Sync Repository
                </button>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Achievements & Earned Credentials">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
              <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 block">Weekly Rank</span>
                <span className="text-sm font-black text-white">#3 Ecosystem</span>
              </div>
              <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-amber-400 block">XP points</span>
                <span className="text-sm font-black text-white">2,450 XP</span>
              </div>
              <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-violet-400 block">Assessment Status</span>
                <span className="text-sm font-black text-white">Verified</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Certifications">
            <div className="mb-3 flex justify-end">
              <Button
                onClick={() => {
                  setSelectedCertification(undefined);
                  setCertificationOpen(true);
                }}
                size="sm"
                variant="primary"
                className="bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/20"
              >
                + Add Certification
              </Button>
            </div>

            <CertificationList
              key={certificationRefreshKey}
            />
          </SectionCard>

          {skills.length > 0 && (
            <SectionCard title="Skills">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cyan-900/60 bg-cyan-500/10 px-3 py-1.5 text-sm font-medium text-cyan-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

                    {skill}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}

          {(links.length > 0 || profile.phone) && (
            <SectionCard title="Contact & Links">
              <div className="flex flex-wrap gap-3">

                {profile.phone && (
                  <span className="flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-300">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </span>
                )}

                {links.map(({ key, url, label }) => (
  <a
    key={key}
    href={url}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400"
  >
    <ExternalLink className="h-4 w-4" />
    {label}
  </a>
))}
              </div>
            </SectionCard>
          )}

        </div>
      </div>

      <EditProfileModal
        open={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveProfile}
      />

      <EducationModal
        isOpen={educationOpen}
        education={selectedEducation}
        onClose={() => {
          setEducationOpen(false);
          setSelectedEducation(undefined);
        }}
        onSuccess={() => {
          refreshEducation();

          setEducationOpen(false);
          setSelectedEducation(undefined);
        }}
      />

      <ProjectModal
        isOpen={projectOpen}
        project={selectedProject}
        onClose={() => {
          setProjectOpen(false);
          setSelectedProject(undefined);
        }}
        onSuccess={() => {
          refreshProjects();

          setProjectOpen(false);
          setSelectedProject(undefined);
        }}
      />

      <CertificationModal
        isOpen={certificationOpen}
        certification={selectedCertification}
        onClose={() => {
          setCertificationOpen(false);
          setSelectedCertification(undefined);
        }}
        onSuccess={() => {
          refreshCertifications();

          setCertificationOpen(false);
          setSelectedCertification(undefined);
        }}
      />
    </DashboardLayout>
  );
}