import type { Metadata } from "next";
import Image from "next/image";
import MarkerHighlight from "@/components/MarkerHighlight";

export const metadata: Metadata = {
    title: "من نحن",
    description: "مدار منصة تجمع وظائف مكاتب إلحاق العمالة المصرية بالخارج في مكان واحد، لتوفير وقت البحث وسهولة الوصول للفرص الموثوقة.",
    alternates: { canonical: "https://madar-jobs.vercel.app/about" },
};

export default function AboutPage() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="py-16 px-4 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-text-main mb-6">
                        من <MarkerHighlight>نحن</MarkerHighlight>؟
                    </h1>
                    <p className="text-lg md:text-xl text-text-body leading-relaxed">
                        <span className="font-semibold text-primary">مدار</span> هي منصة تهدف إلى تسهيل
                        البحث عن فرص العمل في الخارج للمصريين
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4 bg-background">
                <div className="max-w-5xl mx-auto space-y-24">
                    <div className="flex flex-col items-center gap-12">
                        {/* Problem */}
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 max-w-xs">
                                <Image src="/undraw_too-many-options_lpt0.svg" alt="المشكلة" width={256} height={192} className="drop-shadow-xl" />
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="inline-block px-4 py-1 bg-primary-tint text-primary rounded-full text-sm font-bold">التحدي الحالي</div>
                                <h2 className="text-3xl font-bold text-text-main">تايه وسط <MarkerHighlight>عشرات المكاتب</MarkerHighlight> علي تليجرام وفيسبوك وواتس اب؟</h2>
                                <p className="text-text-body text-lg leading-relaxed">
                                    الباحثون عن عمل يضطرون لمتابعة عشرات القنوات على تليجرام وفيسبوك، مما يسبب تشتت الانتباه وضياع الفرص الحقيقية وسط آلاف الرسائل غير المنظمة.
                                </p>
                            </div>
                        </div>

                        {/* Solution */}
                        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                            <div className="flex-1 max-w-sm">
                                <Image src="/undraw_searching-everywhere_tffi.svg" alt="الحل" width={256} height={192} className="drop-shadow-xl" />
                            </div>
                            <div className="flex-1 space-y-6 bg-primary-tint rounded-3xl p-8">
                                <div className="inline-block px-4 py-1 bg-white text-primary rounded-full text-sm font-bold">رؤية مدار</div>
                                <h2 className="text-3xl font-bold text-text-main">كل مكاتب مصر في <MarkerHighlight>مكان واحد</MarkerHighlight></h2>
                                <p className="text-text-body text-lg leading-relaxed">
                                    <span className="font-bold text-primary">مدار</span> يعمل كفلتر ذكي؛ يجمع لك الوظائف من المكاتب الموثوقة، ينظمها، ويجعلها قابلة للبحث في ثوانٍ معدودة.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
