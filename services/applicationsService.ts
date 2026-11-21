"use client";

import { auth } from "@/lib/firebase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface MyApplication {
  id: string;
  jobId: string;
  title: string;
  office: string;
  location: string;
  appliedAt: string;
  jobStatus: string;
}

export async function getMyApplications(): Promise<MyApplication[]> {
  const user = auth?.currentUser;
  if (!user) throw new Error("سجّل دخولك الأول");
  const token = await user.getIdToken();
  const res = await fetch(`${API_BASE_URL}/jobs/my-applications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "حدث خطأ، حاول تاني");
  return json.data ?? [];
}
