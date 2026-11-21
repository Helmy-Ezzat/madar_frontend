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
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-text-main mb-2">
                        المكاتب المتاحة
                    </h1>
                    <p className="text-text-body text-sm md:text-base mb-1">
                        تصفح جميع مكاتب إلحاق العمالة التي نجمع منها الوظائف
                    </p>
                    <p className="text-text-muted text-sm">
                        <strong className="text-text-main font-bold">{offices.length}</strong>{" "}
                        {pluralAr(offices.length, nouns.office, { alwaysShowNumber: false })}
                        <span className="mx-1.5">·</span>
                        <strong className="text-text-main font-bold">{totalJobs.toLocaleString("en-US")}</strong>{" "}
                        {pluralAr(totalJobs, nouns.job, { alwaysShowNumber: false })} متاحة
                    </p>
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
