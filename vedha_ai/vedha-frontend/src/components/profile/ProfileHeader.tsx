import {
  MapPin,
  Pencil,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import type { ReactNode } from "react";

import type { Profile as ProfileType } from "@/services/profile";

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function MetaItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-slate-400">
      {icon}
      {label}
    </span>
  );
}

interface ProfileHeaderProps {
  profile: ProfileType;
  onEdit: () => void;
}

export default function ProfileHeader({
  profile,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] shadow-lg shadow-black/20">
      <div className="h-20 bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600" />

      <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-[#0f172a] bg-gradient-to-r from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg">
            {initials(profile.target_role || profile.college)}
          </div>

          <div className="pb-1">
            <h1 className="text-2xl font-bold text-white">
              {profile.target_role || "Vedha AI Member"}
            </h1>

            {(profile.department || profile.college) && (
              <p className="text-sm font-medium text-cyan-400">
                {[profile.department, profile.college]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {profile.location && (
                <MetaItem
                  icon={<MapPin className="h-3.5 w-3.5" />}
                  label={profile.location}
                />
              )}

              {profile.year && (
                <MetaItem
                  icon={<GraduationCap className="h-3.5 w-3.5" />}
                  label={`Year ${profile.year}`}
                />
              )}

              {profile.experience && (
                <MetaItem
                  icon={<Briefcase className="h-3.5 w-3.5" />}
                  label={profile.experience}
                />
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-2 self-start rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400 sm:self-auto"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit profile
        </button>
      </div>
    </div>
  );
}