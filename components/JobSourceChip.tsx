interface JobSourceChipProps {
    postedBy?: string;
}

// Where did this job come from: posted through Madar by an office, or aggregated from an external source
export default function JobSourceChip({ postedBy }: JobSourceChipProps) {
    if (postedBy) {
        return (
            <span className="rounded-full bg-primary-tint text-primary text-[11px] font-bold px-2.5 py-0.5">
                منشورة عبر مدار
            </span>
        );
    }
    return (
        <span className="rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold px-2.5 py-0.5">
            من مصدر خارجي
        </span>
    );
}
