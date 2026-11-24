"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";
import {
    fetchSavedSearches,
    deleteSavedSearch,
    type SavedSearch,
} from "@/services/savedSearchService";

function searchHref(s: SavedSearch): string {
    const params = new URLSearchParams();
    if (s.query) params.set("q", s.query);
    if (s.specialization) params.set("specialization", s.specialization);
    if (s.country) params.set("location", s.country);
    return `/jobs?${params.toString()}`;
}

function searchLabel(s: SavedSearch): string {
    return [s.query, s.specialization, s.country].filter(Boolean).join(" · ");
}

/** Saved searches list with apply + delete, shown above saved jobs on /saved. */
export default function SavedSearches() {
    const { user, loading: authLoading } = useAuth();
    const toast = useToast();
    const [items, setItems] = useState<SavedSearch[] | null>(null);

    useEffect(() => {
        if (authLoading || !user) {
            setItems(null);
            return;
        }
        let cancelled = false;
        fetchSavedSearches()
            .then((data) => {
                if (!cancelled) setItems(data);
            })
            .catch(() => {
                if (!cancelled) setItems([]);
            });
        return () => {
            cancelled = true;
        };
    }, [user, authLoading]);

    if (!user || !items || items.length === 0) return null;

    const remove = async (id: string) => {
        const prev = items;
        setItems(items.filter((s) => s._id !== id));
        try {
            await deleteSavedSearch(id);
            toast("اتحذف البحث المحفوظ");
        } catch {
            setItems(prev);
            toast("فشل حذف البحث المحفوظ");
        }
    };

    return (
        <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">بحوثك المحفوظة</h2>
            <ul className="flex flex-col gap-2">
                {items.map((s) => (
                    <li
                        key={s._id}
                        className="flex items-center gap-2 bg-white rounded-2xl shadow-sm px-4 py-3"
                    >
                        <Search className="w-4 h-4 text-primary shrink-0" />
                        <Link
                            href={searchHref(s)}
                            className="flex-1 text-sm font-semibold text-slate-800 hover:text-primary transition truncate"
                        >
                            {searchLabel(s)}
                        </Link>
                        <button
                            onClick={() => remove(s._id)}
                            aria-label="حذف البحث المحفوظ"
                            className="p-1.5 text-slate-400 hover:text-red-500 transition"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
