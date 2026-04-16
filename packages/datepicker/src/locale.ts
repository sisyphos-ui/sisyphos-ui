export type DateLocale = "tr" | "en";

export const WEEK_DAYS: Record<DateLocale, string[]> = {
  tr: ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"],
  en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
};

export const MONTHS: Record<DateLocale, string[]> = {
  tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

export const PLACEHOLDERS: Record<DateLocale, string> = {
  tr: "Tarih seç",
  en: "Select date",
};

export const RANGE_LABELS: Record<DateLocale, { start: string; end: string }> = {
  tr: { start: "Başlangıç", end: "Bitiş" },
  en: { start: "Start", end: "End" },
};
