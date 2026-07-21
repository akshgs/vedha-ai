import EducationForm from "./EducationForm";
import type { Education } from "../../services/educationService";

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  education?: Education;
}

const EducationModal = ({
  isOpen,
  onClose,
  onSuccess,
  education,
}: EducationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {education ? "Edit Education" : "Add Education"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-3 py-2 text-slate-300 hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        <EducationForm
          education={education}
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
        />
      </div>
    </div>
  );
};

export default EducationModal;