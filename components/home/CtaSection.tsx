import Link from "next/link";

export default function CtaSection() {
    return (
        <section className="py-16 px-4" aria-labelledby="cta-heading">
            <div className="max-w-4xl mx-auto bg-primary rounded-3xl px-6 py-14 text-center flex flex-col items-center gap-6 shadow-xl">
                <h2 id="cta-heading" className="text-2xl md:text-4xl font-bold text-white leading-snug">
                    جاهز تلاقي فرصتك في الخارج؟
                </h2>
                <p className="text-white/85 text-base md:text-lg max-w-xl leading-relaxed">
                    آلاف الوظائف من مكاتب الإلحاق المرخصة مستنياك. ابحث دلوقتي وخد أول خطوة في رحلتك.
                </p>
                <Link
                    href="/jobs"
                    className="bg-white text-primary px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3"
                >
                    ابدأ البحث الآن
                    <span aria-hidden="true">←</span>
                </Link>
            </div>
        </section>
    );
}
