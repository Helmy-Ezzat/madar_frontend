import { formatDistanceToNowStrict } from 'date-fns';
import { ar } from 'date-fns/locale';

/**
 * Formats a date to a relative time string in Arabic (e.g., "منذ ساعة").
 */
export function fromNow(date: string | number | Date): string {
    if (!date) return 'غير محدد';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return formatDistanceToNowStrict(dateObj, {
        addSuffix: true,
        locale: ar,
    });
}
