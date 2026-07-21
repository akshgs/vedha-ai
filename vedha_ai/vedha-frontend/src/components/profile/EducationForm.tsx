import { useState } from "react";
import {
  createEducation,
  updateEducation,
  type Education,
} from "../../services/educationService";

interface EducationFormProps {
  education?: Education;
  onSuccess: () => void;
}

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none";

const EducationForm = ({
  education,
  onSuccess,
}: EducationFormProps) => {
  const [formData, setFormData] = useState<Education>({
    institution: education?.institution || "",
    degree: education?.degree || "",
    field_of_study: education?.field_of_study || "",
    cgpa: education?.cgpa ?? null,
    percentage: education?.percentage ?? null,
    start_date: education?.start_date || "",
    end_date: education?.end_date || "",
    currently_studying:
      education?.currently_studying || false,
    description: education?.description || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      currently_studying: e.target.checked,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (education?.id) {
        await updateEducation(
          education.id,
          formData
        );
      } else {
        await createEducation(formData);
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to save education");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        name="institution"
        placeholder="Institution"
        value={formData.institution}
        onChange={handleChange}
        className={inputClass}
      />

      <input
        name="degree"
        placeholder="Degree"
        value={formData.degree}
        onChange={handleChange}
        className={inputClass}
      />

      <input
        name="field_of_study"
        placeholder="Field of Study"
        value={formData.field_of_study}
        onChange={handleChange}
        className={inputClass}
      />

      <input
        type="number"
        name="cgpa"
        placeholder="CGPA"
        value={formData.cgpa ?? ""}
        onChange={handleChange}
        className={inputClass}
      />

      <input
        name="start_date"
        placeholder="Start Year"
        value={formData.start_date}
        onChange={handleChange}
        className={inputClass}
      />

      <input
        name="end_date"
        placeholder="End Year"
        value={formData.end_date ?? ""}
        onChange={handleChange}
        className={inputClass}
      />

      <label className="flex items-center gap-2 text-slate-300">
        <input
          type="checkbox"
          checked={formData.currently_studying}
          onChange={handleCheckbox}
          className="h-4 w-4"
        />
        Currently Studying
      </label>

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className={`${inputClass} min-h-28`}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60"
      >
        {loading
          ? "Saving..."
          : education
          ? "Update Education"
          : "Add Education"}
      </button>

    </form>
  );
};

export default EducationForm;