<script setup lang="ts">
import { computed, ref, watch, useId } from "vue";
import { useEscapeKey, useOutsideClick } from "../composables";

type DateLocale = "tr" | "en";
type ViewMode = "days" | "months" | "years";

const WEEK_DAYS: Record<DateLocale, string[]> = {
  tr: ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"],
  en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
};

const MONTHS: Record<DateLocale, string[]> = {
  tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

const PLACEHOLDERS: Record<DateLocale, string> = { tr: "Tarih seç", en: "Select date" };
const RANGE_LABELS: Record<DateLocale, { start: string; end: string }> = {
  tr: { start: "Başlangıç", end: "Bitiş" },
  en: { start: "Start", end: "End" },
};

function pad(n: number) { return String(n).padStart(2, "0"); }

function formatDate(date: Date, fmt: string): string {
  return fmt
    .replace(/yyyy/g, String(date.getFullYear()))
    .replace(/MM/g, pad(date.getMonth() + 1))
    .replace(/dd/g, pad(date.getDate()))
    .replace(/HH/g, pad(date.getHours()))
    .replace(/mm/g, pad(date.getMinutes()));
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function withTime(date: Date, hours: number, minutes: number): Date {
  const next = new Date(date);
  next.setHours(hours); next.setMinutes(minutes); next.setSeconds(0); next.setMilliseconds(0);
  return next;
}

function buildCalendar(month: Date, locale: DateLocale): Date[] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1);
  const lastDay = new Date(year, m + 1, 0);
  const dayOfWeek = locale === "tr" ? (firstDay.getDay() + 6) % 7 : firstDay.getDay();
  const days: Date[] = [];
  for (let i = dayOfWeek - 1; i >= 0; i--) days.push(new Date(year, m, -i));
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, m, d));
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) for (let i = 1; i <= remaining; i++) days.push(new Date(year, m + 1, i));
  return days;
}

interface Props {
  modelValue?: Date | null | [Date | null, Date | null];
  isRange?: boolean;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  variant?: "standard" | "outlined";
  size?: "sm" | "md" | "lg";
  minDate?: Date;
  maxDate?: Date;
  format?: string;
  locale?: DateLocale;
  showTime?: boolean;
  minuteStep?: number;
  defaultHour?: number;
  defaultMinute?: number;
  defaultStartHour?: number;
  defaultStartMinute?: number;
  defaultEndHour?: number;
  defaultEndMinute?: number;
  allowClear?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isRange: false,
  disabled: false,
  readOnly: false,
  required: false,
  error: false,
  variant: "outlined",
  size: "md",
  locale: "tr",
  showTime: false,
  minuteStep: 15,
  defaultHour: 0,
  defaultMinute: 0,
  allowClear: false,
  fullWidth: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: Date | null | [Date | null, Date | null]): void;
}>();

const id = useId();
const fieldId = `sisyphos-datepicker-${id}`;

const singleValue = computed<Date | null>(() =>
  !props.isRange ? ((props.modelValue as Date | null | undefined) ?? null) : null
);
const rangeValue = computed<[Date | null, Date | null]>(() =>
  props.isRange ? ((props.modelValue as [Date | null, Date | null] | undefined) ?? [null, null]) : [null, null]
);

const isOpen = ref(false);
const viewMode = ref<ViewMode>("days");
const cursor = ref<Date>(
  (props.isRange ? rangeValue.value[0] : singleValue.value) ?? new Date()
);

const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);

useEscapeKey(() => { isOpen.value = false; }, isOpen);
useOutsideClick([triggerRef, dropdownRef], () => { isOpen.value = false; }, isOpen);

