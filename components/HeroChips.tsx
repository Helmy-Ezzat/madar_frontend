import Link from "next/link";
import { getSpecializations } from "@/services/specializationService";
import { getLocations } from "@/services/locationService";

/** Quick-search chips: top cities + top titles, one tap to search. */
export default async function HeroChips() {
    const [specializations, locations] = await Promise.all([
        getSpecializations(),
        getLocations(),
    ]);

    // Cities only for the chips: drop country-level buckets, shorten
    // "الرياض، المملكة العربية السعودية" to "الرياض", and dedupe by short name.
    const countryNames = new Set([
        "المملكة العربية السعودية", "السعودية", "مصر", "سلطنة عمان", "سلطنه عمان", "عمان",
        "الإمارات", "الإمارات العربية المتحدة", "الكويت", "قطر", "البحرين", "الأردن", "ليبيا", "العراق",
    ]);
    const cityChips: { label: string; href: string }[] = [];
    const seenCities = new Set<string>();
    for (const l of locations) {
        const short = l.name.split("،")[0].trim();
        if (countryNames.has(l.name.trim()) || countryNames.has(short) || seenCities.has(short)) continue;
        seenCities.add(short);
        cityChips.push({ label: short, href: `/jobs?location=${encodeURIComponent(short)}` });
        if (cityChips.length === 3) break;
    }

    const quickChips = [
        ...cityChips,
        ...specializations.slice(0, 4).map((s) => ({
            label: s.name,
            href: `/jobs?specialization=${encodeURIComponent(s.name)}`,
        })),
    ];

    if (quickChips.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl -mt-2">
            {quickChips.map((chip) => (
                <Link
                    key={chip.href}
                    href={chip.href}
                    className="text-xs md:text-sm text-text-body bg-white/70 border border-slate-200 rounded-full px-3.5 py-1.5 hover:border-primary hover:text-primary transition-colors"
                >
                    {chip.label}
                </Link>
            ))}
        </div>
    );
}
