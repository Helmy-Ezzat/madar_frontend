import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchInput from "./SearchInput";
import MarkerHighlight from "./MarkerHighlight";
import { getSpecializations } from "@/services/specializationService";
import { getLocations } from "@/services/locationService";

export default async function Hero() {
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

    return (
        <main className="grid grid-cols-1 lg:grid-cols-2 px-4 sm:px-6 lg:px-8 md:min-h-screen -mt-24 pt-24 md:-mt-20 md:pt-20 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
            <div className="flex md:hidden items-center justify-center">
                <Image
                    src="/undraw_searching-everywhere_tffi.svg"
                    alt="The Search"
                    className="drop-shadow-xl "
                    width={200}
                    height={200}
                />
            </div>
            <section
                className="flex flex-col gap-6 sm:gap-8 items-center md:justify-center   py-12 sm:py-16 lg:py-12"
                aria-labelledby="hero-heading"
            >
                {/* Main Heading */}
                <h1
                    id="hero-heading"
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center leading-snug sm:leading-snug md:leading-snug"
                >
                    <span className="text-text-main">كل </span>
                    <span className="text-primary">
                        وظائف مكاتب إلحاق العمالة المصرية بالخارج
                    </span>
                    <br />
                    <span className="text-text-main">في </span>
<MarkerHighlight>مكان واحد</MarkerHighlight>
                </h1>

                {/* Description */}
                <p className="text-text-body text-base sm:text-lg md:text-xl text-center font-normal max-w-2xl px-2">
                    مش محتاج تتابع 50 قناة على تليجرام وفيسبوك.
                    <strong className="font-semibold text-text-main"> مدار</strong> بيجمعلك وظايف القنوات، وكمان المكاتب بتنزل وظايفها عندنا مباشرة.
                </p>

                {/* Search */}
                <div className="w-full max-w-xl">
                    <Suspense fallback={<div className="h-[45px] w-full rounded-lg bg-surface-hover animate-pulse" />}>
                        <SearchInput />
                    </Suspense>
                </div>

                {/* Quick-search chips: top cities + top titles, one tap to search */}
                {quickChips.length > 0 && (
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
                )}

                <Link
                        href="/jobs"
                        className="group border-2 border-primary text-primary px-8 py-3.5 rounded-2xl font-bold text-lg hover:bg-primary hover:text-white transition-all inline-flex items-center gap-3"
                    >
                        <span>عرض جميع الوظائف</span>
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                <Link
                    href="/register?type=office"
                    className="text-sm md:text-base font-semibold text-primary hover:underline -mt-2"
                >
                    للمكاتب: انشر وظايفك مجاناً لفترة محدودة
                </Link>
            </section>
            <div className="hidden lg:flex items-center justify-center">
                <Image
                    src="/undraw_the-search_cjxa.svg"
                    alt="The Search"
                    className="drop-shadow-xl w-full h-auto max-w-md xl:max-w-lg"
                    width={256}
                    height={192}
                />
            </div>
        </main>
    );
}
