/** Facebook-style verification seal: blue scalloped badge with a white check. Only for approved offices. */
export default function VerifiedTick({ className = "w-4 h-4", title = "مكتب موثّق" }: { className?: string; title?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={`inline-block shrink-0 ${className}`}
            role="img"
            aria-label={title}
        >
            <title>{title}</title>
            <path
                fill="#1877F2"
                d="M12 1.5l2.4 1.7 2.9-.2 1.2 2.7 2.6 1.3-.2 2.9L22.5 12l-1.6 2.4.2 2.9-2.6 1.3-1.2 2.7-2.9-.2L12 22.5l-2.4-1.7-2.9.2-1.2-2.7-2.6-1.3.2-2.9L1.5 12l1.6-2.4-.2-2.9 2.6-1.3 1.2-2.7 2.9.2L12 1.5z"
            />
            <path d="M7.7 12.3l3 3 5.6-6.2" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
