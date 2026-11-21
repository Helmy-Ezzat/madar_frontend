"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";
import OfficeVerifiedBadge from "@/components/OfficeVerifiedBadge";
import {
    adminListOffices,
    adminApproveOffice,
    adminRejectOffice,
    type AdminOffice,
} from "@/services/officeDashboardService";
import { Building2, Check, Loader2, X } from "lucide-react";

const ADMIN_EMAIL = "hellmyezzat@gmail.com";

const STATUS_TABS = [
    { key: "pending", label: "تحت المراجعة" },
    { key: "approved", label: "معتمد" },
    { key: "rejected", label: "مرفوض" },
] as const;

export default function AdminPage() {
    const { user, loading } = useAuth();
    const showToast = useToast();
    const [status, setStatus] = useState<string>("pending");
    const [offices, setOffices] = useState<AdminOffice[]>([]);
    const [loadingList, setLoadingList] = useState(false);
    const [acting, setActing] = useState<string | null>(null);

    const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

    const load = useCallback(async () => {
        setLoadingList(true);
        try {
            const res = await adminListOffices(status);
            setOffices(res.data ?? []);
        } catch {
            setOffices([]);
        } finally {
            setLoadingList(false);
        }
    }, [status]);

    useEffect(() => {
        if (isAdmin) load();
    }, [isAdmin, load]);

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
            if (action === "approve") {
                await adminApproveOffice(id);
                showToast("المكتب اتفعّل ✅");
            } else {
                await adminRejectOffice(id);
                showToast("المكتب اترفض");
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
                <h1 className="text-2xl font-bold text-text-main">اعتماد مكاتب إلحاق العمالة</h1>

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
