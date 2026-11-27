function AdminRowSkeleton() {
    return (
        <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3 animate-pulse">
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5 w-full">
                    <div className="h-5 bg-gray-200 rounded-md w-44" />
                    <div className="h-3.5 bg-gray-100 rounded-md w-32" />
                </div>
                <div className="h-5 bg-gray-100 rounded-full w-16 shrink-0" />
            </div>
            <div className="h-4 bg-gray-100 rounded-md w-5/6" />
            <div className="flex items-center gap-2 pt-1">
                <div className="h-8 bg-gray-100 rounded-lg w-20" />
                <div className="h-8 bg-gray-100 rounded-lg w-20" />
            </div>
        </div>
    );
}

export default function AdminListSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
                <AdminRowSkeleton key={i} />
            ))}
        </div>
    );
}
