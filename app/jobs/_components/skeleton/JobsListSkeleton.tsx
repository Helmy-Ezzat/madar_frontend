import JobCardSkeleton from "./JobCardSkeleton";

export default function JobsListSkeleton() {
    return (
        <div className="flex flex-col gap-3 h-fit overflow-hidden divide-y divide-gray-100">
            <div className="p-5 border-b border-gray-100">
                <div className="h-7 bg-gray-200 rounded-md w-40 animate-pulse" />
            </div>
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <JobCardSkeleton key={i} />
            ))}
        </div>
    );
}
