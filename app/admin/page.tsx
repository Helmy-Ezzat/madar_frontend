"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";
import OfficeVerifiedBadge from "@/components/OfficeVerifiedBadge";
import FloatingInput from "@/components/FloatingInput";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
    adminGetCounts,
    adminListOffices,
    adminApproveOffice,
    adminRejectOffice,
    adminSuspendOffice,
    adminUnsuspendOffice,
    adminListJobs,
    adminApproveJob,
    adminRejectJob,
    adminSuspendJob,
    adminUnsuspendJob,
    adminDeleteJob,
    adminCreateJob,
    adminApproveAllJobs,
    type AdminOffice,
    type AdminJob,
} from "@/services/officeDashboardService";
import { Briefcase, Building2, Check, Loader2, MapPin, Plus, X } from "lucide-react";

const ADMIN_EMAILS = ["hellmyezzat@gmail.com", "x26dbl@mail.instinct.com"];

const OFFICE_TABS = [
    { key: "pending", label: "تحت المراجعة" },
    { key: "approved", label: "معتمد" },
    { key: "suspended", label: "موقوف" },
    { key: "rejected", label: "مرفوض" },
] as const;

const JOB_TABS = [
    { key: "pending", label: "تحت المراجعة" },
    { key: "approved", label: "منشورة" },
    { key: "suspended", label: "موقوفة" },
    { key: "rejected", label: "مرفوضة" },
] as const;

