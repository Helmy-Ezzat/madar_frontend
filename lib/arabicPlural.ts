export type PluralForms = {
  one: string;   // يوم
  two: string;   // يومان
  few: string;   // أيام (3-10)
  many: string;  // يوم (11-99)
  other: string; // يوم (100، 101...)
};

export const units = {
  second: { one: "ثانية", two: "ثانيتان", few: "ثوانٍ", many: "ثانية", other: "ثانية" },
  minute: { one: "دقيقة", two: "دقيقتان", few: "دقائق", many: "دقيقة", other: "دقيقة" },
  hour:   { one: "ساعة", two: "ساعتان", few: "ساعات", many: "ساعة", other: "ساعة" },
  day:    { one: "يوم", two: "يومان", few: "أيام", many: "يومًا", other: "يوم" },
  week:   { one: "أسبوع", two: "أسبوعان", few: "أسابيع", many: "أسبوعًا", other: "أسبوع" },
  month:  { one: "شهر", two: "شهران", few: "أشهر", many: "شهرًا", other: "شهر" },
  year:   { one: "سنة", two: "سنتان", few: "سنوات", many: "سنة", other: "سنة" },
} satisfies Record<string, PluralForms>;

/** صيغ الوحدات المجرورة (تُستخدم بعد "منذ" وغيرها من حروف الجر) */
export const unitsRelative = {
  second: { one: "ثانية", two: "ثانيتين", few: "ثوانٍ", many: "ثانية", other: "ثانية" },
  minute: { one: "دقيقة", two: "دقيقتين", few: "دقائق", many: "دقيقة", other: "دقيقة" },
  hour:   { one: "ساعة", two: "ساعتين", few: "ساعات", many: "ساعة", other: "ساعة" },
  day:    { one: "يوم", two: "يومين", few: "أيام", many: "يومًا", other: "يوم" },
  week:   { one: "أسبوع", two: "أسبوعين", few: "أسابيع", many: "أسبوعًا", other: "أسبوع" },
  month:  { one: "شهر", two: "شهرين", few: "أشهر", many: "شهرًا", other: "شهر" },
  year:   { one: "سنة", two: "سنتين", few: "سنوات", many: "سنة", other: "سنة" },
} satisfies Record<string, PluralForms>;

/** الكلمات الشائعة في التطبيق */
export const nouns = {
  job: { one: "وظيفة", two: "وظيفتان", few: "وظائف", many: "وظيفة", other: "وظيفة" },
  jobGenitive: { one: "وظيفة", two: "وظيفتين", few: "وظائف", many: "وظيفة", other: "وظيفة" },
  office: { one: "مكتب", two: "مكتبان", few: "مكاتب", many: "مكتبًا", other: "مكتب" },
  specialization: { one: "تخصص", two: "تخصصان", few: "تخصصات", many: "تخصصًا", other: "تخصص" },
  officeGenitive: { one: "مكتب", two: "مكتبين", few: "مكاتب", many: "مكتبًا", other: "مكتب" },
} satisfies Record<string, PluralForms>;

export type UnitName = keyof typeof units;

// القاعدة المتفق عليها: 1 مفرد، 2 مثنى، 3-10 جمع، 11-99 مفرد منصوب، 100+ مفرد.
// (أبسط من قواعد CLDR التي تعيد 110 و4110 إلى الجمع بسبب الباقي من 100)
function categoryOf(count: number): keyof PluralForms {
  if (count === 1) return "one";
  if (count === 2) return "two";
  if (count >= 3 && count <= 10) return "few";
  if (count >= 11 && count <= 99) return "many";
  return "other";
}

type Options = {
  /** أرقام لاتينية (3) بدل الهندية (٣). الافتراضي: لاتينية */
  latinDigits?: boolean;
  /** اعرض الرقم مع المفرد والمثنى (1 يوم / 2 يومان) بدل الكلمة وحدها */
  alwaysShowNumber?: boolean;
};

export function pluralAr(
  count: number,
  forms: PluralForms,
  { latinDigits = true, alwaysShowNumber = false }: Options = {}
): string {
  const category = categoryOf(count);
  const word = forms[category] ?? forms.other;

  if (!alwaysShowNumber && (category === "one" || category === "two")) {
    return word;
  }

  const locale = latinDigits ? "ar-SA-u-nu-latn" : "ar-EG";
  return `${count.toLocaleString(locale)} ${word}`;
}