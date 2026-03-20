import Link from "next/link";
import Image from "next/image";

export default function Hero() {
    return (
        <main className="grid grid-cols-1 lg:grid-cols-2 px-4 sm:px-6 lg:px-8 md:min-h-screen">
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
                    <span className="relative inline-block">
                        <span className="relative z-10 text-primary">مكان واحد</span>
                        <svg
                            className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-primary/30"
                            viewBox="0 0 100 20"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="4" fill="none" />
                        </svg>
                    </span>
                </h1>

                {/* Description */}
                <p className="text-text-body text-base sm:text-lg md:text-xl text-center font-normal max-w-2xl px-2">
                    خلاص مش محتاج تتابع 50 قناة على تليجرام وفيسبوك,
                    <strong className="font-semibold text-text-main"> مدار</strong> جمعلك كل الوظائف المتاحة في مكان واحد.
                </p>

                <Link
                        href="/jobs"
                        className="group bg-primary text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-primary/90 transition-all hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3"
                    >
                        <span>عرض جميع الوظائف</span>
                        <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
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