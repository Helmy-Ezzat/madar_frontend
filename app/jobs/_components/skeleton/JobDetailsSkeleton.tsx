export default function JobDetailsSkeleton() {
    return (
        <aside data-modal="job-details" className="fixed inset-0 z-50 bg-white lg:border-t-4 lg:border-primary lg:sticky lg:top-24 lg:h-205 lg:rounded-xl lg:shadow-xl lg:inset-auto lg:z-0 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex flex-col gap-5 border-b border-icon-bg pb-5 p-5">
                <div className="flex justify-between items-start">
                    {/* Title */}
                    <div className="h-7 bg-gray-200 rounded-md w-3/4" />
                    {/* Close Button placeholder */}
                    <div className="w-10 h-10 bg-gray-50 rounded-full border border-gray-100" />
                </div>

                {/* Company Info */}
                <div className="flex items-center gap-2.5">
                    <div className="w-14 aspect-square shrink-0 rounded-full bg-gray-200 border border-gray-100" />
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-1">
                            <div className="h-5 bg-gray-200 rounded-md w-1/3" />
                            <div className="w-4 h-4 bg-gray-200 rounded-full" />
                        </div>
                        <div className="h-3 bg-gray-100 rounded-md w-1/4" />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <div className="h-5 bg-green-50 rounded-md w-24" />
                    <div className="h-10 bg-gray-200 rounded-lg w-full" />
                </div>
            </header>

            {/* Description lines */}
            <div className="p-5 flex flex-col gap-3 overflow-y-auto">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-50 rounded w-4/5" />
                <div className="h-4 bg-gray-50 rounded w-full" />
                <div className="h-4 bg-gray-50 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-full mt-4" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="h-4 bg-gray-100 rounded w-full" />
            </div>
        </aside>
    );
}
