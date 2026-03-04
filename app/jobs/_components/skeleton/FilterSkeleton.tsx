export default function FilterSkeleton() {
    return (
        <aside className="hidden lg:flex flex-col h-[724px] bg-white border-t-4 border-primary2 rounded-xl shadow-xl divide-y divide-grey-icon animate-pulse">
            <div className="p-5">
                <div className="h-6 bg-gray-200 rounded-md w-32" />
            </div>

            <div className="flex-1 overflow-hidden p-5 flex flex-col gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-4">
                        {/* Section Title */}
                        <div className="h-4 bg-gray-200 rounded-md w-24" />

                        {/* Checkboxes */}
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3, 4].map((j) => (
                                <div key={j} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-gray-100 rounded border border-gray-200" />
                                        <div className="h-3 bg-gray-100 rounded-md w-24" />
                                    </div>
                                    <div className="h-3 bg-gray-50 rounded-md w-4" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
