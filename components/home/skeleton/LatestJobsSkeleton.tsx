function HomeJobCardSkeleton() {
    return (
        <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded-full w-28" />
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded-full shrink-0" />
                <div className="h-4 bg-gray-100 rounded-md w-32" />
            </div>
            <div className="flex flex-col gap-1.5">
                <div className="h-3.5 bg-gray-50 rounded-md w-24" />
                <div className="h-3.5 bg-gray-50 rounded-md w-20" />
            </div>
            <div className="h-3.5 bg-gray-50 rounded-md w-16" />
        </div>
    );
}

export default function LatestJobsSkeleton() {
    return (
        <section className="py-16 px-4 bg-background" aria-hidden="true">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 flex flex-col items-center gap-4 animate-pulse">
                    <div className="h-8 md:h-10 bg-gray-200 rounded-md w-64" />
                    <div className="h-5 bg-gray-100 rounded-md w-80 max-w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <HomeJobCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
