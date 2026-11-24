"use client";

import VerifiedTick from "@/components/VerifiedTick";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Wallet, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedJobs } from "@/contexts/SavedJobsContext";
import { fetchSavedJobs, type SavedJobEntry } from "@/services/savedJobsService";
import { fromNow } from "@/lib/date-utils";
import { JobCardTitle } from "@/app/jobs/_components/JobCardTitle";
import SaveJobButton from "@/components/SaveJobButton";
import SavedSearches from "./SavedSearches";

export default function SavedJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const { savedIds } = useSavedJobs();
  const router = useRouter();
  const [entries, setEntries] = useState<SavedJobEntry[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setEntries(null);
      return;
    }
    let cancelled = false;
    fetchSavedJobs()
      .then((data) => {
        if (!cancelled) setEntries(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  if (authLoading || (user && entries === null && !error)) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">الوظائف المحفوظة</h1>
        <p className="text-slate-500">جاري التحميل...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10 flex flex-col items-center text-center gap-4">
        <Heart className="w-12 h-12 text-slate-300" />
        <h1 className="text-2xl font-bold">الوظائف المحفوظة</h1>
        <p className="text-slate-500">
          سجل دخولك عشان تحفظ الوظائف اللي تعجبك وترجع لها في أي وقت.
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="inline-flex items-center gap-2 py-2.5 px-6 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
        >
          تسجيل الدخول
        </button>
      </main>
    );
  }

  // Unsaving updates savedIds optimistically, so the card disappears instantly.
  const visible = entries?.filter(({ job }) => savedIds.has(job._id));

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">الوظائف المحفوظة</h1>
      <SavedSearches />
      {error && (
        <p className="text-red-500">حصل خطأ أثناء تحميل الوظائف المحفوظة. جرب تاني.</p>
      )}
      {visible && visible.length === 0 && !error && (
        <div className="flex flex-col items-center text-center gap-3 py-10">
          <Heart className="w-12 h-12 text-slate-300" />
          <p className="text-slate-500">لسه مفيش وظائف محفوظة.</p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 py-2.5 px-6 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            تصفح الوظائف
          </Link>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {visible?.map(({ job }) => (
          <article
            key={job._id}
            className="relative px-5 py-4 flex flex-col gap-2.5 bg-white shadow-sm rounded-2xl transition-all duration-200 hover:shadow-md"
          >
            <div className="absolute top-4 end-4 z-10">
              <SaveJobButton jobId={job._id} />
            </div>
            <Link href={`/jobs/${job._id}`} className="flex flex-col gap-2.5">
              <div className="pe-12">
                <JobCardTitle
                  titles={
                    job.job_info.job_titles?.map((title: string | { text: string }) =>
                      typeof title === "object" ? title.text : title
                    ) ?? []
                  }
                />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-12 aspect-square shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                  <Building2 size={20} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-1">
                    <strong className="text-base font-bold truncate max-w-[240px] sm:max-w-none">
                      {job.company_name}
                    </strong>
                    {job.office_verified && <VerifiedTick className="w-4 h-4" />}
                  </div>
                  <span className="text-[#828A93] text-xs">
                    (ترخيص رقم {job.license_number})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Wallet className="w-4 h-4 text-slate-400" />
                <p className="text-sm text-slate-600 font-bold">الراتب: </p>
                <span className="text-[#828A93] text-xs">{job.job_info.salary}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <p className="text-sm text-slate-600 font-bold">الموقع: </p>
                <span className="text-[#828A93] text-xs">{job.job_info.location}</span>
              </div>
              <time
                dateTime={job.published_at}
                className="text-sm text-[#27AA40] font-bold"
              >
                {fromNow(job.published_at)}
              </time>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
