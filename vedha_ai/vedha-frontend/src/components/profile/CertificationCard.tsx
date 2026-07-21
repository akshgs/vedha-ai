import {
  Award,
  Calendar,
  Building2,
  Link2,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Certification } from "@/services/certificationService";

interface CertificationCardProps {
  certification: Certification;
  onEdit?: (certification: Certification) => void;
  onDelete?: (id: number) => void;
}

export default function CertificationCard({
  certification,
  onEdit,
  onDelete,
}: CertificationCardProps) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Award className="h-5 w-5 text-cyan-400" />
            {certification.certificate_name}
          </h3>

          <p className="mt-1 flex items-center gap-2 text-slate-300">
            <Building2 className="h-4 w-4" />
            {certification.issuing_organization}
          </p>
        </div>

        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(certification)}
              className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}

          {onDelete && certification.id != null && (
            <button
              onClick={() => onDelete(certification.id!)}
              className="rounded-md p-2 text-red-400 hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {certification.description && (
        <p className="mt-4 text-sm text-slate-300">
          {certification.description}
        </p>
      )}

      <div className="mt-4 space-y-2 text-sm text-slate-400">
        {certification.credential_id && (
          <p>
            <strong>ID:</strong> {certification.credential_id}
          </p>
        )}

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            {certification.issue_date} —{" "}
            {certification.does_not_expire
              ? "Does Not Expire"
              : certification.expiry_date ?? "Present"}
          </span>
        </div>

        {certification.credential_url && (
          <a
            href={certification.credential_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-cyan-400 hover:underline"
          >
            <Link2 className="h-4 w-4" />
            View Credential
          </a>
        )}
      </div>
    </div>
  );
}