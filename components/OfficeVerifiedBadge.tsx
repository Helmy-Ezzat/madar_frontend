import { ShieldCheck } from "lucide-react";

export default function OfficeVerifiedBadge({ className = "" }: { className?: string }) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full bg-primary-tint text-primary text-[11px] font-bold px-2.5 py-1 w-fit ${className}`}
        >
            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
            مكتب إلحاق عمالة معتمد
        </span>
    );
}
