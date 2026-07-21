import { useState } from "react";
import ExperienceForm from "./ExperienceForm";
import type { Experience } from "../../services/experienceService";

interface ExperienceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Experience) => Promise<void> | void;
  initialData?: Experience | null;
}

export default function ExperienceModal({
  open,
  onClose,
  onSave,
  initialData,
}: ExperienceModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (
    data: Experience
  ) => {
    try {
      setLoading(true);
      await onSave(data);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-700 p-5">
          <h2 className="text-xl font-semibold">
            {initialData
              ? "Edit Experience"
              : "Add Experience"}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl leading-none text-slate-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="p-5">
          <ExperienceForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />

          {loading && (
            <p className="mt-4 text-sm text-slate-400">
              Saving...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}