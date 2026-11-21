"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { fetchSavedJobs, toggleSavedJobRemote } from "@/services/savedJobsService";

interface SavedJobsContextValue {
  savedIds: Set<string>;
  loading: boolean;
  isSaved: (jobId: string) => boolean;
  /** Toggles a job. Guests are redirected to the login page. */
  toggle: (jobId: string) => Promise<void>;
}

const SavedJobsContext = createContext<SavedJobsContextValue | null>(null);

export function SavedJobsProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setSavedIds(new Set());
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchSavedJobs()
      .then((entries) => {
        if (cancelled) return;
        setSavedIds(new Set(entries.map((e) => e.job._id)));
      })
      .catch(() => {
        if (!cancelled) setSavedIds(new Set());
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const isSaved = useCallback(
    (jobId: string) => savedIds.has(jobId),
    [savedIds]
  );

  const toggle = useCallback(
    async (jobId: string) => {
      if (!user) {
        router.push("/login");
        return;
      }
      const wasSaved = savedIds.has(jobId);
      // Optimistic update
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.delete(jobId);
        else next.add(jobId);
        return next;
      });
      try {
        await toggleSavedJobRemote(jobId);
      } catch {
        // Roll back on failure
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.add(jobId);
          else next.delete(jobId);
          return next;
        });
      }
    },
    [user, savedIds, router]
  );

  return (
    <SavedJobsContext.Provider value={{ savedIds, loading, isSaved, toggle }}>
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error("useSavedJobs must be used within a SavedJobsProvider");
  }
  return context;
}
