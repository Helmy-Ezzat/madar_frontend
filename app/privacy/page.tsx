import MarkerHighlight from "@/components/MarkerHighlight";

export const metadata = { title: "سياسة الخصوصية | مدار" };

const sections = [
    {
        title: "البيانات اللي بنجمعها",
        body: "عند تسجيل حساب بنحفظ بريدك الإلكتروني واسمك عشان نقدر نقدملك مميزات زي حفظ الوظايف والتنبيهات. لو فعّلت الإشعارات بنحفظ معرّف جهازك (رمز الإشعارات) عشان نقدر نبعتلك تنبيهات بالوظايف الجديدة.",
    },
    {
        title: "إزاي بنستخدم البيانات",
        body: "البيانات بتتستخدم بس عشان تشغيل الخدمة: تسجيل الدخول، حفظ الوظايف المفضلة، وإرسال التنبيهات اللي انت طلبتها. منبيعش ومنشاركش بياناتك مع أي طرف تالت لأغراض تسويقية.",
    },
    {
        title: "مصادر الوظايف",
        body: "الوظايف المعروضة متجمعة من مصادر عامة (قنوات ومواقع مكاتب التوظيف)، وجميع الحقوق محفوظة لأصحاب الإعلانات الأصليين.",
    },
];

export default function PrivacyPage() {
    return (
        <main className="min-h-screen">
            {/* Hero */}
            <section className="py-16 px-4 bg-gradient-to-b from-primary/10 via-primary/5 to-background text-center">
                <h1 className="text-2xl md:text-4xl font-bold text-text-main">
                    سياسة <MarkerHighlight>الخصوصية</MarkerHighlight>
                </h1>
                <p className="text-text-body text-base md:text-lg leading-relaxed max-w-2xl mx-auto mt-4">
                    مدار منصة بتجمع وظايف مكاتب إلحاق العمالة من مصادر عامة وبتعرضها في مكان واحد. الخصوصية بتاعتك مهمة بالنسبة لنا، والصفحة دي بتوضح إيه البيانات اللي بنجمعها وليه.
                </p>
            </section>

            {sections.map((section, i) => (
                <section key={section.title} className={`py-12 px-4 ${i % 2 === 0 ? "bg-background" : "bg-primary-tint"}`}>
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-lg md:text-xl font-bold text-text-main mb-3">{section.title}</h2>
                        <p className="text-text-body text-sm md:text-base leading-relaxed">{section.body}</p>
                    </div>
                </section>
            ))}

            {/* Delete your data */}
            <section className="py-12 px-4 bg-primary-tint">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-lg md:text-xl font-bold text-text-main mb-3">حذف بياناتك</h2>
                    <p className="text-text-body text-sm md:text-base leading-relaxed">
                        تقدر في أي وقت تمسح وظايفك المحفوظة أو توقف التنبيهات. لو عايز حذف حسابك نهائيًا كلمنا على{" "}
                        <a href="mailto:hellmyezzat@gmail.com" className="text-primary hover:underline">hellmyezzat@gmail.com</a>.
                    </p>
                    <p className="text-text-muted text-xs mt-8">آخر تحديث: نوفمبر 2026</p>
                </div>
            </section>
        </main>
    );
}
