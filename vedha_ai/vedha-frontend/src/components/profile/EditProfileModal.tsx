import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type { Profile, ProfileUpdate } from "@/services/profile";

type Props = {
  open: boolean;
  profile: Profile;
  onClose: () => void;
  onSave: (data: ProfileUpdate) => Promise<void>;
};

export default function EditProfileModal({
  open,
  profile,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(profile);
    setError("");
  }, [profile]);

  function updateField<K extends keyof Profile>(
    key: K,
    value: Profile[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      await onSave(form);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ??
          "Failed to save profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const inputClass =
    "rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Edit profile</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={form.target_role ?? ""}
            onChange={(e) => updateField("target_role", e.target.value)}
            placeholder="Target Role"
            className={inputClass}
          />

          <input
            value={form.college ?? ""}
            onChange={(e) => updateField("college", e.target.value)}
            placeholder="College"
            className={inputClass}
          />

          <input
            value={form.department ?? ""}
            onChange={(e) => updateField("department", e.target.value)}
            placeholder="Department"
            className={inputClass}
          />

          <input
            value={form.location ?? ""}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="Location"
            className={inputClass}
          />
        </div>

        <textarea
          rows={5}
          value={form.about ?? ""}
          onChange={(e) => updateField("about", e.target.value)}
          placeholder="About"
          className={`mt-4 w-full ${inputClass}`}
        />

        <input
          value={form.skills ?? ""}
          onChange={(e) => updateField("skills", e.target.value)}
          placeholder="Python, React, FastAPI..."
          className={`mt-4 w-full ${inputClass}`}
        />

        <input
          value={form.github_url ?? ""}
          onChange={(e) => updateField("github_url", e.target.value)}
          placeholder="GitHub URL"
          className={`mt-4 w-full ${inputClass}`}
        />

        <input
          value={form.linkedin_url ?? ""}
          onChange={(e) => updateField("linkedin_url", e.target.value)}
          placeholder="LinkedIn URL"
          className={`mt-4 w-full ${inputClass}`}
        />

        <input
          value={form.portfolio_url ?? ""}
          onChange={(e) => updateField("portfolio_url", e.target.value)}
          placeholder="Portfolio URL"
          className={`mt-4 w-full ${inputClass}`}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}