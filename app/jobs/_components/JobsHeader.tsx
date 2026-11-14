'use client';

import ActiveFilters from "./ActiveFilters";
import { pluralAr, nouns } from "@/lib/arabicPlural";

export default function JobsHeader({ total }: { total: number }) {
    return (
        <header className="flex flex-col gap-1 p-5 pb-4 bg-white shadow-sm rounded-2xl">
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">الوظائف المتاحة</h1>
            <p className="text-sm text-slate-500 font-medium">
                {total === 0 ? (
                    "لم يتم العثور على أي وظائف"
                ) : (
                    <>
                        تم العثور على <span className="text-primary font-bold">{pluralAr(total, nouns.jobGenitive)}</span>
                    </>
                )}
            </p>
            <div className="hidden md:block">
                <ActiveFilters />
            </div>
        </header>
    );
}
