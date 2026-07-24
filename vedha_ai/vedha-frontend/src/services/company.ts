import { api } from "./api";

/* ============================================================================
   Company Profile Services
   ============================================================================ */

export interface CompanyProfile {
  id: number;
  user_id: number;
  company_name: string;
  industry: string;
  website: string | null;
  location: string;
  description: string;
  logo_url: string | null;
  company_size: string;
  founded_year: number | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyProfileCreate {
  company_name: string;
  industry?: string;
  website?: string | null;
  location?: string;
  description?: string;
  logo_url?: string | null;
  company_size?: string;
  founded_year?: number | null;
}

export interface CompanyProfileUpdate {
  company_name?: string;
  industry?: string;
  website?: string | null;
  location?: string;
  description?: string;
  logo_url?: string | null;
  company_size?: string;
  founded_year?: number | null;
}

export async function getCompanyProfile(): Promise<CompanyProfile> {
  const { data } = await api.get("/company/profile");
  return data;
}

export async function createCompanyProfile(
  profile: CompanyProfileCreate
): Promise<CompanyProfile> {
  const { data } = await api.post("/company/profile", profile);
  return data;
}

export async function updateCompanyProfile(
  profile: CompanyProfileUpdate
): Promise<CompanyProfile> {
  const { data } = await api.put("/company/profile", profile);
  return data;
}

export async function deleteCompanyProfile(): Promise<{ message: string }> {
  const { data } = await api.delete("/company/profile");
  return data;
}

/* ============================================================================
   Company Job Management Services (CRUD)
   ============================================================================ */

export interface CompanyJob {
  id: number;
  company_id: number;
  title: string;
  description: string;
  location: string;
  employment_type: string;
  experience_level: string;
  salary: string | null;
  skills: string | null;
  vacancies: number;
  application_deadline: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyJobCreate {
  title: string;
  description: string;
  location: string;
  employment_type: string;
  experience_level: string;
  salary?: string | null;
  skills?: string | null;
  vacancies?: number;
  application_deadline?: string | null;
  is_active?: boolean;
}

export interface CompanyJobUpdate {
  title?: string;
  description?: string;
  location?: string;
  employment_type?: string;
  experience_level?: string;
  salary?: string | null;
  skills?: string | null;
  vacancies?: number;
  application_deadline?: string | null;
  is_active?: boolean;
}

export async function getCompanyJobs(): Promise<CompanyJob[]> {
  const { data } = await api.get("/company/jobs");
  return data;
}

export async function getCompanyJob(jobId: number): Promise<CompanyJob> {
  const { data } = await api.get(`/company/jobs/${jobId}`);
  return data;
}

export async function createCompanyJob(job: CompanyJobCreate): Promise<CompanyJob> {
  const { data } = await api.post("/company/jobs", job);
  return data;
}

export async function updateCompanyJob(
  jobId: number,
  job: CompanyJobUpdate
): Promise<CompanyJob> {
  const { data } = await api.put(`/company/jobs/${jobId}`, job);
  return data;
}

export async function deleteCompanyJob(jobId: number): Promise<{ message: string }> {
  const { data } = await api.delete(`/company/jobs/${jobId}`);
  return data;
}

/* ============================================================================
   Job Application Services
   ============================================================================ */

export interface ApplicationResponse {
  id: number;
  student_id: number;
  company_job_id: number;
  status: string;
  created_at: string;
}

export async function getJobApplications(jobId: number): Promise<ApplicationResponse[]> {
  const { data } = await api.get(`/applications/company/jobs/${jobId}`);
  return data;
}

export async function updateApplicationStatus(
  applicationId: number,
  status: string
): Promise<ApplicationResponse> {
  const { data } = await api.put(`/applications/${applicationId}/status`, {
    status,
  });
  return data;
}
