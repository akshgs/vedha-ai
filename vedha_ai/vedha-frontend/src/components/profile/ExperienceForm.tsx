import { useEffect, useState } from "react";
import type { Experience } from "../../services/experienceService";

interface ExperienceFormProps {
  initialData?: Experience | null;
  onSubmit: (data: Experience) => void;
  onCancel: () => void;
}

const emptyForm: Experience = {
  company: "",
  job_title: "",
  employment_type: "",
  location: "",
  start_date: "",
  end_date: "",
  currently_working: false,
  technologies: "",
  description: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none";

export default function ExperienceForm({
  initialData,
  onSubmit,
  onCancel,
}: ExperienceFormProps) {
  const [formData, setFormData] = useState<Experience>(emptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyForm);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="company"
        value={formData.company}
        onChange={handleChange}
        placeholder="Company"
        required
        className={inputClass}
      />

      <input
        name="job_title"
        value={formData.job_title}
        onChange={handleChange}
        placeholder="Job Title"
        required
        className={inputClass}
      />

      <select
        name="employment_type"
        value={formData.employment_type}
        onChange={handleChange}
        className={inputClass}
      >
        <option value="">Select Employment Type</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Internship">Internship</option>
        <option value="Contract">Contract</option>
        <option value="Freelance">Freelance</option>
      </select>

      <input
        name="location"
        value={formData.location ?? ""}
        onChange={handleChange}
        placeholder="Location"
        className={inputClass}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
          className={inputClass}
        />

        <input
          type="date"
          name="end_date"
          value={formData.end_date ?? ""}
          onChange={handleChange}
          disabled={formData.currently_working}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-slate-300">
        <input
          type="checkbox"
          name="currently_working"
          checked={formData.currently_working}
          onChange={handleChange}
        />
        Currently Working Here
      </label>

      <input
        name="technologies"
        value={formData.technologies ?? ""}
        onChange={handleChange}
        placeholder="Technologies (comma separated)"
        className={inputClass}
      />

      <textarea
        name="description"
        value={formData.description ?? ""}
        onChange={handleChange}
        rows={4}
        placeholder="Description"
        className={inputClass}
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
        >
          {initialData ? "Update Experience" : "Add Experience"}
        </button>
      </div>
    </form>
  );
}