# @sisyphos-ui/datepicker

Single-date or date-range picker with optional time, min/max constraints, and Turkish/English localized labels. Portal-mounted dropdown, day/month/year views.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/datepicker/styles.css";
import { DatePicker } from "@sisyphos-ui/datepicker";

const [date, setDate] = useState<Date | null>(null);

<DatePicker label="Tarih" value={date} onChange={setDate} allowClear />

{/* With time */}
<DatePicker label="Randevu" showTime minuteStep={15} value={d} onChange={setD} />

{/* Range */}
const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
<DatePicker isRange value={range} onChange={setRange} />

{/* English locale */}
<DatePicker locale="en" format="yyyy-MM-dd" />

{/* Min/max */}
<DatePicker minDate={weekAgo} maxDate={today} />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `value` / `onChange` | `Date \| null` (single) or `[Date \| null, Date \| null]` (range) | – |
| `isRange` | `boolean` | `false` |
| `label` | `string` | – |
| `placeholder` | `string` | `"Tarih seç"` / `"Select date"` |
| `error` / `errorMessage` | `boolean` / `string` | – |
| `disabled` / `readOnly` / `required` | `boolean` | `false` |
| `variant` | `"standard" \| "outlined"` | `"outlined"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `locale` | `"tr" \| "en"` | `"tr"` |
| `format` | `string` (supports `yyyy MM dd HH mm`) | `"dd.MM.yyyy"` (or with time) |
| `showTime` | `boolean` | `false` |
| `minuteStep` | `number` | `15` |
| `minDate` / `maxDate` | `Date` | – |
| `allowClear` | `boolean` | `false` |
| `calendarIcon` | `ReactNode` | default calendar |
| `placement` | `Placement` | `"bottom-start"` |

## Keyboard / a11y

- Trigger exposes `aria-haspopup="dialog"`, `aria-expanded`.
- Escape closes the dropdown.
- Calendar buttons fully keyboard operable.
- Time fields are standard `<select>` elements — native keyboard access.
