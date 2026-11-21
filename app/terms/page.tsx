import MarkerHighlight from "@/components/MarkerHighlight";

export const metadata = { title: "شروط الاستخدام | مدار" };

const sections = [
    {
        title: "طبيعة الخدمة",
        body: "مدار محرك بحث بيجمع إعلانات الوظايف من مصادر عامة وبيرتبها لسهولة التصفح. مدار مش مكتب توظيف ومش طرف في أي اتفاق بينك وبين المكاتب أو الشركات المعلنة.",
    },
    {
        title: "دقة المعلومات",
        body: "بنحاول نوفر معلومات صحيحة ومحدثة، لكن محتوى الإعلانات مسؤولية أصحابها الأصليين. دايمًا تأكد من تفاصيل الوظيفة والمكتب (ورقم الترخيص) قبل التقديم أو دفع أي مبالغ.",
    },
    {
        title: "الحسابات",
        body: "انت مسؤول عن سرية حسابك. ممنوع استخدام الموقع في أي نشاط مخالف للقانون أو جمع بيانات المستخدمين.",
    },
    {
        title: "التعديلات",
        body: "ممكن نحدّث الشروط دي من وقت للتاني، واستمرارك في استخدام الموقع معناه موافقتك على النسخة المحدثة.",
    },
];

export default function TermsPage() {
    return (
        <main className="min-h-screen">
            {/* Hero */}
            <section className="py-16 px-4 bg-gradient-to-b from-primary/10 via-primary/5 to-background text-center">
                <h1 className="text-2xl md:text-4xl font-bold text-text-main">
                    شروط <MarkerHighlight>الاستخدام</MarkerHighlight>
                </h1>
                <p className="text-text-body text-base md:text-lg leading-relaxed max-w-2xl mx-auto mt-4">
                    باستخدامك لموقع مدار انت بتوافق على الشروط دي.
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

            <section className="py-12 px-4 bg-background">
                <div className="max-w-3xl mx-auto">
                    <p className="text-text-muted text-xs">آخر تحديث: نوفمبر 2026</p>
                </div>
            </section>
        </main>
    );
}