const defaultFormat = computed(() => props.showTime ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy");
const fmt = computed(() => props.format ?? defaultFormat.value);

const displayValue = computed(() => {
  if (props.isRange) {
    const [s, e] = rangeValue.value;
    if (s && e) return `${formatDate(s, fmt.value)} - ${formatDate(e, fmt.value)}`;
    if (s) return formatDate(s, fmt.value);
    return "";
  }
  return singleValue.value ? formatDate(singleValue.value, fmt.value) : "";
});

const hasValue = computed(() =>
  props.isRange ? Boolean(rangeValue.value[0] || rangeValue.value[1]) : Boolean(singleValue.value)
);

function openPicker() {
  if (props.disabled || props.readOnly) return;
  isOpen.value = !isOpen.value;
  viewMode.value = "days";
}

function clear(e: MouseEvent) {
  e.stopPropagation();
  emit("update:modelValue", props.isRange ? [null, null] : null);
}

function isDateDisabled(date: Date): boolean {
  if (props.minDate && date < props.minDate) return true;
  if (props.maxDate && date > props.maxDate) return true;
  return false;
}

function isSelected(date: Date): boolean {
  if (props.isRange) {
    const [s, e] = rangeValue.value;
    return Boolean((s && sameDay(date, s)) || (e && sameDay(date, e)));
  }
  return singleValue.value ? sameDay(date, singleValue.value) : false;
}

function isInRange(date: Date): boolean {
  if (!props.isRange) return false;
  const [s, e] = rangeValue.value;
  if (!s || !e) return false;
  return date >= s && date <= e;
}

function applyDefaultTime(d: Date, target: "single" | "start" | "end"): Date {
  if (!props.showTime) return d;
  let h = props.defaultHour;
  let m = props.defaultMinute;
  if (target === "start") { h = props.defaultStartHour ?? props.defaultHour; m = props.defaultStartMinute ?? props.defaultMinute; }
  else if (target === "end") { h = props.defaultEndHour ?? props.defaultHour; m = props.defaultEndMinute ?? props.defaultMinute; }
  return withTime(d, h, m);
}

function handleDaySelect(d: Date) {
  if (isDateDisabled(d)) return;
  if (!props.isRange) {
    const next = props.showTime && singleValue.value
      ? withTime(d, singleValue.value.getHours(), singleValue.value.getMinutes())
      : applyDefaultTime(d, "single");
    emit("update:modelValue", next);
    if (!props.showTime) isOpen.value = false;
    return;
  }
  const [s, e] = rangeValue.value;
  if (!s || (s && e)) {
    emit("update:modelValue", [applyDefaultTime(d, "start"), null]);
  } else {
    if (d >= s) {
      emit("update:modelValue", [s, applyDefaultTime(d, "end")]);
    } else {
      emit("update:modelValue", [applyDefaultTime(d, "start"), s]);
    }
    if (!props.showTime) isOpen.value = false;
  }
}

function handleTimeChange(target: "single" | "start" | "end", which: "hour" | "minute", val: number) {
  if (target === "single") {
    if (!singleValue.value) return;
    const h = which === "hour" ? val : singleValue.value.getHours();
    const m = which === "minute" ? val : singleValue.value.getMinutes();
    emit("update:modelValue", withTime(singleValue.value, h, m));
  } else if (target === "start") {
    const s = rangeValue.value[0];
    if (!s) return;
    const h = which === "hour" ? val : s.getHours();
    const m = which === "minute" ? val : s.getMinutes();
    emit("update:modelValue", [withTime(s, h, m), rangeValue.value[1]]);
  } else {
    const e = rangeValue.value[1];
    if (!e) return;
    const h = which === "hour" ? val : e.getHours();
    const m = which === "minute" ? val : e.getMinutes();
    emit("update:modelValue", [rangeValue.value[0], withTime(e, h, m)]);
  }
}

const minuteOptions = computed(() => {
  const out: number[] = [];
  for (let m = 0; m < 60; m += props.minuteStep) out.push(m);
  return out;
});

const decadeStart = computed(() => Math.floor(cursor.value.getFullYear() / 10) * 10);
const years = computed(() => Array.from({ length: 10 }, (_, i) => decadeStart.value + i));
const calendarDays = computed(() => buildCalendar(cursor.value, props.locale));

function navPrev() {
  if (viewMode.value === "days") cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() - 1);
  else if (viewMode.value === "months") cursor.value = new Date(cursor.value.getFullYear() - 1, cursor.value.getMonth());
  else cursor.value = new Date(cursor.value.getFullYear() - 10, cursor.value.getMonth());
}

function navNext() {
  if (viewMode.value === "days") cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + 1);
  else if (viewMode.value === "months") cursor.value = new Date(cursor.value.getFullYear() + 1, cursor.value.getMonth());
  else cursor.value = new Date(cursor.value.getFullYear() + 10, cursor.value.getMonth());
}

function cycleView() {
  if (viewMode.value === "days") viewMode.value = "months";
  else if (viewMode.value === "months") viewMode.value = "years";
}

const containerClasses = computed(() => [
  "sisyphos-datepicker",
  props.size,
  props.variant,
  props.error && "error",
  props.disabled && "disabled",
  props.fullWidth && "full-width",
]);
</script>

