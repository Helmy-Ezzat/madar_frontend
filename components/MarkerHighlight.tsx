export default function MarkerHighlight({ children }: { children: React.ReactNode }) {
    return (
        <span className="relative inline-block px-1">
            {/* hand-drawn marker highlight behind the keyword */}
            <svg
                className="absolute inset-x-0 bottom-0 w-full h-[65%] text-primary/15"
                viewBox="0 0 100 30"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path d="M1 22 C 18 8, 48 4, 99 10 L 97 26 C 60 30, 24 30, 1 27 Z" fill="currentColor" />
            </svg>
            <span className="relative z-10 text-primary">{children}</span>
            <svg
                className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-primary/30"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
        </span>
    );
}
