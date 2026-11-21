"use client";

import { useId, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Input from "./Input";
import { SearchIcon, X, MapPin } from "lucide-react";

interface Suggestion {
    name: string;
    count: number;
}

interface Suggestions {
    titles: Suggestion[];
    locations: Suggestion[];
}

const EMPTY: Suggestions = { titles: [], locations: [] };

export default function SearchInput(props: React.ComponentProps<typeof Input> & { className?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace, push } = useRouter();
    const inputId = useId();
    const listboxId = useId();

    const qParam = searchParams.get("q") || "";
    const specParam = searchParams.get("specialization") || "";
    const locParam = searchParams.get("location") || "";
    // When a suggestion/chip filter is active (no q), show its value in the box.
    const initialQuery = qParam || specParam || locParam;
    const [term, setTerm] = useState(initialQuery);
    const [suggestions, setSuggestions] = useState<Suggestions>(EMPTY);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const requestIdRef = useRef(0);
    const userTypedRef = useRef(false); // autocomplete only after the user types, not when the URL prefills the box

    useEffect(() => {
        setTerm(initialQuery);
    }, [initialQuery]);

    // True when the box is just mirroring an active suggestion/chip filter — a
    // manual search or clear then replaces that filter instead of stacking on it.
    const mirrorsPickedFilter = () => {
        const clean = term.trim();
        return !qParam && clean !== "" && (clean === specParam || clean === locParam);
    };

    // Debounced autocomplete fetch
    useEffect(() => {
        const cleanTerm = term.trim();
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (cleanTerm.length < 2 || !userTypedRef.current) {
            setSuggestions(EMPTY);
            setOpen(false);
            setActiveIndex(-1);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            const requestId = ++requestIdRef.current;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/suggest?q=${encodeURIComponent(cleanTerm)}`);
                if (!res.ok) return;
                const json = await res.json();
                if (requestId !== requestIdRef.current) return;
                const data: Suggestions = json.data ?? EMPTY;
                setSuggestions(data);
                setOpen(data.titles.length + data.locations.length > 0);
                setActiveIndex(-1);
            } catch {
                // Network hiccup: autocomplete silently stays closed
            }
        }, 250);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [term]);

    // Close the dropdown on outside click
    useEffect(() => {
        const onPointerDown = (e: PointerEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, []);

    // Flat list for keyboard navigation: titles first, then locations
    const flatItems: ({ kind: "title" | "location" } & Suggestion)[] = [
        ...suggestions.titles.map((s) => ({ kind: "title" as const, ...s })),
        ...suggestions.locations.map((s) => ({ kind: "location" as const, ...s })),
    ];

    const goToJobs = (params: URLSearchParams) => {
        params.set("page", "1");
        const newUrl = `/jobs?${params.toString()}`;
        if (pathname === "/jobs") {
            replace(newUrl);
        } else {
            push(newUrl);
        }
    };

    const pickSuggestion = (item: (typeof flatItems)[number]) => {
        const params = new URLSearchParams(searchParams);
        // q (Atlas text search) doesn't cover the location field, so picks use
        // the exact filter params instead of a text search.
        params.delete("q");
        if (item.kind === "title") {
            params.delete("location");
            params.set("specialization", item.name);
        } else {
            params.delete("specialization");
            params.set("location", item.name);
        }
        setTerm(item.name);
        setOpen(false);
        setActiveIndex(-1);
        goToJobs(params);
    };

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (open && activeIndex >= 0 && flatItems[activeIndex]) {
            pickSuggestion(flatItems[activeIndex]);
            return;
        }

        const params = new URLSearchParams(searchParams);
        const cleanTerm = term.trim();

        // A manual text search replaces a mirrored suggestion/chip filter
        if (mirrorsPickedFilter()) {
            params.delete("specialization");
            params.delete("location");
        }

        if (cleanTerm) {
            params.set("q", cleanTerm);
        } else {
            params.delete("q");
        }

        setOpen(false);
        setActiveIndex(-1);
        goToJobs(params);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open || flatItems.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % flatItems.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => (i <= 0 ? flatItems.length - 1 : i - 1));
        } else if (e.key === "Escape") {
            setOpen(false);
            setActiveIndex(-1);
        }
    };

    const handleClear = () => {
        setTerm("");
        setSuggestions(EMPTY);
        setOpen(false);
        setActiveIndex(-1);
        const params = new URLSearchParams(searchParams);
        params.delete("q");
        if (mirrorsPickedFilter()) {
            params.delete("specialization");
            params.delete("location");
        }
        params.set("page", "1");

        if (pathname === "/jobs") {
            replace(`/jobs?${params.toString()}`);
        }
    };

    let optionIndex = -1;
    const renderOption = (item: (typeof flatItems)[number]) => {
        optionIndex += 1;
        const index = optionIndex;
        const active = index === activeIndex;
        return (
            <li key={`${item.kind}-${item.name}`} role="option" id={`${listboxId}-${index}`} aria-selected={active}>
                <button
                    type="button"
                    onClick={() => pickSuggestion(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-right transition-colors ${active ? "bg-surface-hover" : ""}`}
                >
                    <span className="flex items-center gap-2 min-w-0">
                        {item.kind === "location" && <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />}
                        <span className="text-text-main truncate">{item.name}</span>
                    </span>
                    <span className="text-xs text-text-muted whitespace-nowrap">{item.count} وظيفة</span>
                </button>
            </li>
        );
    };

    return (
        <form onSubmit={handleSearch} className={`flex items-center gap-2 w-full group ${props.className}`}>
            <label htmlFor={inputId} className="sr-only">
                البحث عن وظائف
            </label>

            <div ref={containerRef} className="relative flex-1 flex items-center">
                <SearchIcon className="absolute right-3 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors z-10" />

                <Input
                    {...props}
                    id={inputId}
                    value={term}
                    onChange={(e) => {
                        userTypedRef.current = true;
                        setTerm(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (flatItems.length > 0) setOpen(true);
                    }}
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={listboxId}
                    aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
                    autoComplete="off"
                    placeholder="ابحث بالمسمى الوظيفي أو الشركة..."
                    className="w-full h-[45px] pr-10 pl-10 rounded-lg text-sm md:text-base" />

                {term && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute left-3 p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                        aria-label="مسح نص البحث"
                    >
                        <X className="w-6 h-6" />
                    </button>
                )}

                {open && flatItems.length > 0 && (
                    <ul
                        id={listboxId}
                        role="listbox"
                        className="absolute top-full mt-1.5 inset-x-0 z-50 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden py-1 max-h-72 overflow-y-auto"
                    >
                        {suggestions.titles.length > 0 && (
                            <>
                                <li className="px-4 pt-1.5 pb-1 text-[11px] font-semibold text-text-muted">تخصصات</li>
                                {suggestions.titles.map((s) => renderOption({ kind: "title", ...s }))}
                            </>
                        )}
                        {suggestions.locations.length > 0 && (
                            <>
                                <li className="px-4 pt-1.5 pb-1 text-[11px] font-semibold text-text-muted">مدن</li>
                                {suggestions.locations.map((s) => renderOption({ kind: "location", ...s }))}
                            </>
                        )}
                    </ul>
                )}
            </div>

            <button
                type="submit"
                className="bg-primary text-white h-[45px] px-4 md:px-8 rounded-l-lg font-bold whitespace-nowrap hover:bg-primary/90 transition-all text-sm md:text-base shadow-md"            >
                بحث
            </button>
        </form>
    );
}