<template>
  <div :class="containerClasses">
    <label
      v-if="label"
      :for="fieldId"
      :class="['sisyphos-datepicker-label', error && 'error', required && 'required']"
    >{{ label }}</label>

    <div
      ref="triggerRef"
      :class="['sisyphos-datepicker-trigger', isOpen && 'focused']"
      @click="openPicker"
    >
      <span class="sisyphos-datepicker-start-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </span>
      <input
        :id="fieldId"
        class="sisyphos-datepicker-input"
        type="text"
        readonly
        :disabled="disabled"
        :value="displayValue"
        :placeholder="placeholder ?? PLACEHOLDERS[locale]"
        :aria-invalid="error || undefined"
        aria-haspopup="dialog"
        :aria-expanded="isOpen"
      />
      <div class="sisyphos-datepicker-end-icons">
        <button
          v-if="allowClear && hasValue && !disabled"
          type="button"
          class="sisyphos-datepicker-clear"
          aria-label="Clear date"
          @click.stop="clear"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
          </svg>
        </button>
        <span class="sisyphos-datepicker-chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" :style="isOpen ? 'transform:rotate(180deg)' : undefined">
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
          </svg>
        </span>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        role="dialog"
        :aria-label="label ?? 'Date picker'"
        class="sisyphos-datepicker-dropdown"
      >
        <!-- Header nav -->
        <div class="sisyphos-datepicker-header">
          <button type="button" class="sisyphos-datepicker-nav" aria-label="Previous" @click="navPrev">‹</button>
          <button type="button" class="sisyphos-datepicker-header-title" @click="cycleView">
            <template v-if="viewMode === 'days'">{{ MONTHS[locale][cursor.getMonth()] }} {{ cursor.getFullYear() }}</template>
            <template v-else-if="viewMode === 'months'">{{ cursor.getFullYear() }}</template>
            <template v-else>{{ years[0] }} - {{ years[9] }}</template>
          </button>
          <button type="button" class="sisyphos-datepicker-nav" aria-label="Next" @click="navNext">›</button>
        </div>

        <!-- Days view -->
        <template v-if="viewMode === 'days'">
          <div class="sisyphos-datepicker-weekdays">
            <div v-for="d in WEEK_DAYS[locale]" :key="d" class="sisyphos-datepicker-weekday">{{ d }}</div>
          </div>
          <div class="sisyphos-datepicker-days">
            <button
              v-for="(d, i) in calendarDays"
              :key="i"
              type="button"
              :class="[
                'sisyphos-datepicker-day',
                d.getMonth() !== cursor.getMonth() && 'other-month',
                sameDay(d, new Date()) && !hasValue && 'today',
                isSelected(d) && 'selected',
                isInRange(d) && 'in-range',
                (isDateDisabled(d) || d.getMonth() !== cursor.getMonth()) && 'disabled',
              ]"
              :disabled="isDateDisabled(d) || d.getMonth() !== cursor.getMonth()"
              :aria-selected="isSelected(d) || undefined"
              @click="handleDaySelect(d)"
            >{{ d.getDate() }}</button>
          </div>
        </template>

        <!-- Months view -->
        <div v-else-if="viewMode === 'months'" class="sisyphos-datepicker-months">
          <button
            v-for="(m, idx) in MONTHS[locale]"
            :key="m"
            type="button"
            :class="['sisyphos-datepicker-month', idx === cursor.getMonth() && 'selected']"
            @click="() => { cursor = new Date(cursor.getFullYear(), idx); viewMode = 'days'; }"
          >{{ m }}</button>
        </div>

        <!-- Years view -->
        <div v-else class="sisyphos-datepicker-years">
          <button
            v-for="y in years"
            :key="y"
            type="button"
            :class="['sisyphos-datepicker-year', y === cursor.getFullYear() && 'selected']"
            @click="() => { cursor = new Date(y, cursor.getMonth()); viewMode = 'months'; }"
          >{{ y }}</button>
        </div>

        <!-- Time picker -->
        <div v-if="showTime" :class="['sisyphos-datepicker-time', isRange && 'range']">
          <template v-if="isRange">
            <div v-for="(which, idx) in (['start', 'end'] as const)" :key="which" class="sisyphos-datepicker-time-group">
              <div class="sisyphos-datepicker-time-label">{{ RANGE_LABELS[locale][which] }}</div>
              <div class="sisyphos-datepicker-time-row">
                <select
                  :aria-label="`${RANGE_LABELS[locale][which]} hour`"
                  :disabled="!rangeValue[idx]"
                  :value="rangeValue[idx]?.getHours() ?? 0"
                  @change="(e) => handleTimeChange(which, 'hour', Number((e.target as HTMLSelectElement).value))"
                >
                  <option v-for="h in 24" :key="h - 1" :value="h - 1">{{ pad(h - 1) }}</option>
                </select>
                :
                <select
                  :aria-label="`${RANGE_LABELS[locale][which]} minute`"
                  :disabled="!rangeValue[idx]"
                  :value="rangeValue[idx]?.getMinutes() ?? 0"
                  @change="(e) => handleTimeChange(which, 'minute', Number((e.target as HTMLSelectElement).value))"
                >
                  <option v-for="m in minuteOptions" :key="m" :value="m">{{ pad(m) }}</option>
                </select>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="sisyphos-datepicker-time-row">
              <select
                aria-label="Hour"
                :disabled="!singleValue"
                :value="singleValue?.getHours() ?? 0"
                @change="(e) => handleTimeChange('single', 'hour', Number((e.target as HTMLSelectElement).value))"
              >
                <option v-for="h in 24" :key="h - 1" :value="h - 1">{{ pad(h - 1) }}</option>
              </select>
              :
              <select
                aria-label="Minute"
                :disabled="!singleValue"
                :value="singleValue?.getMinutes() ?? 0"
                @change="(e) => handleTimeChange('single', 'minute', Number((e.target as HTMLSelectElement).value))"
              >
                <option v-for="m in minuteOptions" :key="m" :value="m">{{ pad(m) }}</option>
              </select>
            </div>
          </template>
        </div>
      </div>
    </Teleport>

    <span v-if="error && errorMessage" class="sisyphos-datepicker-error" role="alert">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style src="./DatePicker.scss"></style>
