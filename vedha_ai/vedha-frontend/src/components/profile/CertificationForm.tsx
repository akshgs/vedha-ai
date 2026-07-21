import { useEffect, useState } from "react";

import type { Certification } from "@/services/certificationService";

import {
  createCertification,
  updateCertification,
} from "@/services/certificationService";

interface CertificationFormProps {
  certification?: Certification;
  onSuccess: () => void;
}

const initialState: Certification = {
  certificate_name: "",
  issuing_organization: "",
  credential_id: "",
  issue_date: "",
  expiry_date: "",
  does_not_expire: false,
  credential_url: "",
  description: "",
};

export default function CertificationForm({
  certification,
  onSuccess,
}: CertificationFormProps) {
  const [form, setForm] = useState<Certification>(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (certification) {
      setForm({
        ...initialState,
        ...certification,
      });
    }
  }, [certification]);

  const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement
  >
) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: Certification = {
        certificate_name: form.certificate_name.trim(),
        issuing_organization:
          form.issuing_organization.trim(),

        credential_id:
          form.credential_id?.trim()
            ? form.credential_id.trim()
            : null,

        issue_date: form.issue_date,

        expiry_date: form.does_not_expire
          ? null
          : form.expiry_date?.trim()
          ? form.expiry_date
          : null,

        does_not_expire: form.does_not_expire,

        credential_url:
          form.credential_url?.trim()
            ? form.credential_url.trim()
            : null,

        description:
          form.description?.trim()
            ? form.description.trim()
            : null,
      };

      console.log("Certification Payload:", payload);

      if (certification?.id) {
        await updateCertification(
          certification.id,
          payload
        );
      } else {
        await createCertification(payload);
      }

      onSuccess();
    } catch (err: any) {
      console.log("========== ERROR ==========");
      console.log(err.response?.status);
      console.log(err.response?.data);
      alert(JSON.stringify(err.response?.data, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        name="certificate_name"
        placeholder="Certificate Name"
        value={form.certificate_name}
        onChange={handleChange}
        className="w-full rounded-lg border p-3"
        required
      />

      <input
        name="issuing_organization"
        placeholder="Issuing Organization"
        value={form.issuing_organization}
        onChange={handleChange}
        className="w-full rounded-lg border p-3"
        required
      />

      <input
        name="credential_id"
        placeholder="Credential ID"
        value={form.credential_id ?? ""}
        onChange={handleChange}
        className="w-full rounded-lg border p-3"
      />

      <input
        type="date"
        name="issue_date"
        value={form.issue_date}
        onChange={handleChange}
        className="w-full rounded-lg border p-3"
        required
      />

      {!form.does_not_expire && (
        <input
          type="date"
          name="expiry_date"
          value={form.expiry_date ?? ""}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />
      )}

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="does_not_expire"
          checked={form.does_not_expire}
          onChange={handleChange}
        />
        Does Not Expire
      </label>

      <input
        type="url"
        name="credential_url"
        placeholder="Credential URL"
        value={form.credential_url ?? ""}
        onChange={handleChange}
        className="w-full rounded-lg border p-3"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description ?? ""}
        onChange={handleChange}
        className="w-full rounded-lg border p-3"
        rows={4}
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-cyan-600 px-5 py-3 text-white hover:bg-cyan-700 disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : certification
          ? "Update Certification"
          : "Add Certification"}
      </button>
    </form>
  );
}