"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Search, ArrowLeft } from "lucide-react";
import Input from "@/components/Input";
import { pluralAr, nouns } from "@/lib/arabicPlural";

interface Office {
    name: string;
    license_number: string;
    description: string;
    jobCount: number;
}

export default function OfficesGrid({ offices }: { offices: Office[] }) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim();
        if (!q) return offices;
        return offices.filter((o) => o.name.includes(q));
    }, [offices, query]);

    return (
        <>
            <div className="mb-6 max-w-md">
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ابحث عن مكتب بالاسم..."
                    startAccessory={
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    }
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((office) => (
                    <Link
                        key={office.name}
                        href={`/jobs?company=${encodeURIComponent(office.name)}`}
                        className="group relative px-5 py-4 flex flex-col gap-1.5 bg-white shadow-sm rounded-2xl transition-all duration-200 hover:shadow-md hover:bg-[#F5F6F7]"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 min-w-0">
                                <strong className="text-base font-bold text-text-main truncate">
                                    {office.name}
                                </strong>
                                <BadgeCheck className="w-4 h-4 text-primary shrink-0" strokeWidth={3} />
                            </div>
                            <span className="text-[#27AA40] text-sm font-bold shrink-0">
                                {pluralAr(office.jobCount, nouns.job)} متاحة
                            </span>
                        </div>
                        <span className="text-[#828A93] text-xs">
                            (ترخيص رقم {office.license_number})
                        </span>
                        <p className="text-sm text-slate-600 line-clamp-1">
                            {office.description}
                        </p>
                        <ArrowLeft className="w-4 h-4 text-primary absolute bottom-4 left-5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
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
