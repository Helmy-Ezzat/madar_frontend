import { Radar, Sparkles, MousePointerClick } from "lucide-react";
import MarkerHighlight from "../MarkerHighlight";

const steps = [
    {
        icon: Radar,
        title: "بنجمع الوظائف أول بأول",
        description: "مدار بيتابع قنوات وصفحات مكاتب إلحاق العمالة على تليجرام وفيسبوك على مدار الساعة، وأول ما إعلان جديد ينزل بيتسجل عندنا.",
    },
    {
        icon: Sparkles,
        title: "الذكاء الاصطناعي بينظمها",
        description: "كل إعلان بيتحول من نص طويل لبيانات واضحة: المسمى الوظيفي، الراتب، المكان، وبيانات المكتب ورقم ترخيصه.",
    },
    {
        icon: MousePointerClick,
        title: "ابحث وقدّم مباشرة",
        description: "فلتر حسب الدولة أو التخصص أو تاريخ النشر، افتح تفاصيل الوظيفة، ووصل للإعلان الأصلي عشان تقدّم مع المكتب بنفسك.",
    },
];

export default function HowItWorks() {
    return (
        <section className="py-16 px-4 bg-primary-tint" aria-labelledby="how-it-works-heading">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 id="how-it-works-heading" className="text-2xl md:text-4xl font-bold text-text-main mb-4">
                        إزاي <MarkerHighlight>مدار</MarkerHighlight> بيشتغل؟
                    </h2>
                    <p className="text-text-body text-lg max-w-2xl mx-auto">
                        من قناة تليجرام مزدحمة لفرصة واضحة قدامك، في ثلاث خطوات
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map((step, index) => (
                        <div
                            key={step.title}
                            className="relative bg-white border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-primary hover:shadow-md transition-all duration-200"
                        >
                            <span className="absolute top-4 left-4 text-4xl font-black text-primary/10 select-none" aria-hidden="true">
                                {index + 1}
                            </span>
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <step.icon className="w-6 h-6" strokeWidth={1.8} />
                            </div>
                            <h3 className="font-bold text-lg text-text-main">{step.title}</h3>
                            <p className="text-text-body text-sm leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
