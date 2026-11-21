"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useSavedJobs } from "@/contexts/SavedJobsContext";

interface SaveJobButtonProps {
  jobId: string;
  /** "icon" shows just the heart (job cards); "labeled" adds a text label (details modal). */
  variant?: "icon" | "labeled";
}

export default function SaveJobButton({ jobId, variant = "icon" }: SaveJobButtonProps) {
  const { isSaved, toggle } = useSavedJobs();
  const [pending, setPending] = useState(false);
  const saved = isSaved(jobId);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    setPending(true);
    try {
      await toggle(jobId);
    } finally {
      setPending(false);
    }
  }

  const label = saved ? "محفوظة" : "حفظ الوظيفة";

  if (variant === "labeled") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        aria-label={label}
        className={`pointer-events-auto inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg text-xs font-semibold transition-all shadow-sm border ${
          saved
            ? "bg-primary/10 text-primary border-primary/30"
            : "bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary"
        }`}
      >
        {pending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Heart className={`w-4 h-4 ${saved ? "fill-primary text-primary" : ""}`} />
        )}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className="pointer-events-auto inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 border border-slate-200 shadow-sm transition-all hover:border-primary/40"
    >
      {pending ? (
        <Loader2 className="w-4.5 h-4.5 animate-spin text-primary" />
      ) : (
        <Heart
          className={`w-4.5 h-4.5 transition-colors ${
            saved ? "fill-primary text-primary" : "text-slate-400"
          }`}
        />
      )}
    </button>
  );
}
