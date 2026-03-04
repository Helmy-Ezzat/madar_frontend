'use client';

import Radio from '@/components/Radio';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DateFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentFilter = searchParams.get('date_posted') || 'all';

    const options = [
        { label: 'الكل', value: 'all' },
        { label: 'خلال ال24 ساعة الماضية', value: '24h' },
        { label: 'خلال ال7 أيام الماضية', value: '7d' },
        { label: 'خلال 30 يوما الماضية', value: '30d' },
    ];

    const setDateFilter = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === 'all') {
            params.delete('date_posted');
        } else {
            params.set('date_posted', value);
        }

        // Reset page to 1
        params.set('page', '1');

        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <>
            {options.map((option) => (
                <div
                    key={option.value}
                    onClick={() => setDateFilter(option.value)}
                    className={`px-5 py-2 flex items-center gap-2 cursor-pointer transition-colors ${currentFilter === option.value ? 'bg-primary2/5' : 'hover:bg-slate-50'}`}
                >
                    <Radio
                        label={option.label}
                        checked={currentFilter === option.value}
                        onChange={() => setDateFilter(option.value)}
                        className={currentFilter === option.value ? 'border-primary2' : ''}
                    />
                </div>
            ))}
        </>
    );
}
