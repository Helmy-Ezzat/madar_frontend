export const dynamic = 'force-dynamic';

import { getOffices } from "@/services/officeService";
import Link from "next/link";


export default async function OfficesPage() {
    const offices = await getOffices();
    console.log(offices);


    return (
        <main className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                        المكاتب المتاحة
                    </h1>
                    <p className="text-slate-600 text-lg">
                        تصفح جميع مكاتب إلحاق العمالة التي نجمع منها الوظائف
                    </p>
                </div>

                {/* Stats */}
                <div className="bg-primary2/5 rounded-2xl p-6 mb-12 flex flex-wrap gap-8 justify-center">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-primary2">{offices.length}</p>
                        <p className="text-slate-600">مكتب</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-primary2">
                            {offices.reduce((sum, o) => sum + o.jobCount, 0)}
                        </p>
                        <p className="text-slate-600">وظيفة متاحة</p>
                    </div>
                </div>

                {/* Offices Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offices.map((office) => (
                        <div
                            key={office.name}
                            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-primary2 hover:shadow-lg transition-all duration-200"
                        >
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <h1 className="font-semibold text-slate-800 text-lg md:text-xl">
                                        {office.name}
                                    </h1>
                                    <p className="text-slate-500 font-medium text-sm">
                                        {office.jobCount} وظيفة متاحة
                                    </p>
                                </div>
                                <div className="bg-primary2/10 rounded-xl flex items-center justify-center gap-2 px-2 py-1">
                                    <span className="text-slate-500 text-xs md:text-sm">ترخيص رقم</span>
                                    <span className="text-primary2 font-bold text-xs md:text-sm">
                                        {office.license_number}
                                    </span>
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm">{office.description}</p>
                            {/* <Link
                                href={`/jobs?q=${encodeURIComponent(office.name)}`}
                                className="mt-4 inline-flex items-center gap-2 text-primary2 text-sm font-medium hover:underline"
                            >
                                عرض الوظائف
                                <span aria-hidden="true">←</span>
                            </Link> */}
                        </div>
                    ))}
                </div>

                {offices.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-slate-500 text-lg">لا توجد مكاتب متاحة حالياً</p>
                    </div>
                )}
            </div>
        </main>
    );
}
