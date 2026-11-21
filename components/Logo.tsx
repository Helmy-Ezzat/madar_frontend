// Madar brand lockup: orbit mark + wordmark. Used in the navbar, sidebar and footer.

export function OrbitMark({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
            <circle cx="24" cy="24" r="9" fill="#2352FF" />
            <ellipse
                cx="24"
                cy="24"
                rx="20"
                ry="10.5"
                stroke="#2352FF"
                strokeWidth="4.5"
                transform="rotate(-25 24 24)"
            />
        </svg>
    );
}

export default function Logo({ dark = false }: { dark?: boolean }) {
    return (
        <span className="inline-flex items-center gap-2">
            <OrbitMark className="w-8 h-8" />
            <span className={`text-xl font-bold ${dark ? "text-primary" : "text-white"}`}>
                مدار
            </span>
        </span>
    );
}
