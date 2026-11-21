"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";
import FloatingInput from "@/components/FloatingInput";
import OfficeVerifiedBadge from "@/components/OfficeVerifiedBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
    createOfficeJob,
    getMyOfficeJobs,
    deleteOfficeJob,
    closeOfficeJob,
    getOfficeJobApplicants,
    upgradeToOffice,
} from "@/services/officeDashboardService";
import type { Job } from "@/types";
import { Building2, ChevronDown, Loader2, MapPin, Trash2, Users } from "lucide-react";

interface Applicant {
    _id: string;
    name: string;
    phone: string;
    note: string;
    applicantEmail: string;
    createdAt: string;
}

export default function OfficeDashboardPage() {
    const { user, dbUser, loading } = useAuth();
    const showToast = useToast();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const [posting, setPosting] = useState(false);
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState("");
    const [experience, setExperience] = useState("");
    const [summary, setSummary] = useState("");
    const [openApplicants, setOpenApplicants] = useState<string | null>(null);
    const [upOfficeName, setUpOfficeName] = useState("");
    const [upLicense, setUpLicense] = useState("");
    const [upgrading, setUpgrading] = useState(false);
    const [confirmDeleteJob, setConfirmDeleteJob] = useState<string | null>(null);
    const [confirmCloseJob, setConfirmCloseJob] = useState<string | null>(null);
    const [applicants, setApplicants] = useState<Record<string, Applicant[]>>({});

    const isOffice = dbUser?.role === "office";
    const approved = isOffice && dbUser?.officeStatus === "approved";

    const loadJobs = useCallback(async () => {
        setLoadingJobs(true);
        try {
            const res = await getMyOfficeJobs();
            setJobs(res.data ?? []);
        } catch {
            setJobs([]);
        } finally {
            setLoadingJobs(false);
        }
    }, []);

    useEffect(() => {
        if (approved) loadJobs();
    }, [approved, loadJobs]);

    if (loading) {
        return (
            <main className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </main>
        );
    }

    if (!user) {
        return (
            <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
                <p className="text-text-main font-bold text-lg">لوحة مكتب إلحاق العمالة</p>
                <p className="text-text-body text-sm">سجّل دخولك بحساب المكتب عشان تدخل لوحتك.</p>
                <Link href="/login" className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold">تسجيل الدخول</Link>
            </main>
        );
    }

    const submitUpgrade = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpgrading(true);
        try {
            await upgradeToOffice({ officeName: upOfficeName.trim(), licenseNumber: upLicense.trim() || undefined });
            showToast("طلبك وصل، حسابك بقى تحت المراجعة ✅");
            window.location.reload();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "حصل خطأ، حاول تاني");
            setUpgrading(false);
        }
    };

    if (!isOffice) {
        if (!user) {
            return (
                <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
                    <p className="text-text-main font-bold text-lg">اللوحة دي لحسابات مكاتب إلحاق العمالة</p>
                    <p className="text-text-body text-sm max-w-md">
                        عندك مكتب إلحاق عمالة؟ أنشئ حساب مكتب من صفحة التسجيل وهيتفعّل بعد مراجعة الإدارة.
                    </p>
                    <Link href="/register" className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold">إنشاء حساب مكتب</Link>
                </main>
            );
        }
        return (
            <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 py-10 text-center">
                <p className="text-text-main font-bold text-lg">حوّل حسابك لمكتب إلحاق عمالة</p>
                <p className="text-text-body text-sm max-w-md">
                    نفس حسابك الحالي هيبقى حساب مكتب. الإدارة بتراجع الطلب يدويًا، وأول ما يتفعّل هتقدر تنزل وظائف بشارة "مكتب إلحاق عمالة معتمد".
                </p>
                <form onSubmit={submitUpgrade} className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4 w-full max-w-md text-start">
                    <FloatingInput id="up-office" type="text" label="اسم المكتب" value={upOfficeName} onChange={(e) => setUpOfficeName(e.target.value)} required />
                    <FloatingInput id="up-license" type="text" label="رقم الترخيص (اختياري)" value={upLicense} onChange={(e) => setUpLicense(e.target.value)} />
                    <button
                        type="submit"
                        disabled={upgrading}
                        className="bg-primary hover:bg-primary-hover text-white rounded-lg py-2.5 text-sm font-bold transition disabled:opacity-60"
                    >
                        {upgrading ? "جاري الإرسال..." : "قدّم طلب تحويل الحساب"}
                    </button>
                </form>
            </main>
        );
    }

    if (dbUser?.officeStatus === "pending") {
        return (
            <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
                <div className="bg-primary-tint rounded-3xl p-8 max-w-md flex flex-col items-center gap-3">
                    <Building2 className="w-10 h-10 text-primary" />
                    <p className="text-text-main font-bold text-lg">حسابك تحت المراجعة</p>
                    <p className="text-text-body text-sm leading-relaxed">
                        طلب تسجيل مكتب <strong>{dbUser.officeName}</strong> وصلنا. الإدارة بتراجع حسابات مكاتب إلحاق العمالة يدويًا، وأول ما يتفعّل هتقدر تنزل وظائف بشارة "مكتب إلحاق عمالة معتمد".
                    </p>
                </div>
            </main>
        );
    }

    if (dbUser?.officeStatus === "rejected") {
        return (
            <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
                <div className="bg-red-50 rounded-3xl p-8 max-w-md flex flex-col items-center gap-3">
                    <p className="text-text-main font-bold text-lg">طلب التسجيل اترفض</p>
                    <p className="text-text-body text-sm">للاستفسار كلمنا على <a href="mailto:hellmyezzat@gmail.com" className="text-primary hover:underline">hellmyezzat@gmail.com</a>.</p>
                </div>
            </main>
        );
    }

    const submitJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setPosting(true);
        try {
            await createOfficeJob({ title, location, summary, salary: salary || undefined, experience: experience || undefined });
            showToast("الوظيفة اتنشرت ✅");
            setTitle(""); setLocation(""); setSalary(""); setExperience(""); setSummary("");
            await loadJobs();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "حصل خطأ، حاول تاني");
        } finally {
            setPosting(false);
        }
    };

    const removeJob = async (jobId: string) => {
        try {
            await deleteOfficeJob(jobId);
            setJobs((prev) => prev.filter((j) => j._id !== jobId));
            showToast("الوظيفة اتمسحت");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "حصل خطأ، حاول تاني");
        }
    };

    const closeJob = async (jobId: string) => {
        try {
            await closeOfficeJob(jobId, true);
            setJobs((prev) => prev.map((j) => (j._id === jobId ? { ...j, approval_status: "closed" } : j)));
            showToast("اتقفل التقديم على الوظيفة");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "حصل خطأ، حاول تاني");
        }
    };

    const toggleApplicants = async (jobId: string) => {
        if (openApplicants === jobId) {
            setOpenApplicants(null);
            return;
        }
        setOpenApplicants(jobId);
        if (!applicants[jobId]) {
            try {
                const res = await getOfficeJobApplicants(jobId);
                setApplicants((prev) => ({ ...prev, [jobId]: res.data ?? [] }));
            } catch {
                setApplicants((prev) => ({ ...prev, [jobId]: [] }));
            }
        }
    };

    return (
        <main className="bg-background min-h-screen py-10 px-4">
            <div className="max-w-3xl mx-auto flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-text-main">{dbUser?.officeName || "لوحة المكتب"}</h1>
                        <OfficeVerifiedBadge />
                    </div>
                    {dbUser?.licenseNumber && (
                        <p className="text-text-muted text-xs">ترخيص رقم {dbUser.licenseNumber}</p>
                    )}
                </div>

                {/* Post a job */}
                <section className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-text-main">نزّل وظيفة جديدة</h2>
                    <form onSubmit={submitJob} className="flex flex-col gap-4">
                        <FloatingInput id="job-title" type="text" label="المسمى الوظيفي" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        <FloatingInput id="job-location" type="text" label="المدينة / الدولة" value={location} onChange={(e) => setLocation(e.target.value)} required />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FloatingInput id="job-salary" type="text" label="الراتب (اختياري)" value={salary} onChange={(e) => setSalary(e.target.value)} />
                            <FloatingInput id="job-experience" type="text" label="الخبرة المطلوبة (اختياري)" value={experience} onChange={(e) => setExperience(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="job-summary" className="text-sm font-semibold text-text-main">تفاصيل الوظيفة</label>
                            <textarea
                                id="job-summary"
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                required
                                rows={5}
                                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-y"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={posting}
                            className="bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition disabled:opacity-60"
                        >
                            {posting ? "جاري النشر..." : "انشر الوظيفة"}
                        </button>
                    </form>
                </section>

                {/* My postings */}
                <section className="flex flex-col gap-3">
                    <h2 className="text-lg font-bold text-text-main">وظائفي ({jobs.length})</h2>
                    {loadingJobs ? (
                        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                    ) : jobs.length === 0 ? (
                        <p className="text-text-muted text-sm bg-white border border-border rounded-2xl p-6 text-center">لسه منزلتش وظائف. نزّل أول وظيفة من الفورم اللي فوق.</p>
                    ) : (
                        jobs.map((job) => (
                            <article key={job._id} className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex flex-col gap-1">
                                        <p className="font-bold text-text-main flex items-center gap-2 flex-wrap">
                                            {job.job_info?.job_titles?.[0]}
                                            {job.approval_status === "approved" && (
                                                <span className="rounded-full bg-green-50 text-green-600 text-[11px] font-bold px-2.5 py-0.5">منشورة</span>
                                            )}
                                            {job.approval_status === "closed" && (
                                                <span className="rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold px-2.5 py-0.5">انتهى التقديم</span>
                                            )}
                                            {job.approval_status === "suspended" && (
                                                <span className="rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold px-2.5 py-0.5">موقوفة من الإدارة</span>
                                            )}
                                            {job.approval_status === "rejected" && (
                                                <span className="rounded-full bg-red-50 text-red-500 text-[11px] font-bold px-2.5 py-0.5">مرفوضة</span>
                                            )}
                                            {(!job.approval_status || job.approval_status === "pending") && (
                                                <span className="rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold px-2.5 py-0.5">تحت المراجعة</span>
                                            )}
                                        </p>
                                        <p className="text-text-muted text-xs flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {job.job_info?.location} · {job.job_info?.salary}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {job.approval_status === "approved" && (
                                            <button
                                                type="button"
                                                onClick={() => setConfirmCloseJob(job._id)}
                                                className="text-amber-600 hover:bg-amber-50 text-xs font-bold px-3 py-2 rounded-lg transition"
                                            >
                                                إنهاء التقديم
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setConfirmDeleteJob(job._id)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                                            aria-label="مسح الوظيفة"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => toggleApplicants(job._id)}
                                    className="flex items-center gap-2 text-primary text-sm font-bold w-fit"
                                >
                                    <Users className="w-4 h-4" />
                                    المتقدمين
                                    <ChevronDown className={`w-4 h-4 transition-transform ${openApplicants === job._id ? "rotate-180" : ""}`} />
                                </button>
                                {openApplicants === job._id && (
                                    <div className="border-t border-border-light pt-3 flex flex-col gap-2">
                                        {(applicants[job._id] ?? []).length === 0 ? (
                                            <p className="text-text-muted text-sm">لسه مفيش متقدمين على الوظيفة دي.</p>
                                        ) : (
                                            (applicants[job._id] ?? []).map((a) => (
                                                <div key={a._id} className="bg-surface rounded-xl p-3.5 text-sm flex flex-col gap-1">
                                                    <p className="font-bold text-text-main">{a.name} <span className="text-text-muted font-normal" dir="ltr">{a.phone}</span></p>
                                                    {a.note && <p className="text-text-body">{a.note}</p>}
                                                    <p className="text-text-muted text-xs" dir="ltr">{a.applicantEmail}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </article>
                        ))
                    )}
                </section>
            </div>
            <ConfirmDialog
                open={confirmCloseJob !== null}
                title="إنهاء التقديم على الوظيفة دي؟ هتفضل ظاهرة عندك هنا بحالة انتهى التقديم ومحدش هيقدر يقدم عليها تاني."
                confirmLabel="إنهاء التقديم"
                onConfirm={() => {
                    if (confirmCloseJob) closeJob(confirmCloseJob);
                    setConfirmCloseJob(null);
                }}
                onCancel={() => setConfirmCloseJob(null)}
            />
            <ConfirmDialog
                open={confirmDeleteJob !== null}
                title="متأكد إنك عايز تمسح الوظيفة دي؟"
                confirmLabel="امسح الوظيفة"
                onConfirm={() => {
                    if (confirmDeleteJob) removeJob(confirmDeleteJob);
                    setConfirmDeleteJob(null);
                }}
                onCancel={() => setConfirmDeleteJob(null)}
            />
        </main>
    );
}
