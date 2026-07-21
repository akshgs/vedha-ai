import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ExternalLink, Phone } from "lucide-react";

import {
  getProfile,
  updateProfile,
  type Profile,
  type ProfileUpdate,
} from "@/services/profile";

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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h2>

      {children}
    </div>
  );
}

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
    <>
      <div className="min-h-screen bg-[#020617] py-10">
        <div className="mx-auto max-w-3xl space-y-6 px-4">

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
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedEducation(undefined);
                  setEducationOpen(true);
                }}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
              >
                + Add Education
              </button>
            </div>

            <EducationList
              key={educationRefreshKey}
            />
          </SectionCard>

          <SectionCard title="Experience">
            <ExperienceList />
          </SectionCard>

          <SectionCard title="Projects">
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedProject(undefined);
                  setProjectOpen(true);
                }}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
              >
                + Add Project
              </button>
            </div>

            <ProjectList key={projectRefreshKey} />
          </SectionCard>

          <SectionCard title="Certifications">
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedCertification(undefined);
                  setCertificationOpen(true);
                }}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
              >
                + Add Certification
              </button>
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
    </>
  );
}