'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

export default function ActiveFilters({ minimal = false }: { minimal?: boolean }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // ... (rest of the logic remains same)
    const filters = [
        { key: 'company', label: 'الشركة' },
        { key: 'location', label: 'الموقع' },
        { key: 'specialization', label: 'التخصص' },
        { key: 'date_posted', label: 'تاريخ النشر' },
    ];

    const dateLabels: Record<string, string> = {
        '24h': 'خلال ال24 ساعة الماضية',
        '7d': 'خلال ال7 أيام الماضية',
        '30d': 'خلال 30 يوما الماضية',
    };

    const activeFilters = filters.flatMap(({ key, label }) => {
        const value = searchParams.get(key);
        if (!value) return [];

        return [{
            key,
            label,
            value,
            displayValue: key === 'date_posted' ? dateLabels[value] || value : value
        }];
    });

    const removeFilter = (key: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(key);
        params.set('page', '1'); // Reset pagination
        router.push(`?${params.toString()}`);
    };

    if (activeFilters.length === 0) return null;

    return (
        <div className={`flex items-center gap-2 ${minimal ? '' : 'px-5 pb-3 mt-4 overflow-x-auto no-scrollbar'}`}>
            {activeFilters.map((filter) => (
                <button
                    key={filter.key}
                    onClick={() => removeFilter(filter.key)}
                    className="flex items-center gap-1.5 bg-primary2/10 text-primary2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors border border-transparent group"
                >
                    <span>{filter.displayValue}</span>
                    <X size={14} className="group-hover:text-red-600" />
                </button>
            ))}

            {activeFilters.length > 1 && (
                <button
                    onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        filters.forEach(f => params.delete(f.key));
                        params.set('page', '1');
                        router.push(`?${params.toString()}`);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-700 underline px-2 whitespace-nowrap"
                >
                    مسح الكل
                </button>
            )}
        </div>
    );
}
