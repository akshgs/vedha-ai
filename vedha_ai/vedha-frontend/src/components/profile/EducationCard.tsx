import type { Education } from "../../services/educationService";

interface Props {
  education: Education;
  onEdit?: (education: Education) => void;
  onDelete?: (id: number) => void;
}

export default function EducationCard({
  education,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
      <div className="flex flex-col gap-5 md:flex-row md:justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">
            {education.degree}
          </h3>

          <p className="font-medium text-cyan-400">
            {education.institution}
          </p>

          <p className="text-sm text-slate-400">
            {education.field_of_study}
          </p>

          {(education.cgpa ?? education.percentage) && (
            <p className="mt-2 text-sm text-slate-300">
              {education.cgpa != null
                ? `CGPA: ${education.cgpa}`
                : `Percentage: ${education.percentage}%`}
            </p>
          )}

          <p className="mt-2 text-sm text-slate-400">
            {education.start_date} -{" "}
            {education.currently_studying
              ? "Present"
              : education.end_date}
          </p>

          {education.description && (
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">
              {education.description}
            </p>
          )}
        </div>

        {(onEdit || onDelete) && (
          <div className="flex shrink-0 gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(education)}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
              >
                Edit
              </button>
            )}

            {onDelete && education.id && (
              <button
                onClick={() => onDelete(education.id!)}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}