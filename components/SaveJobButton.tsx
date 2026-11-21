"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useSavedJobs } from "@/contexts/SavedJobsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";

interface SaveJobButtonProps {
  jobId: string;
  /** "icon" shows just the heart (job cards); "labeled" adds a text label (details modal). */
  variant?: "icon" | "labeled";
}

export default function SaveJobButton({ jobId, variant = "icon" }: SaveJobButtonProps) {
  const { isSaved, toggle } = useSavedJobs();
  const { user } = useAuth();
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const [popping, setPopping] = useState(false);
  const saved = isSaved(jobId);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    if (!user) {
      // Guests are sent to login by the context.
      await toggle(jobId);
      return;
    }
    const wasSaved = saved;
    setPending(true);
    try {
      await toggle(jobId);
      if (wasSaved) {
        toast("تمت الإزالة من المحفوظة");
      } else {
        toast("تم حفظ الوظيفة");
        setPopping(true);
        setTimeout(() => setPopping(false), 400);
      }
    } finally {
      setPending(false);
    }
  }

  const label = saved ? "محفوظة" : "حفظ الوظيفة";
  const heartClass = `${saved ? "fill-red-500 text-red-500 scale-110" : "text-slate-400"}${popping ? " heart-pop" : ""}`;

  if (variant === "labeled") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        aria-label={label}
        className={`pointer-events-auto inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg text-xs font-semibold transition-all shadow-sm border ${
          saved
            ? "bg-red-50 text-red-600 border-red-200"
            : "bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-500"
        }`}
      >
        {pending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Heart className={`w-4 h-4 ${heartClass}`} />
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
      className="pointer-events-auto inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 border border-slate-200 shadow-sm transition-all hover:border-red-200"
    >
      {pending ? (
        <Loader2 className="w-4.5 h-4.5 animate-spin text-red-500" />
      ) : (
        <Heart className={`w-4.5 h-4.5 transition-all ${heartClass}`} />
      )}
    </button>
  );
}
