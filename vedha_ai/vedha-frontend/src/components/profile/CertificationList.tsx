import { useEffect, useState } from "react";

import type { Certification } from "@/services/certificationService";

import {
  getCertifications,
  deleteCertification,
} from "@/services/certificationService";

import CertificationCard from "./CertificationCard";
export default function CertificationList() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCertifications = async () => {
    try {
      const data = await getCertifications();
      setCertifications(data);
    } catch (error) {
      console.error("Failed to load certifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertifications();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this certification?")) {
      return;
    }

    try {
      await deleteCertification(id);

      setCertifications((prev) =>
        prev.filter((certification) => certification.id !== id)
      );
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  if (loading) {
    return (
      <p className="text-slate-400">
        Loading certifications...
      </p>
    );
  }

  if (certifications.length === 0) {
    return (
      <p className="text-slate-500">
        No certifications added yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {certifications.map((certification) => (
        <CertificationCard
          key={certification.id}
          certification={certification}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}