import { useEffect, useState } from "react";

import { getEducations } from "../../services/educationService";
import type { Education } from "../../services/educationService";

import EducationCard from "./EducationCard";

export default function EducationList() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadEducations();
  }, []);

  const loadEducations = async () => {
    try {
      setLoading(true);
      const data = await getEducations();
      setEducations(data);
    } catch (error) {
      console.error("Failed to load educations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6 text-center text-slate-400">
        Loading education...
      </div>
    );
  }

  if (educations.length === 0) {
    return (
      <div className="rounded-lg border border-slate-700 p-6 text-center text-slate-400">
        No education records found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {educations.map((education) => (
        <EducationCard
          key={education.id}
          education={education}
        />
      ))}
    </div>
  );
}