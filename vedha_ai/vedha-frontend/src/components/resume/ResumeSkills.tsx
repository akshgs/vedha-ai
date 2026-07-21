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
      <div className="rounded-xl border border-green-700 bg-slate-900 p-6">
        <h2 className="mb-4 text-lg font-semibold text-green-400">
          ✅ Matched Skills
        </h2>

        <div className="flex flex-wrap gap-2">
          {matchedSkills.length > 0 ? (
            matchedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-green-600/20 px-3 py-1 text-sm text-green-300"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-slate-400">
              No matched skills found.
            </p>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="rounded-xl border border-red-700 bg-slate-900 p-6">
        <h2 className="mb-4 text-lg font-semibold text-red-400">
          ❌ Missing Skills
        </h2>

        <div className="flex flex-wrap gap-2">
          {missingSkills.length > 0 ? (
            missingSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-red-600/20 px-3 py-1 text-sm text-red-300"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-slate-400">
              No missing skills 🎉
            </p>
          )}
        </div>
      </div>
    </div>
  );
}