import { useEffect, useState } from "react";

import type { Skill } from "@/services/skillService";

import {
  getSkills,
  deleteSkill,
} from "@/services/skillService";

import SkillCard from "./SkillCard";

interface SkillListProps {
  onEdit?: (skill: Skill) => void;
}

export default function SkillList({
  onEdit,
}: SkillListProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSkills = async () => {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (error) {
      console.error("Failed to load skills", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this skill?")) {
      return;
    }

    try {
      await deleteSkill(id);

      setSkills((prev) =>
        prev.filter((skill) => skill.id !== id)
      );
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  if (loading) {
    return (
      <p className="text-slate-400">
        Loading skills...
      </p>
    );
  }

  if (skills.length === 0) {
    return (
      <p className="text-slate-500">
        No skills added yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}