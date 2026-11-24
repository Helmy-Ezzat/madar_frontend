import { auth } from "@/lib/firebase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Backend SavedSearch: { query, specialization, country } — the "country" field
// carries the site location (city) value; the matcher compares it to job_info.location.
export interface SavedSearch {
  _id: string;
  country: string;
  specialization: string;
  query: string;
  createdAt: string;
}

async function getIdToken(): Promise<string> {
  const user = auth?.currentUser;
  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً");
  }
  return user.getIdToken();
}

export async function fetchSavedSearches(): Promise<SavedSearch[]> {
  const token = await getIdToken();
  const res = await fetch(`${API_BASE_URL}/saved-searches`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل تحميل البحوث المحفوظة");
  const json = await res.json();
  return json.data;
}

export class DuplicateSavedSearchError extends Error {}

export async function createSavedSearch(input: {
  query?: string;
  specialization?: string;
  country?: string;
}): Promise<SavedSearch> {
  const token = await getIdToken();
  const res = await fetch(`${API_BASE_URL}/saved-searches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: input.query ?? "",
      specialization: input.specialization ?? "",
      country: input.country ?? "",
    }),
  });
  if (res.status === 409) throw new DuplicateSavedSearchError("هذا البحث محفوظ بالفعل.");
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "فشل حفظ البحث");
  }
  const json = await res.json();
  return json.data;
}

export async function deleteSavedSearch(id: string): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(
    `${API_BASE_URL}/saved-searches/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("فشل حذف البحث المحفوظ");
}
