export default function HeroChipsSkeleton() {
    const widths = ["w-16", "w-20", "w-14", "w-24", "w-20", "w-16", "w-24"];
    return (
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl -mt-2 animate-pulse" aria-hidden="true">
            {widths.map((w, i) => (
                <div
                    key={i}
                    className={`h-[30px] ${w} bg-white/70 border border-slate-200 rounded-full`}
                />
            ))}
        </div>
    );
}
