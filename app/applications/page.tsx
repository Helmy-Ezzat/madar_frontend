"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, MapPin, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getMyApplications, type MyApplication } from "@/services/applicationsService";
import { fromNow } from "@/lib/date-utils";
import ApplicationsSkeleton from "./_components/ApplicationsSkeleton";

function statusChip(status: string) {
  if (status === "approved")
    return { label: "متاحة", cls: "bg-green-50 text-green-700 border-green-200" };
  if (status === "rejected" || status === "deleted" || status === "closed")
    return { label: "اتقفلت", cls: "bg-slate-100 text-slate-500 border-slate-200" };
  return { label: "تحت المراجعة", cls: "bg-amber-50 text-amber-700 border-amber-200" };
}

export default function MyApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [apps, setApps] = useState<MyApplication[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setApps(null);
      return;
    }
    let cancelled = false;
    getMyApplications()
      .then((data) => { if (!cancelled) setApps(data); })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : "حدث خطأ"); });
    return () => { cancelled = true; };
  }, [user, authLoading]);

  if (authLoading || (user && apps === null && !error)) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">طلباتي</h1>
        <ApplicationsSkeleton />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
        <FileText className="w-10 h-10 text-slate-300" />
        <h1 className="text-2xl font-bold">طلباتي</h1>
        <p className="text-slate-500">سجّل دخولك الأول عشان تشوف الوظايف اللي قدّمت عليها.</p>
        <Link href="/login" className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-deep transition">
          تسجيل الدخول
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">طلباتي</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {apps && apps.length === 0 && (
        <div className="text-center py-16 flex flex-col items-center gap-3">
          <FileText className="w-10 h-10 text-slate-300" />
          <p className="text-slate-500">لسه مقدّمتش على أي وظيفة.</p>
          <Link href="/jobs" className="text-primary font-bold hover:underline">
            تصفح الوظايف
          </Link>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {apps?.map((a) => {
          const chip = statusChip(a.jobStatus);
          const open = a.jobStatus === "approved";
          const card = (
            <div className={`bg-white rounded-2xl border border-border p-4 flex flex-col gap-2 transition ${open ? "hover:border-primary" : "opacity-75"}`}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-bold text-text-main">{a.title || "وظيفة"}</h2>
                <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border ${chip.cls}`}>
                  {chip.label}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-body">
                {a.office && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {a.office}
                  </span>
                )}
                {a.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {a.location}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted">قدّمت {fromNow(a.appliedAt)}</p>
            </div>
          );
          return open ? (
            <Link key={a.id} href={`/jobs/${a.jobId}`}>{card}</Link>
          ) : (
            <div key={a.id}>{card}</div>
          );
        })}
      </div>
    </main>
  );
}
