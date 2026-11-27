import { pluralAr, unitsRelative } from './arabicPlural';

/**
 * Formats a date to a relative time string in Arabic (e.g., "منذ ساعة", "منذ يومين", "منذ 3 ساعات").
 */
export function fromNow(date: string | number | Date): string {
    if (!date) return 'غير محدد';

    const timeMs = typeof date === 'string' ? new Date(date).getTime() : typeof date === 'number' ? date : date.getTime();
    const now = Date.now();
    const diffInSeconds = Math.max(0, Math.floor((now - timeMs) / 1000));

    if (diffInSeconds < 60) return 'الآن';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `منذ ${pluralAr(diffInMinutes, unitsRelative.minute)}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `منذ ${pluralAr(diffInHours, unitsRelative.hour)}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `منذ ${pluralAr(diffInDays, unitsRelative.day)}`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `منذ ${pluralAr(diffInWeeks, unitsRelative.week)}`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `منذ ${pluralAr(diffInMonths, unitsRelative.month)}`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `منذ ${pluralAr(diffInYears, unitsRelative.year)}`;
}