export default function AdminPage() {
    const { user, loading } = useAuth();
    const showToast = useToast();
    const [section, setSection] = useState<"offices" | "jobs">("offices");
    const [status, setStatus] = useState<string>("pending");
    const [offices, setOffices] = useState<AdminOffice[]>([]);
    const [jobs, setJobs] = useState<AdminJob[]>([]);
    const [showPostForm, setShowPostForm] = useState(false);
    const [postTitle, setPostTitle] = useState("");
    const [postLocation, setPostLocation] = useState("");
    const [postSalary, setPostSalary] = useState("");
    const [postSummary, setPostSummary] = useState("");
    const [posting, setPosting] = useState(false);
    const [loadingList, setLoadingList] = useState(false);
    const [acting, setActing] = useState<string | null>(null);
    const [confirm, setConfirm] = useState<{ id: string; action: "reject" | "suspend" | "delete" } | null>(null);
    const [confirmAll, setConfirmAll] = useState(false);
    const [approvingAll, setApprovingAll] = useState(false);
    const [counts, setCounts] = useState<{ pendingOffices: number; pendingJobs: number } | null>(null);

    const refreshCounts = useCallback(async () => {
        try {
            const res = await adminGetCounts();
            if (res.data) setCounts(res.data);
        } catch {
            // badge failure should never block the dashboard
        }
    }, []);


    const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
    useEffect(() => {
        if (isAdmin) refreshCounts();
    }, [isAdmin, refreshCounts]);

    const load = useCallback(async () => {
        setLoadingList(true);
        try {
            if (section === "offices") {
                const res = await adminListOffices(status);
                setOffices(res.data ?? []);
            } else {
                const res = await adminListJobs(status);
                setJobs(res.data ?? []);
            }
        } catch {
            setOffices([]);
            setJobs([]);
        } finally {
            setLoadingList(false);
        }
    }, [section, status]);

    useEffect(() => {
        if (isAdmin) load();
    }, [isAdmin, load]);

    const approveAll = async () => {
        setApprovingAll(true);
        try {
            const res = await adminApproveAllJobs();
            const n = (res.data as { approved?: number } | undefined)?.approved ?? 0;
            showToast(n > 0 ? `اتقبلوا كلهم (${n}) ✅` : "مفيش وظايف مستنية موافقة");
            await load();
            refreshCounts();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "حصل خطأ، حاول تاني");
        } finally {
            setApprovingAll(false);
            setConfirmAll(false);
        }
    };

    const openPostForm = () => setShowPostForm((v) => !v);

    const submitPost = async (e: React.FormEvent) => {
        e.preventDefault();
        setPosting(true);
        try {
            await adminCreateJob({
                title: postTitle.trim(),
                location: postLocation.trim(),
                salary: postSalary.trim() || undefined,
                summary: postSummary.trim(),
            });
            showToast("الوظيفة اتنشرت باسم المكتب ✅");
            setPostTitle("");
            setPostLocation("");
            setPostSalary("");
            setPostSummary("");
            setShowPostForm(false);
        } catch (err) {
            showToast(err instanceof Error ? err.message : "حصل خطأ، حاول تاني");
        } finally {
            setPosting(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </main>
        );
    }

    if (!isAdmin) {
        return (
            <main className="min-h-[60vh] flex items-center justify-center px-4">
                <p className="text-text-main font-bold">الصفحة دي للإدارة بس.</p>
            </main>
        );
    }

    const act = async (id: string, action: "approve" | "reject" | "suspend" | "unsuspend" | "delete") => {
        setActing(id);
        try {
            if (section === "offices") {
                if (action === "approve" || action === "unsuspend") {
                    await (action === "approve" ? adminApproveOffice(id) : adminUnsuspendOffice(id));
                    showToast("المكتب اتفعّل ✅");
                } else if (action === "reject") {
                    await adminRejectOffice(id);
                    showToast("المكتب اترفض");
                } else if (action === "suspend") {
                    await adminSuspendOffice(id);
                    showToast("المكتب اتوقف");
                }
            } else {
                if (action === "approve") {
                    await adminApproveJob(id);
                    showToast("الوظيفة اتنشرت ✅");
                } else if (action === "reject") {
                    await adminRejectJob(id);
                    showToast("الوظيفة اترفضت");
                } else if (action === "suspend") {
                    await adminSuspendJob(id);
                    showToast("الوظيفة اتوقفت");
                } else if (action === "unsuspend") {
                    await adminUnsuspendJob(id);
                    showToast("الوظيفة رجعت منشورة ✅");
                } else if (action === "delete") {
                    await adminDeleteJob(id);
                    showToast("الوظيفة اتحذفت");
                }
            }
            await load();
            refreshCounts();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "حصل خطأ، حاول تاني");
        } finally {
            setActing(null);
        }
    };

    return (
        <main className="bg-background min-h-screen py-10 px-4">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
                <h1 className="text-2xl font-bold text-text-main">الإدارة</h1>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setSection("offices")}
                        className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                            section === "offices"
                                ? "bg-primary-deep text-white"
                                : "bg-white border border-border text-text-body hover:border-primary"
                        }`}
                    >
                        المكاتب
                        {counts && counts.pendingOffices > 0 && (
                            <span className="ms-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                                {counts.pendingOffices}
                            </span>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setSection("jobs")}
                        className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                            section === "jobs"
                                ? "bg-primary-deep text-white"
                                : "bg-white border border-border text-text-body hover:border-primary"
                        }`}
                    >
                        الوظائف
                        {counts && counts.pendingJobs > 0 && (
                            <span className="ms-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                                {counts.pendingJobs}
                            </span>
                        )}
                    </button>
                </div>

                <div className="flex gap-2">
                    {(section === "offices" ? OFFICE_TABS : JOB_TABS).map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setStatus(tab.key)}
                            className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                                status === tab.key
                                    ? "bg-primary text-white"
                                    : "bg-white border border-border text-text-body hover:border-primary"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {loadingList ? (
                    <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : section === "jobs" ? (
                    <>
                    <button
                        type="button"
                        onClick={openPostForm}
                        className="inline-flex items-center gap-1.5 self-start bg-primary-deep hover:bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg transition"
                    >
                        <Plus className="w-4 h-4" />
                        نزّل وظيفة باسم مدار
                    </button>
                    {showPostForm && (
                        <form onSubmit={submitPost} className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4">
                            <p className="text-text-muted text-xs">الوظيفة هتظهر باسم مدار نفسها، مش باسم أي مكتب.</p>
                            <FloatingInput id="post-title" type="text" label="المسمى الوظيفي" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required />
                            <FloatingInput id="post-location" type="text" label="المدينة / الدولة" value={postLocation} onChange={(e) => setPostLocation(e.target.value)} required />
                            <FloatingInput id="post-salary" type="text" label="الراتب (اختياري)" value={postSalary} onChange={(e) => setPostSalary(e.target.value)} />
                            <FloatingInput id="post-summary" type="text" label="تفاصيل الوظيفة" value={postSummary} onChange={(e) => setPostSummary(e.target.value)} required />
                            <button
                                type="submit"
                                disabled={posting}
                                className="bg-primary hover:bg-primary-hover text-white rounded-lg py-2.5 text-sm font-bold transition disabled:opacity-60"
                            >
                                {posting ? "جاري النشر..." : "انشر الوظيفة"}
                            </button>
                        </form>
                    )}
                    {status === "pending" && jobs.length > 0 && (
                        <button
                            type="button"
                            disabled={approvingAll}
                            onClick={() => setConfirmAll(true)}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition text-sm disabled:opacity-60"
                        >
                            {approvingAll ? "جاري الموافقة..." : `موافقة على الكل (${jobs.length})`}
                        </button>
                    )}
                    {jobs.length === 0 ? (
                        <p className="text-text-muted text-sm bg-white border border-border rounded-2xl p-6 text-center">
                            مفيش وظائف في القائمة دي دلوقتي.
                        </p>
                    ) : (
                        jobs.map((job) => (
                            <article key={job._id} className="bg-white border border-border rounded-2xl p-5 flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex items-start gap-3">
                                    <div className="w-11 h-11 rounded-full bg-primary-tint text-primary flex items-center justify-center shrink-0">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="font-bold text-text-main">{job.job_info?.job_titles?.[0]}</p>
                                        <p className="text-text-body text-sm">{job.company_name}</p>
                                        <p className="text-text-muted text-xs flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {job.job_info?.location} · {job.job_info?.salary}
                                        </p>
                                        {job.job_info?.summary && (
                                            <p className="text-text-muted text-xs leading-6 max-w-md">{job.job_info.summary}</p>
                                        )}
                                    </div>
                                </div>
                                {job.approval_status === "approved" && (
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            disabled={acting === job._id}
                                            onClick={() => setConfirm({ id: job._id, action: "suspend" })}
                                            className="inline-flex items-center gap-1.5 border border-amber-200 text-amber-600 hover:bg-amber-50 text-sm font-bold px-4 py-2 rounded-lg transition disabled:opacity-60"
                                        >
                                            إيقاف
                                        </button>
                                        <button
                                            type="button"
                                            disabled={acting === job._id}
                                            onClick={() => setConfirm({ id: job._id, action: "delete" })}
                                            className="inline-flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-bold px-4 py-2 rounded-lg transition disabled:opacity-60"
                                        >
                                            <X className="w-4 h-4" />
                                            حذف
                                        </button>
                                    </div>
                                )}
                                {job.approval_status === "suspended" && (
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            disabled={acting === job._id}
                                            onClick={() => act(job._id, "unsuspend")}
                                            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-4 py-2 rounded-lg transition disabled:opacity-60"
                                        >
                                            <Check className="w-4 h-4" />
                                            إعادة نشر
                                        </button>
                                        <button
                                            type="button"
                                            disabled={acting === job._id}
                                            onClick={() => setConfirm({ id: job._id, action: "delete" })}
                                            className="inline-flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-bold px-4 py-2 rounded-lg transition disabled:opacity-60"
                                        >
                                            <X className="w-4 h-4" />
                                            حذف
                                        </button>
                                    </div>
                                )}
                                {job.approval_status === "pending" && (
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            disabled={acting === job._id}
                                            onClick={() => act(job._id, "approve")}
                                            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-4 py-2 rounded-lg transition disabled:opacity-60"
                                        >
                                            <Check className="w-4 h-4" />
                                            نشر
                                        </button>
                                        <button
                                            type="button"
                                            disabled={acting === job._id}
                                            onClick={() => setConfirm({ id: job._id, action: "reject" })}
                                            className="inline-flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-bold px-4 py-2 rounded-lg transition disabled:opacity-60"
                                        >
                                            <X className="w-4 h-4" />
                                            رفض
                                        </button>
                                    </div>
                                )}
                            </article>
                        ))
                    )}
                    </>
                ) : offices.length === 0 ? (
                    <p className="text-text-muted text-sm bg-white border border-border rounded-2xl p-6 text-center">
                        مفيش مكاتب في القائمة دي دلوقتي.
                    </p>
                ) : (
                    offices.map((office) => (
                        <article key={office._id} className="bg-white border border-border rounded-2xl p-5 flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex items-start gap-3">
                                <div className="w-11 h-11 rounded-full bg-primary-tint text-primary flex items-center justify-center shrink-0">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold text-text-main flex items-center gap-2 flex-wrap">
                                        {office.officeName || office.displayName}
                                        {office.officeStatus === "approved" && <OfficeVerifiedBadge />}
                                    </p>
                                    <p className="text-text-muted text-xs" dir="ltr">{office.email}</p>
                                    {office.licenseNumber && (
                                        <p className="text-text-muted text-xs">ترخيص رقم {office.licenseNumber}</p>
                                    )}
                                    <p className="text-text-muted text-xs">المسؤول: {office.displayName}</p>
                                </div>
                            </div>
                            {office.officeStatus === "approved" && (
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        disabled={acting === office._id}
                                        onClick={() => setConfirm({ id: office._id, action: "suspend" })}
                                        className="inline-flex items-center gap-1.5 border border-amber-200 text-amber-600 hover:bg-amber-50 text-sm font-bold px-4 py-2 rounded-lg transition disabled:opacity-60"
                                    >
                                        إيقاف
                                    </button>
                                </div>
                            )}
                            {office.officeStatus === "suspended" && (
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        disabled={acting === office._id}
                                        onClick={() => act(office._id, "unsuspend")}
                                        className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-4 py-2 rounded-lg transition disabled:opacity-60"
                                    >
                                        <Check className="w-4 h-4" />
                                        إعادة تفعيل
                                    </button>
                                </div>
                            )}
                            {office.officeStatus === "pending" && (
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        disabled={acting === office._id}
                                        onClick={() => act(office._id, "approve")}
                                        className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-4 py-2 rounded-lg transition disabled:opacity-60"
                                    >
                                        <Check className="w-4 h-4" />
                                        اعتماد
                                    </button>
                                    <button
                                        type="button"
                                        disabled={acting === office._id}
                                        onClick={() => setConfirm({ id: office._id, action: "reject" })}
                                        className="inline-flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-bold px-4 py-2 rounded-lg transition disabled:opacity-60"
                                    >
                                        <X className="w-4 h-4" />
                                        رفض
                                    </button>
                                </div>
                            )}
                        </article>
                    ))
                )}
            </div>
            <ConfirmDialog
                open={confirm !== null}
                title={
                    confirm?.action === "delete"
                        ? "متأكد إنك عايز تحذف الوظيفة؟ هتتحذف هي وكل التقديمات عليها، ومفيش تراجع."
                        : confirm?.action === "suspend"
                          ? section === "offices"
                              ? "متأكد إنك عايز توقف المكتب؟ مش هيقدر ينزل وظايف لحد ما يتفعل تاني."
                              : "متأكد إنك عايز توقف الوظيفة؟ هتختفي من الموقع لحد ما ترجعها."
                          : "متأكد إنك عايز ترفض؟ مفيش تراجع بعدها."
                }
                confirmLabel={confirm?.action === "delete" ? "حذف" : confirm?.action === "suspend" ? "إيقاف" : "رفض"}
                onConfirm={() => {
                    if (confirm) act(confirm.id, confirm.action);
                    setConfirm(null);
                }}
                onCancel={() => setConfirm(null)}
            />
            <ConfirmDialog
                open={confirmAll}
                title="هتوافق على كل الوظايف المستنية دفعة واحدة. متأكد؟"
                confirmLabel="موافقة على الكل"
                onConfirm={approveAll}
                onCancel={() => setConfirmAll(false)}
            />
        </main>
    );
}
