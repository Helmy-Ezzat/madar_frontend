function ApplicationCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-border p-4 flex flex-col gap-2 animate-pulse">
            <div className="flex items-start justify-between gap-3">
                <div className="h-5 bg-gray-200 rounded-md w-40" />
                <div className="h-6 bg-gray-100 rounded-full w-20 shrink-0" />
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-100 rounded-full" />
                    <div className="h-4 bg-gray-100 rounded-md w-24" />
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-100 rounded-full" />
                    <div className="h-4 bg-gray-100 rounded-md w-20" />
                </div>
            </div>
            <div className="h-3 bg-gray-50 rounded-md w-28" />
        </div>
    );
}

export default function ApplicationsSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
                <ApplicationCardSkeleton key={i} />
            ))}
        </div>
    );
}
