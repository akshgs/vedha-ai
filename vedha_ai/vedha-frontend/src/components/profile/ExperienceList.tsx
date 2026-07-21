import { useEffect, useState } from "react";

import ExperienceCard from "./ExperienceCard";
import ExperienceModal from "./ExperienceModal";

import {
  createExperience,
  deleteExperience,
  getExperiences,
  updateExperience,
  type Experience,
} from "../../services/experienceService";

export default function ExperienceList() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Experience | null>(null);

  const loadExperiences = async () => {
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (error) {
      console.error("Failed to load experiences", error);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleAdd = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    setSelected(experience);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Delete this experience?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteExperience(id);
      await loadExperiences();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (
    data: Experience
  ) => {
    try {
      if (selected?.id) {
        await updateExperience(
          selected.id,
          data
        );
      } else {
        await createExperience(data);
      }

      await loadExperiences();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleAdd}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
        >
          + Add Experience
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-700 p-8 text-center text-slate-500">
          No experience added yet.
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ExperienceModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initialData={selected}
      />
    </div>
  );
}