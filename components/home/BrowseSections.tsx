import Link from "next/link";
import { getSpecializations } from "@/services/specializationService";
import { MapPin, Tags } from "lucide-react";

const countries = [
    "السعودية",
    "الإمارات",
    "قطر",
    "الكويت",
    "عُمان",
    "البحرين",
    "ليبيا",
    "الأردن",
];

export default async function BrowseSections() {
    const specializations = (await getSpecializations()).slice(0, 8);

    return (
        <section className="py-16 px-4 bg-surface" aria-labelledby="browse-heading">
            <div className="max-w-6xl mx-auto flex flex-col gap-14">
                {/* Specializations */}
                <div>
                    <div className="text-center mb-10">
                        <h2 id="browse-heading" className="text-2xl md:text-4xl font-bold text-text-main mb-4">
                            تصفح حسب <span className="text-primary">التخصص</span>
                        </h2>
                        <p className="text-text-body text-lg max-w-2xl mx-auto">
                            اختار مجالك وشوف كل الفرص المتاحة فيه
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {specializations.map((spec) => (
                            <Link
                                key={spec.name}
                                href={`/jobs?specialization=${encodeURIComponent(spec.name)}`}
                                className="bg-white border border-border rounded-xl p-5 flex items-center gap-3 hover:border-primary hover:shadow-md transition-all duration-200"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Tags className="w-5 h-5" strokeWidth={1.8} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-text-main text-sm md:text-base truncate">
                                        {spec.name}
                                    </span>
                                    <span className="text-xs text-text-muted">
                                        {spec.count.toLocaleString("en-US")} وظيفة
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Countries */}
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-4xl font-bold text-text-main mb-4">
                            وظائف في <span className="text-primary">دول الخليج</span> وأكتر
                        </h2>
                        <p className="text-text-body text-lg max-w-2xl mx-auto">
                            مدار بيغطي فرص العمل في أهم الدول اللي بيسافر لها المصريين
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {countries.map((country) => (
                            <Link
                                key={country}
                                href={`/jobs?location=${encodeURIComponent(country)}`}
                                className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-5 py-3 text-sm md:text-base font-semibold text-text-main hover:border-primary hover:text-primary hover:shadow-md transition-all duration-200"
                            >
                                <MapPin className="w-4 h-4" />
                                {country}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
