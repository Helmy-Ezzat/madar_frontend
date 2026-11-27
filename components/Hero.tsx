import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchInput from "./SearchInput";
import MarkerHighlight from "./MarkerHighlight";
import HeroChips from "./HeroChips";
import HeroChipsSkeleton from "./HeroChipsSkeleton";

export default function Hero() {

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

                {/* Quick-search chips stream in: static hero paints immediately, chips follow */}
                <Suspense fallback={<HeroChipsSkeleton />}>
                    <HeroChips />
                </Suspense>

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
