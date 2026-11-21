import { getJobs } from "@/services/jobService";
import { getOffices } from "@/services/officeService";
import { getSpecializations } from "@/services/specializationService";
import { pluralAr, nouns } from "@/lib/arabicPlural";
import { Briefcase, Building2, Tags } from "lucide-react";

export default async function StatsStrip() {
    const [jobsResponse, offices, specializations] = await Promise.all([
        getJobs({ limit: 1 }),
        getOffices(),
        getSpecializations(),
    ]);

    const stats = [
        {
            icon: Briefcase,
            value: pluralAr(jobsResponse.metadata.total_count, nouns.job),
            label: "متاحة للتقديم",
        },
        {
            icon: Building2,
            value: pluralAr(offices.length, nouns.office),
            label: "إلحاق مرخصة",
        },
        {
            icon: Tags,
            value: pluralAr(specializations.length, nouns.specialization),
            label: "وظيفي على المنصة",
        },
    ];

    return (
        <section className="py-8 px-4 bg-background border-y border-border-light" aria-label="إحصائيات مدار">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-border-light shadow-sm grid grid-cols-3 py-4 md:py-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center text-center gap-1 md:gap-1.5 px-2 [&:not(:first-child)]:border-s [&:not(:first-child)]:border-border-light">
                        <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <stat.icon className="w-4 h-4 md:w-5.5 md:h-5.5" strokeWidth={1.8} />
                        </div>
                        <span className="text-sm md:text-2xl font-bold text-text-main leading-tight">
                            {stat.value}
                        </span>
                        <span className="text-[11px] md:text-sm text-text-muted leading-tight">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
