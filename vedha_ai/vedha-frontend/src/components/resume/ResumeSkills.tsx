interface ResumeSkillsProps {
  matchedSkills: string[];
  missingSkills: string[];
}

export default function ResumeSkills({
  matchedSkills,
  missingSkills,
}: ResumeSkillsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Matched Skills */}
      <div className="rounded-2xl border border-green-700 bg-slate-900 p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold text-green-400">
          ✅ Matched Skills
        </h2>

        {matchedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">
            No matched skills found.
          </p>
        )}
      </div>

      {/* Missing Skills */}
      <div className="rounded-2xl border border-red-700 bg-slate-900 p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold text-red-400">
          ❌ Missing Skills
        </h2>

        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {missingSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">
            No missing skills. Great job!
          </p>
        )}
      </div>
    </div>
  );
}