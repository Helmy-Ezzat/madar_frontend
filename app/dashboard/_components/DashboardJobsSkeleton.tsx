function DashboardJobSkeleton() {
    return (
        <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3 animate-pulse">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="h-5 bg-gray-200 rounded-md w-36" />
                    <div className="h-5 bg-gray-100 rounded-full w-14" />
                </div>
                <div className="h-4 bg-gray-100 rounded-md w-16" />
            </div>
            <div className="h-4 bg-gray-100 rounded-md w-full" />
            <div className="h-4 bg-gray-100 rounded-md w-2/3" />
            <div className="flex items-center gap-2 pt-1">
                <div className="h-8 bg-gray-100 rounded-lg w-20" />
                <div className="h-8 bg-gray-100 rounded-lg w-20" />
            </div>
        </div>
    );
}

export default function DashboardJobsSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
                <DashboardJobSkeleton key={i} />
            ))}
        </div>
    );
}
