import { api } from "./api";

export interface Certification {
  id?: number;
  certificate_name: string;
  issuing_organization: string;
  credential_id?: string | null;
  issue_date: string;
  expiry_date?: string | null;
  does_not_expire: boolean;
  credential_url?: string | null;
  description?: string | null;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export const getCertifications = async () => {
  const response = await api.get<Certification[]>("/certification/");
  return response.data;
};

export const createCertification = async (
  data: Certification
) => {
  const response = await api.post<Certification>(
    "/certification/create",
    data
  );

  return response.data;
};

export const updateCertification = async (
  id: number,
  data: Partial<Certification>
) => {
  const response = await api.put<Certification>(
    `/certification/${id}`,
    data
  );

  return response.data;
};

export const deleteCertification = async (id: number) => {
  const response = await api.delete(
    `/certification/${id}`
  );

  return response.data;
};