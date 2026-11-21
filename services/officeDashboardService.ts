"use client";

import { auth } from "@/lib/firebase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getIdToken(): Promise<string> {
  const user = auth?.currentUser;
  if (!user) throw new Error("سجّل دخولك الأول");
  return user.getIdToken();
}

async function authedFetch(path: string, options: RequestInit = {}) {
  const token = await getIdToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || "حدث خطأ، حاول تاني");
  }
  return json;
}

export interface OfficeJobPayload {
  title: string;
  location: string;
  salary?: string;
  experience?: string;
  summary: string;
}

// Office dashboard
export const createOfficeJob = (payload: OfficeJobPayload) =>
  authedFetch("/jobs/mine", { method: "POST", body: JSON.stringify(payload) });

export const getMyOfficeJobs = () => authedFetch("/jobs/mine");

export const deleteOfficeJob = (jobId: string) =>
  authedFetch(`/jobs/mine/${jobId}`, { method: "DELETE" });

export const getOfficeJobApplicants = (jobId: string) =>
  authedFetch(`/jobs/mine/${jobId}/applicants`);

// Seeker application
export const applyToJob = (jobId: string, payload: { name: string; phone: string; note?: string }) =>
  authedFetch(`/jobs/${jobId}/apply`, { method: "POST", body: JSON.stringify(payload) });

export const getAppliedState = (jobId: string) =>
  authedFetch(`/jobs/${jobId}/applied`);

// Admin
export interface AdminOffice {
  _id: string;
  email: string;
  displayName: string;
  officeName: string;
  licenseNumber: string;
  officeStatus: "pending" | "approved" | "rejected" | "suspended";
  createdAt: string;
}


export interface AdminCounts {
  pendingOffices: number;
  pendingJobs: number;
  newApplications: number;
}

export const adminGetCounts = (): Promise<{ data?: AdminCounts }> =>
  authedFetch("/admin/counts");

export const adminListOffices = (status: string = "pending") =>
  authedFetch(`/admin/offices?status=${status}`);

export const adminApproveOffice = (id: string) =>
  authedFetch(`/admin/offices/${id}/approve`, { method: "POST" });

export const adminRejectOffice = (id: string) =>
  authedFetch(`/admin/offices/${id}/reject`, { method: "POST" });

export interface AdminJob {
    _id: string;
    company_name: string;
    license_number?: string;
    approval_status: string;
    published_at?: string;
    job_info?: {
        job_titles?: string[];
        location?: string;
        salary?: string;
        experience?: string;
        summary?: string;
    };
}

export const adminListJobs = (status: string = "pending") =>
    authedFetch(`/admin/jobs?status=${encodeURIComponent(status)}`);

export const adminApproveJob = (id: string) =>
    authedFetch(`/admin/jobs/${id}/approve`, { method: "POST" });

export const adminRejectJob = (id: string) =>
    authedFetch(`/admin/jobs/${id}/reject`, { method: "POST" });

export const adminCreateJob = (payload: {
    title: string;
    location: string;
    salary?: string;
    experience?: string;
    summary: string;
}) =>
    authedFetch("/admin/jobs", { method: "POST", body: JSON.stringify(payload) });

// Convert the logged-in seeker account into a pending labor-recruitment office account
export const upgradeToOffice = (payload: { officeName: string; licenseNumber?: string }) =>
    authedFetch("/auth/sync", { method: "POST", body: JSON.stringify({ role: "office", ...payload }) });

export const adminSuspendOffice = (id: string) =>
  authedFetch(`/admin/offices/${id}/suspend`, { method: "POST" });

export const adminUnsuspendOffice = (id: string) =>
  authedFetch(`/admin/offices/${id}/unsuspend`, { method: "POST" });

export const adminSuspendJob = (id: string) =>
  authedFetch(`/admin/jobs/${id}/suspend`, { method: "POST" });

export const adminUnsuspendJob = (id: string) =>
  authedFetch(`/admin/jobs/${id}/unsuspend`, { method: "POST" });

export const adminDeleteJob = (id: string) =>
  authedFetch(`/admin/jobs/${id}`, { method: "DELETE" });

export const closeOfficeJob = (id: string, closed: boolean = true) =>
  authedFetch(`/jobs/mine/${id}/close`, { method: "PATCH", body: JSON.stringify({ closed }) });
