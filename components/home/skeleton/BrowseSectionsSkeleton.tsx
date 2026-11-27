export default function BrowseSectionsSkeleton() {
    return (
        <section className="py-16 px-4 bg-background" aria-hidden="true">
            <div className="max-w-6xl mx-auto flex flex-col gap-14">
                <div>
                    <div className="text-center mb-10 flex flex-col items-center gap-4 animate-pulse">
                        <div className="h-8 md:h-10 bg-gray-200 rounded-md w-56" />
                        <div className="h-5 bg-gray-100 rounded-md w-72 max-w-full" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div
                                key={i}
                                className="bg-surface border border-border rounded-xl p-5 flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
                                <div className="flex flex-col gap-1.5 min-w-0 w-full">
                                    <div className="h-4 bg-gray-200 rounded-md w-4/5" />
                                    <div className="h-3 bg-gray-50 rounded-md w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
