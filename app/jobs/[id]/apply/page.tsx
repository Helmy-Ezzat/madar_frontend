"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";
import FloatingInput from "@/components/FloatingInput";
import VerifiedTick from "@/components/VerifiedTick";
import JobSourceChip from "@/components/JobSourceChip";
import { applyToJob, getAppliedState } from "@/services/officeDashboardService";
import type { Job } from "@/types";
import { Building2, CheckCircle2, Loader2, MapPin } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function ApplyPage() {
    const params = useParams();
    const jobId = typeof params.id === "string" ? params.id : "";
    const { user, dbUser, loading: authLoading } = useAuth();
    const showToast = useToast();

    const [job, setJob] = useState<Job | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [applied, setApplied] = useState(false);
    const [sending, setSending] = useState(false);
    const [done, setDone] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (!jobId) return;
        fetch(`${API_BASE_URL}/jobs/${jobId}`)
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((json) => setJob(json.data ?? json))
            .catch(() => setNotFound(true));
    }, [jobId]);

    useEffect(() => {
        if (!user || !jobId) return;
        setName((v) => v || dbUser?.displayName || user.displayName || "");
        getAppliedState(jobId)
            .then((res) => setApplied(!!res.data?.applied))
            .catch(() => {});
    }, [user, dbUser, jobId]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            await applyToJob(jobId, { name: name.trim(), phone: phone.trim(), note: note.trim() || undefined });
            setDone(true);
            setApplied(true);
        } catch (err) {
            showToast(err instanceof Error ? err.message : "حصل خطأ، حاول تاني");
        } finally {
            setSending(false);
        }
    };

    if (notFound) {
        return (
            <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
                <p className="text-text-main font-bold">الوظيفة دي مش موجودة.</p>
                <Link href="/jobs" className="text-primary font-bold text-sm hover:underline">ارجع للوظائف</Link>
            </main>
        );
    }

    if (!job || authLoading) {
        return (
            <main className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </main>
        );
    }

    return (
        <main className="bg-background min-h-screen py-10 px-4">
            <div className="max-w-xl mx-auto flex flex-col gap-6">
                {/* Job summary */}
                <div className="bg-white border border-border rounded-2xl p-5 flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary-tint text-primary flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="font-bold text-text-main">{job.job_info?.job_titles?.[0]}</p>
                        <p className="text-text-body text-sm flex items-center gap-2 flex-wrap">
                            {job.company_name}
                            {job.office_verified && <VerifiedTick />}
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                
                                <JobSourceChip postedBy={job.posted_by} />
                            </div>
                        </p>
                        <p className="text-text-muted text-xs flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.job_info?.location} · {job.job_info?.salary}
                        </p>
                    </div>
                </div>

                {done || applied ? (
                    <div className="bg-white border border-border rounded-2xl p-8 flex flex-col items-center gap-3 text-center">
                        <CheckCircle2 className="w-12 h-12 text-primary" />
                        <h1 className="text-xl font-bold text-text-main">طلبك وصل للمكتب</h1>
                        <p className="text-text-body text-sm leading-7">
                            المكتب هيشوف بياناتك ويتواصل معاك على رقمك. بالتوفيق!
                        </p>
                        <Link
                            href="/jobs"
                            className="mt-2 bg-primary hover:bg-primary-hover text-white font-bold text-sm px-6 py-2.5 rounded-lg transition"
                        >
                            ارجع للوظائف
                        </Link>
                    </div>
                ) : !user ? (
                    <div className="bg-white border border-border rounded-2xl p-8 flex flex-col items-center gap-3 text-center">
                        <p className="text-text-main font-bold">سجّل دخولك الأول عشان تقدّم على الوظيفة.</p>
                        <Link
                            href="/login"
                            className="bg-primary hover:bg-primary-hover text-white font-bold text-sm px-6 py-2.5 rounded-lg transition"
                        >
                            تسجيل الدخول
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={submit} className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4">
                        <h1 className="text-lg font-bold text-text-main">قدّم على الوظيفة</h1>
                        <FloatingInput id="apply-name" type="text" label="الاسم بالكامل" value={name} onChange={(e) => setName(e.target.value)} required />
                        <FloatingInput id="apply-phone" type="tel" label="رقم الجوال" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        <FloatingInput id="apply-note" type="text" label="ملاحظة للمكتب (اختياري)" value={note} onChange={(e) => setNote(e.target.value)} />
                        <button
                            type="submit"
                            disabled={sending}
                            className="bg-primary hover:bg-primary-hover text-white rounded-lg py-3 text-sm font-bold transition disabled:opacity-60"
                        >
                            {sending ? "جاري الإرسال..." : "إرسال الطلب"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
