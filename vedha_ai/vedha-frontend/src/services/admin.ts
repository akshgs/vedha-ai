import { api } from "./api";

/* ===========================
   Dashboard
=========================== */

export const getAdminDashboard = async () => {
  const { data } = await api.get("/admin/dashboard");
  return data;
};

/* ===========================
   Users
=========================== */

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export const getUsers = async (params: UserFilters = {}) => {
  const { data } = await api.get("/admin/users", {
    params,
  });

  return data;
};

export const updateUserStatus = async (
  userId: number,
  status: string
) => {
  const { data } = await api.patch(
    `/admin/users/${userId}/status`,
    {
      status,
    }
  );

  return data;
};

export const deleteUser = async (userId: number) => {
  const { data } = await api.delete(
    `/admin/users/${userId}`
  );

  return data;
};

/* ===========================
   Companies
=========================== */

export interface CompanyFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const getCompanies = async (
  params: CompanyFilters = {}
) => {
  const { data } = await api.get(
    "/admin/companies",
    {
      params,
    }
  );

  return data;
};

export const getPendingCompanies = async () => {
  const { data } = await api.get(
    "/admin/companies/pending"
  );

  return data;
};

export const approveCompany = async (
  companyId: number
) => {
  const { data } = await api.patch(
    `/admin/companies/${companyId}/approve`
  );

  return data;
};

export const rejectCompany = async (
  companyId: number,
  reason: string
) => {
  const { data } = await api.patch(
    `/admin/companies/${companyId}/reject`,
    {
      reason,
    }
  );

  return data;
};