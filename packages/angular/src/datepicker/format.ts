import type { DateLocale } from "./locale";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Format a Date according to the `format` token string.
 * Supported tokens: yyyy, MM, dd, HH, mm.
 */
export function formatDate(date: Date, format: string): string {
  return format
    .replace(/yyyy/g, String(date.getFullYear()))
    .replace(/MM/g, pad(date.getMonth() + 1))
    .replace(/dd/g, pad(date.getDate()))
    .replace(/HH/g, pad(date.getHours()))
    .replace(/mm/g, pad(date.getMinutes()));
}

export function formatDateLocale(date: Date, locale: DateLocale, withTime: boolean): string {
  const base = formatDate(date, "dd.MM.yyyy");
  if (!withTime) return base;
  return `${base} ${formatDate(date, "HH:mm")}`;
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function withTime(date: Date, hours: number, minutes: number): Date {
  const next = new Date(date);
  next.setHours(hours);
  next.setMinutes(minutes);
  next.setSeconds(0);
  next.setMilliseconds(0);
  return next;
}
