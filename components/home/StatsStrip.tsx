import { getJobs } from "@/services/jobService";
import { getOffices } from "@/services/officeService";
import { getSpecializations } from "@/services/specializationService";
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
            value: jobsResponse.metadata.total_count,
            label: "وظيفة متاحة",
        },
        {
            icon: Building2,
            value: offices.length,
            label: "مكتب إلحاق مرخص",
        },
        {
            icon: Tags,
            value: specializations.length,
            label: "تخصص وظيفي",
        },
    ];

    return (
        <section className="py-10 px-4 bg-background border-y border-border-light" aria-label="إحصائيات مدار">
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <stat.icon className="w-6 h-6" strokeWidth={1.8} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl md:text-3xl font-bold text-text-main">
                                {stat.value.toLocaleString("en-US")}
                            </span>
                            <span className="text-sm text-text-muted">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
