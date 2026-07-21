import type { Project } from "../../services/projectService";

interface Props {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: number) => void;
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
      <div className="flex flex-col gap-5 md:flex-row md:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-white">
              {project.project_name}
            </h3>

            {project.featured && (
              <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400">
                Featured
              </span>
            )}
          </div>

          <p className="font-medium text-cyan-400">
            {project.role}
          </p>

          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies
              .split(",")
              .map((tech) => (
                <span
                  key={tech.trim()}
                  className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-200"
                >
                  {tech.trim()}
                </span>
              ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-400">
            <span>
              {project.start_date} -{" "}
              {project.currently_working
                ? "Present"
                : project.end_date}
            </span>

            {project.team_size != null && (
              <span>
                Team Size: {project.team_size}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300"
              >
                GitHub
              </a>
            )}

            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300"
              >
                Live Demo
              </a>
            )}
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex shrink-0 gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
              >
                Edit
              </button>
            )}

            {onDelete && project.id !== undefined && (
              <button
                onClick={() => onDelete(project.id!)}
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