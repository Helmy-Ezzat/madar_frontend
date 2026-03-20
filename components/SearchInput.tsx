"use client";

import { useId, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Input from "./Input";
import { SearchIcon, X } from "lucide-react";

export default function SearchInput(props: React.ComponentProps<typeof Input> & { className?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace, push } = useRouter();
    const inputId = useId();

    const initialQuery = searchParams.get("q")?.toString() || "";
    const [term, setTerm] = useState(initialQuery);

    useEffect(() => {
        setTerm(initialQuery);
    }, [initialQuery]);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();

        const params = new URLSearchParams(searchParams);
        const cleanTerm = term.trim();

        if (cleanTerm) {
            params.set("q", cleanTerm);
        } else {
            params.delete("q");
        }

        params.set("page", "1");
        const newUrl = `/jobs?${params.toString()}`;

        if (pathname === "/jobs") {
            replace(newUrl);
        } else {
            push(newUrl);
        }
    };

    const handleClear = () => {
        setTerm("");
        const params = new URLSearchParams(searchParams);
        params.delete("q");
        params.set("page", "1");

        if (pathname === "/jobs") {
            replace(`/jobs?${params.toString()}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className={`flex items-center gap-2 w-full group ${props.className}`}>
            <label htmlFor={inputId} className="sr-only">
                البحث عن وظائف
            </label>

            <div className="relative flex-1 flex items-center">
                <SearchIcon className="absolute right-3 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors z-10" />

                <Input
                    {...props}
                    id={inputId}
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
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
            </div>

            <button
                type="submit"
                className="bg-primary text-white h-[45px] px-4 md:px-8 rounded-l-lg font-bold whitespace-nowrap hover:bg-primary/90 transition-all text-sm md:text-base shadow-md"            >
                بحث
            </button>
        </form>
    );
}