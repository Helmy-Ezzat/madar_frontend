import { BadgeDollarSign, ShieldCheck, RefreshCw, SlidersHorizontal } from "lucide-react";

const features = [
    {
        icon: BadgeDollarSign,
        title: "مجاني بالكامل",
        description: "مش هتدفع أي حاجة. كل الوظائف والتفاصيل متاحة ليك من غير اشتراك ولا رسوم.",
    },
    {
        icon: ShieldCheck,
        title: "مكاتب مرخصة فقط",
        description: "كل وظيفة مرتبطة بمكتب إلحاق عمالة مرخص، ورقم الترخيص ظاهر قدامك في تفاصيل كل إعلان.",
    },
    {
        icon: RefreshCw,
        title: "محدث على مدار الساعة",
        description: "الوظائف بتتجمع وتتحدث تلقائيًا كل يوم، فالفرص الجديدة بتوصلك أول بأول.",
    },
    {
        icon: SlidersHorizontal,
        title: "بحث وفلاتر ذكية",
        description: "ابحث بالمسمى الوظيفي أو الشركة، وفلتر حسب الدولة والمدينة والتخصص وتاريخ النشر.",
    },
];

export default function WhyMadar() {
    return (
        <section className="py-16 px-4 bg-background" aria-labelledby="why-madar-heading">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 id="why-madar-heading" className="text-2xl md:text-4xl font-bold text-text-main mb-4">
                        ليه تختار <span className="text-primary">مدار</span>؟
                    </h2>
                    <p className="text-text-body text-lg max-w-2xl mx-auto">
                        مش مجرد موقع وظائف، ده فلتر ذكي بيوفر عليك وقت ومجهود المتابعة
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-primary hover:shadow-md transition-all duration-200"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <feature.icon className="w-6 h-6" strokeWidth={1.8} />
                            </div>
                            <h3 className="font-bold text-lg text-text-main">{feature.title}</h3>
                            <p className="text-text-body text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
