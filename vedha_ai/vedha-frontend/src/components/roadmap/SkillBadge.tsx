type Props = {
  skill: string;
  completed?: boolean;
};

export default function SkillBadge({
  skill,
  completed = false,
}: Props) {
  return (
    <span
      className={`rounded-full px-4 py-2 text-sm font-medium ${
        completed
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          : "bg-red-500/20 text-red-400 border border-red-500/30"
      }`}
    >
      {skill}
    </span>
  );
}