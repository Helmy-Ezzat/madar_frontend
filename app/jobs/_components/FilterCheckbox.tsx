'use client';

import Checkbox from '@/components/Checkbox';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface FilterCheckboxProps {
    label: string;
    count?: number;
    value: string;
    paramName: string;
}

export default function FilterCheckbox({ label, count, value, paramName }: FilterCheckboxProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const isChecked = searchParams.get(paramName) === value;

    const toggleFilter = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (isChecked) {
            params.delete(paramName);
        } else {
            params.set(paramName, value);
        }

        // Reset page to 1 when filtering
        params.set('page', '1');

        router.push(`?${params.toString()}`, { scroll: false });
    }, [isChecked, paramName, value, searchParams, router]);

    return (
        <div
            onClick={toggleFilter}
            className={`px-5 py-2 flex items-center justify-between cursor-pointer transition-colors ${isChecked ? 'bg-primary2/5' : 'hover:bg-slate-50'}`}
        >
            <div className="flex items-center gap-2">
                <Checkbox checked={isChecked} onChange={toggleFilter} />
                <span className={`text-sm ${isChecked ? 'text-primary2 font-semibold' : 'text-primary2'}`}>{label}</span>
            </div>
            {count !== undefined && <span className="text-xs text-[#828A93]">({count})</span>}
        </div>
    );
}
