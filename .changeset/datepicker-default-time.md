---
"@sisyphos-ui/datepicker": minor
"@sisyphos-ui/ui": minor
---

`<DatePicker>` learns six new optional props for `showTime` mode: `defaultHour`, `defaultMinute`, and the range-aware `defaultStartHour` / `defaultStartMinute` / `defaultEndHour` / `defaultEndMinute`. They define the time applied the first time the user picks a date, so common cases like "leave from 09:00 to 18:00" no longer require the user to manually adjust both ends from `00:00` after every selection.

The defaults only apply on first pick. Once a date carries a user-edited time the picker preserves it on subsequent re-picks. In range mode, picking an earlier date than the existing start flips the range without losing the previous start's time.
