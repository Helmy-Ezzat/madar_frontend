"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Search, ArrowLeft } from "lucide-react";
import { pluralAr, nouns } from "@/lib/arabicPlural";

interface Office {
    name: string;
    license_number: string;
    description: string;
    jobCount: number;
}

const AVATAR_COLORS = [
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-violet-100 text-violet-600",
    "bg-amber-100 text-amber-600",
    "bg-rose-100 text-rose-600",
    "bg-cyan-100 text-cyan-600",
];

export default function OfficesGrid({ offices }: { offices: Office[] }) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim();
        if (!q) return offices;
        return offices.filter((o) => o.name.includes(q));
    }, [offices, query]);

    return (
        <>
            {/* Search */}
            <div className="relative mb-8 max-w-md mx-auto">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ابحث عن مكتب بالاسم..."
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pr-11 pl-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map((office, i) => (
                    <div
                        key={office.name}
                        className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/50 hover:shadow-md transition-all duration-200 flex flex-col"
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                            >
                                {office.name.replace(/^شركة\s*/, "").charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="font-semibold text-slate-800 text-base md:text-lg truncate">
                                    {office.name}
                                </h2>
                                <p className="text-slate-500 text-sm">
                                    {pluralAr(office.jobCount, nouns.job)} متاحة
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">
                                <BadgeCheck className="w-3.5 h-3.5" />
                                مرخص {office.license_number}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm line-clamp-1 mb-4">
                            {office.description}
                        </p>
                        <Link
                            href={`/jobs?company=${encodeURIComponent(office.name)}`}
                            className="mt-auto inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-primary/30 text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all"
                        >
                            شوف وظايف المكتب
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-slate-500 text-lg">مفيش مكاتب بالاسم ده</p>
                </div>
            )}
        </>
    );
}
