export default function JobCardSkeleton() {
    return (
        <div className="relative px-5 py-2.5 flex flex-col gap-2.5 bg-white shadow-sm rounded-2xl animate-pulse border-b border-gray-50 last:border-0">
            <div className="flex flex-col gap-2.5">
                {/* Job Titles (JobCardTitle skeleton) */}
                <div className="flex flex-wrap gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-24" />
                    <div className="h-6 bg-gray-200 rounded-full w-20" />
                </div>

                {/* Company Info */}
                <div className="flex items-center gap-1">
                    {/* Logo placeholder */}
                    <div className="w-14 aspect-square shrink-0 rounded-full bg-gray-200 border border-gray-100" />

                    <div className="flex flex-col gap-1.5 w-full">
                        {/* Company Name & Badge */}
                        <div className="flex items-center gap-1">
                            <div className="h-5 bg-gray-200 rounded-md w-32" />
                            <div className="w-4 h-4 bg-gray-200 rounded-full" />
                        </div>
                        {/* License Number */}
                        <div className="h-3 bg-gray-100 rounded-md w-24" />
                    </div>
                </div>

                {/* Summary */}
                <div className="flex flex-col gap-2">
                    <div className="h-4 bg-gray-100 rounded-md w-full" />
                    <div className="h-4 bg-gray-100 rounded-md w-5/6" />
                </div>

                {/* Salary & Location */}
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-gray-100 rounded-full" />
                        <div className="h-4 bg-gray-100 rounded-md w-16" />
                        <div className="h-3 bg-gray-50 rounded-md w-20" />
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-gray-100 rounded-full" />
                        <div className="h-4 bg-gray-100 rounded-md w-16" />
                        <div className="h-3 bg-gray-50 rounded-md w-20" />
                    </div>
                </div>

                {/* Footer (Time & Telegram Button) */}
                <div className="flex items-center justify-between">
                    <div className="h-4 bg-green-50 rounded-md w-20" />
                    <div className="h-8 bg-gray-200 rounded-lg w-24" />
                </div>
            </div>
        </div>
    );
}
