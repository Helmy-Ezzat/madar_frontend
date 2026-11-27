export default function StatsStripSkeleton() {
    return (
        <section className="py-8 px-4 bg-primary-tint border-y border-border-light" aria-hidden="true">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-border-light shadow-sm grid grid-cols-3 py-4 md:py-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="flex flex-col items-center text-center gap-1 md:gap-1.5 px-2 [&:not(:first-child)]:border-s [&:not(:first-child)]:border-border-light"
                    >
                        <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl bg-gray-100" />
                        <div className="h-5 md:h-7 bg-gray-200 rounded-md w-16" />
                        <div className="h-3.5 bg-gray-50 rounded-md w-20" />
                    </div>
                ))}
            </div>
        </section>
    );
}
