import type { Experience } from "../../services/experienceService";

interface ExperienceCardProps {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: number) => void;
}

export default function ExperienceCard({
  experience,
  onEdit,
  onDelete,
}: ExperienceCardProps) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {experience.job_title}
          </h3>

          <p className="text-cyan-400 font-medium">
            {experience.company}
          </p>

          <p className="text-sm text-slate-400">
            {experience.employment_type}
          </p>

          {experience.location && (
            <p className="text-sm text-slate-400">
              📍 {experience.location}
            </p>
          )}

          <p className="mt-2 text-sm text-slate-300">
            {experience.start_date}
            {" - "}
            {experience.currently_working
              ? "Present"
              : experience.end_date}
          </p>

          {experience.technologies && (
            <div className="mt-3">
              <span className="font-medium text-slate-200">
                Technologies:
              </span>

              <p className="text-sm text-slate-300">
                {experience.technologies}
              </p>
            </div>
          )}

          {experience.description && (
            <div className="mt-3">
              <span className="font-medium text-slate-200">
                Description:
              </span>

              <p className="text-sm text-slate-300 whitespace-pre-wrap">
                {experience.description}
              </p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => onEdit(experience)}
            className="rounded-md bg-cyan-600 px-3 py-1 text-sm text-white hover:bg-cyan-700"
          >
            Edit
          </button>

          <button
            onClick={() => {
              if (experience.id) {
                onDelete(experience.id);
              }
            }}
            className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}