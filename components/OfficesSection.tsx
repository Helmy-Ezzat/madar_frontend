import Link from "next/link";
import { getOffices } from "@/services/officeService";
import { pluralAr, nouns } from "@/lib/arabicPlural";
import MarkerHighlight from "./MarkerHighlight";

export default async function OfficesSection() {
    const offices = await getOffices();
    const displayedOffices = offices.slice(0, 8);

    return (
        <section className="py-16 px-4 bg-background" aria-labelledby="offices-heading">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2
                        id="offices-heading"
                        className="text-2xl md:text-4xl font-bold text-text-main mb-4"
                    >
                        من هي المكاتب التي توظف على{" "}
                        <MarkerHighlight>مدار</MarkerHighlight>؟
                    </h2>
                    <p className="text-text-body text-lg max-w-2xl mx-auto">
                        نجمع لك وظائف من أفضل مكاتب إلحاق العمالة المعتمدة والموثوقة
                    </p>
                </div>

                {/* Offices Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {displayedOffices.map((office) => (
                        <Link
                            key={office.name}
                            href={`/jobs?company=${encodeURIComponent(office.name)}`}
                            className="block bg-surface border border-border rounded-xl p-5 text-center hover:border-primary hover:shadow-md transition-all duration-200"
                        >
                            <h3 className="font-semibold text-text-main text-sm md:text-base mb-2 line-clamp-2">
                                {office.name}
                            </h3>
                            <p className="text-xs md:text-sm text-text-muted">
                                {pluralAr(office.jobCount, nouns.job)}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* View All Link */}
                {offices.length > 8 && (
                    <div className="text-center">
                        <Link
                            href="/jobs"
                            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                        >
                            تصفح كل الوظايف
                            <span aria-hidden="true">←</span>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
