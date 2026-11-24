'use client';

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";
import {
    createSavedSearch,
    DuplicateSavedSearchError,
} from "@/services/savedSearchService";

/**
 * "احفظ البحث" on the results page. The backend stores { query, specialization,
 * country(location) } only, so the button shows when at least one of those is
 * active; company and date_posted filters are not persisted (backend schema).
 */
export default function SaveSearchButton() {
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const toast = useToast();
    const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

    const q = searchParams.get("q") ?? "";
    const specialization = searchParams.get("specialization") ?? "";
    const location = searchParams.get("location") ?? "";
    const hasUnsupported = !!(searchParams.get("company") || searchParams.get("date_posted"));

    if (!q && !specialization && !location) return null;

    const save = async () => {
        if (!user) {
            toast("سجّل دخولك الأول عشان تحفظ البحث");
            return;
        }
        setState("saving");
        try {
            await createSavedSearch({ query: q, specialization, country: location });
            setState("saved");
            toast(
                hasUnsupported
                    ? "اتحفظ البحث وهيوصلك إشعار بالوظايف المطابقة. فلتر الشركة وتاريخ النشر مش بيتحفظوا."
                    : "اتحفظ البحث وهيوصلك إشعار لما تنزل وظيفة مطابقة"
            );
        } catch (error) {
            setState("idle");
            if (error instanceof DuplicateSavedSearchError) {
                setState("saved");
                toast("البحث ده محفوظ عندك بالفعل");
            } else {
                toast(error instanceof Error ? error.message : "فشل حفظ البحث");
            }
        }
    };

    return (
        <button
            onClick={save}
            disabled={state !== "idle"}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-70 rounded-full px-3 py-1.5 transition w-fit"
        >
            {state === "saving" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : state === "saved" ? (
                <BookmarkCheck className="w-4 h-4" />
            ) : (
                <Bookmark className="w-4 h-4" />
            )}
            {state === "saved" ? "البحث محفوظ" : "احفظ البحث"}
        </button>
    );
}
