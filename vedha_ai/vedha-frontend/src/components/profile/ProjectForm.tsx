import { useState } from "react";
import {
  createProject,
  updateProject,
  type Project,
} from "../../services/projectService";

interface ProjectFormProps {
  project?: Project;
  onSuccess: () => void;
}

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none";

const ProjectForm = ({
  project,
  onSuccess,
}: ProjectFormProps) => {
  const [formData, setFormData] = useState<Project>({
    project_name: project?.project_name || "",
    role: project?.role || "",
    description: project?.description || "",
    technologies: project?.technologies || "",
    github_url: project?.github_url || "",
    live_url: project?.live_url || "",
    start_date: project?.start_date || "",
    end_date: project?.end_date || "",
    currently_working:
      project?.currently_working || false,
    team_size: project?.team_size ?? null,
    featured: project?.featured || false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement
  >
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]:
      name === "team_size"
        ? value === ""
          ? null
          : Number(value)
        : value,
  }));
};

  const handleCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        project_name: formData.project_name.trim(),
        role: formData.role.trim(),
        description: formData.description.trim(),
        technologies: formData.technologies.trim(),

        github_url: formData.github_url?.trim()
          ? formData.github_url.trim()
          : null,

        live_url: formData.live_url?.trim()
          ? formData.live_url.trim()
          : null,

        start_date: formData.start_date,

        end_date: formData.currently_working
          ? null
          : formData.end_date?.trim()
          ? formData.end_date
          : null,

        currently_working: formData.currently_working,

        team_size:
          formData.team_size == null
            ? null
            : Number(formData.team_size),

        featured: formData.featured,
      };

      console.log("Project Payload:", payload);

      if (project?.id) {
        await updateProject(project.id, payload);
      } else {
        await createProject(payload);
      }

      onSuccess();
    } catch (err: any) {
      console.error("Project Error:", err);

      if (err.response?.data) {
        console.log(err.response.data);
        alert(JSON.stringify(err.response.data, null, 2));
      } else {
        alert("Failed to save project");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        name="project_name"
        placeholder="Project Name"
        value={formData.project_name}
        onChange={handleChange}
        className={inputClass}
      />

      <input
        name="role"
        placeholder="Your Role"
        value={formData.role}
        onChange={handleChange}
        className={inputClass}
      />

      <textarea
        name="description"
        placeholder="Project Description"
        value={formData.description}
        onChange={handleChange}
        className={`${inputClass} min-h-28`}
      />

      <input
        name="technologies"
        placeholder="Technologies (comma separated)"
        value={formData.technologies}
        onChange={handleChange}
        className={inputClass}
      />

      <input
        type="url"
        name="github_url"
        placeholder="GitHub URL"
        value={formData.github_url ?? ""}
        onChange={handleChange}
        className={inputClass}
      />

      <input
        type="url"
        name="live_url"
        placeholder="Live Demo URL"
        value={formData.live_url ?? ""}
        onChange={handleChange}
        className={inputClass}
      />

      <input
        type="date"
        name="start_date"
        value={formData.start_date}
        onChange={handleChange}
        className={inputClass}
      />

      <input
        type="date"
        name="end_date"
        value={formData.end_date ?? ""}
        disabled={formData.currently_working}
        onChange={handleChange}
        className={inputClass}
      />

      <input
        type="number"
        name="team_size"
        placeholder="Team Size"
        value={formData.team_size ?? ""}
        onChange={handleChange}
        className={inputClass}
      />

      <label className="flex items-center gap-2 text-slate-300">
        <input
          type="checkbox"
          name="currently_working"
          checked={formData.currently_working}
          onChange={handleCheckbox}
          className="h-4 w-4"
        />
        Currently Working
      </label>

      <label className="flex items-center gap-2 text-slate-300">
        <input
          type="checkbox"
          name="featured"
          checked={formData.featured}
          onChange={handleCheckbox}
          className="h-4 w-4"
        />
        Featured Project
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60"
      >
        {loading
          ? "Saving..."
          : project
          ? "Update Project"
          : "Add Project"}
      </button>
    </form>
  );
};

export default ProjectForm;