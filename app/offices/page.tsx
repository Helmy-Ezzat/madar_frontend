export const dynamic = 'force-dynamic';

import { getOffices } from "@/services/officeService";
import { pluralAr, nouns } from "@/lib/arabicPlural";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OfficesGrid from "./OfficesGrid";

export default async function OfficesPage() {
    const offices = await getOffices();
    const totalJobs = offices.reduce((sum, o) => sum + o.jobCount, 0);

    return (
        <main className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                        المكاتب المتاحة
                    </h1>
                    <p className="text-slate-600">
                        تصفح جميع مكاتب إلحاق العمالة التي نجمع منها الوظائف
                    </p>
                </div>

                {/* Stats */}
                <div className="bg-white border border-border-light shadow-sm rounded-2xl py-4 mb-10 grid grid-cols-2 divide-x divide-x-reverse divide-border-light max-w-md mx-auto">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{offices.length}</p>
                        <p className="text-slate-500 text-sm">
                            {pluralAr(offices.length, nouns.office, { alwaysShowNumber: false })}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                            {totalJobs.toLocaleString("en-US")}
                        </p>
                        <p className="text-slate-500 text-sm">
                            {pluralAr(totalJobs, nouns.job, { alwaysShowNumber: false })} متاحة
                        </p>
                    </div>
                </div>

                <OfficesGrid offices={offices} />

                {/* Bottom CTA */}
                <div className="text-center mt-12">
                    <Link
                        href="/jobs"
                        className="inline-flex items-center gap-2 py-3 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
                    >
                        تصفح كل الوظايف
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
