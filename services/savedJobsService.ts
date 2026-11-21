import { auth } from "@/lib/firebase";
import { Job } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface SavedJobEntry {
  _id: string;
  job: Job;
  createdAt: string;
}

async function getIdToken(): Promise<string> {
  const user = auth?.currentUser;
  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً");
  }
  return user.getIdToken();
}

export async function fetchSavedJobs(): Promise<SavedJobEntry[]> {
  const token = await getIdToken();
  const res = await fetch(`${API_BASE_URL}/saved-jobs`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("فشل تحميل الوظائف المحفوظة");
  }
  const json = await res.json();
  return json.data;
}

/** Toggles the saved state server-side. Returns the new state. */
export async function toggleSavedJobRemote(
  jobId: string
): Promise<{ saved: boolean }> {
  const token = await getIdToken();
  const res = await fetch(
    `${API_BASE_URL}/saved-jobs/${encodeURIComponent(jobId)}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error("فشل تحديث الوظيفة المحفوظة");
  }
  const json = await res.json();
  return json.data;
}
