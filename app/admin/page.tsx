"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";
import OfficeVerifiedBadge from "@/components/OfficeVerifiedBadge";
import FloatingInput from "@/components/FloatingInput";
import {
    adminListOffices,
    adminApproveOffice,
    adminRejectOffice,
    adminListJobs,
    adminApproveJob,
    adminRejectJob,
    adminCreateJob,
    type AdminOffice,
    type AdminJob,
} from "@/services/officeDashboardService";
import { Briefcase, Building2, Check, Loader2, MapPin, Plus, X } from "lucide-react";

const ADMIN_EMAILS = ["hellmyezzat@gmail.com", "x26dbl@mail.instinct.com"];

const STATUS_TABS = [
    { key: "pending", label: "تحت المراجعة" },
    { key: "approved", label: "معتمد" },
    { key: "rejected", label: "مرفوض" },
] as const;

export default function AdminPage() {
    const { user, loading } = useAuth();
    const showToast = useToast();
    const [section, setSection] = useState<"offices" | "jobs">("offices");
    const [status, setStatus] = useState<string>("pending");
    const [offices, setOffices] = useState<AdminOffice[]>([]);
    const [jobs, setJobs] = useState<AdminJob[]>([]);
    const [showPostForm, setShowPostForm] = useState(false);
    const [approvedOffices, setApprovedOffices] = useState<AdminOffice[]>([]);
    const [postOfficeId, setPostOfficeId] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [postLocation, setPostLocation] = useState("");
    const [postSalary, setPostSalary] = useState("");
    const [postSummary, setPostSummary] = useState("");
    const [posting, setPosting] = useState(false);
    const [loadingList, setLoadingList] = useState(false);
    const [acting, setActing] = useState<string | null>(null);

    const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

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

    const openPostForm = async () => {
        setShowPostForm((v) => !v);
        if (approvedOffices.length === 0) {
            try {
                const res = await adminListOffices("approved");
                setApprovedOffices(res.data ?? []);
            } catch {
                setApprovedOffices([]);
            }
        }
    };

    const submitPost = async (e: React.FormEvent) => {
        e.preventDefault();
        setPosting(true);
        try {
            await adminCreateJob({
                officeId: postOfficeId,
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

    const act = async (id: string, action: "approve" | "reject") => {
        setActing(id);
        try {
            if (section === "offices") {
                if (action === "approve") {
                    await adminApproveOffice(id);
                    showToast("المكتب اتفعّل ✅");
                } else {
                    await adminRejectOffice(id);
                    showToast("المكتب اترفض");
                }
            } else {
                if (action === "approve") {
                    await adminApproveJob(id);
                    showToast("الوظيفة اتنشرت ✅");
                } else {
                    await adminRejectJob(id);
                    showToast("الوظيفة اترفضت");
                }
            }
            await load();
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
                        الوظايف
                    </button>
                </div>

                <div className="flex gap-2">
                    {STATUS_TABS.map((tab) => (
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
                        انزل وظيفة باسم مكتب
                    </button>
                    {showPostForm && (
                        <form onSubmit={submitPost} className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4">
                            <select
                                value={postOfficeId}
                                onChange={(e) => setPostOfficeId(e.target.value)}
                                required
                                className="border border-border rounded-lg px-3 py-2.5 text-sm text-text-main bg-white"
                            >
                                <option value="" disabled>اختار المكتب المعتمد</option>
                                {approvedOffices.map((office) => (
                                    <option key={office._id} value={office._id}>
                                        {office.officeName || office.displayName}
                                    </option>
                                ))}
                            </select>
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
                    {jobs.length === 0 ? (
                        <p className="text-text-muted text-sm bg-white border border-border rounded-2xl p-6 text-center">
                            مفيش وظايف في القائمة دي دلوقتي.
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
                                            onClick={() => act(job._id, "reject")}
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
                                        onClick={() => act(office._id, "reject")}
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
        </main>
    );
}
