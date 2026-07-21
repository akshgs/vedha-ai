import CertificationForm from "./CertificationForm";
import type { Certification } from "@/services/certificationService";

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  certification?: Certification;
}

export default function CertificationModal({
  isOpen,
  onClose,
  onSuccess,
  certification,
}: CertificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            {certification
              ? "Edit Certification"
              : "Add Certification"}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl leading-none text-slate-400 transition hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <CertificationForm
            certification={certification}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>
  );
}