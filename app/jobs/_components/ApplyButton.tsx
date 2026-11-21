"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { applyToJob, getAppliedState } from "@/services/officeDashboardService";
import { useToast } from "@/components/Toast";
import FloatingInput from "@/components/FloatingInput";

export default function ApplyButton({ jobId }: { jobId: string }) {
    const { user, dbUser } = useAuth();
    const showToast = useToast();
    const [open, setOpen] = useState(false);
    const [applied, setApplied] = useState(false);
    const [sending, setSending] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (!user) return;
        getAppliedState(jobId)
            .then((res) => setApplied(!!res.data?.applied))
            .catch(() => {});
    }, [user, jobId]);

    if (applied) {
        return (
            <span className="inline-flex items-center gap-2 py-2 px-3.5 bg-primary-tint text-primary rounded-lg text-xs font-bold">
                قدّمت على الوظيفة دي ✅
            </span>
        );
    }

    if (!user) {
        return (
            <Link
                href="/login"
                className="pointer-events-auto inline-flex items-center justify-center gap-2 py-2 px-3.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
                سجّل دخولك عشان تقدّم
            </Link>
        );
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            await applyToJob(jobId, { name: name.trim(), phone: phone.trim(), note: note.trim() || undefined });
            setApplied(true);
            setOpen(false);
            showToast("تم إرسال طلب التقديم للمكتب ✅");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "حصل خطأ، حاول تاني");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="pointer-events-auto flex flex-col gap-3">
            <button
                type="button"
                onClick={() => {
                    setName((v) => v || dbUser?.displayName || user.displayName || "");
                    setOpen((v) => !v);
                }}
                className="inline-flex items-center justify-center gap-2 py-2 px-3.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
                قدّم على الوظيفة
            </button>

            {open && (
                <form onSubmit={submit} className="flex flex-col gap-3 bg-primary-tint rounded-xl p-4">
                    <FloatingInput id="apply-name" type="text" label="الاسم بالكامل" value={name} onChange={(e) => setName(e.target.value)} required />
                    <FloatingInput id="apply-phone" type="tel" label="رقم الجوال" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <FloatingInput id="apply-note" type="text" label="ملاحظة للمكتب (اختياري)" value={note} onChange={(e) => setNote(e.target.value)} />
                    <button
                        type="submit"
                        disabled={sending}
                        className="bg-primary hover:bg-primary/90 text-white rounded-lg py-2.5 text-sm font-bold transition disabled:opacity-60"
                    >
                        {sending ? "جاري الإرسال..." : "إرسال الطلب"}
                    </button>
                </form>
            )}
        </div>
    );
}
