
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

interface DatePickerProps {
  mode: "single" | "range" | "multiple";
  selected?: Date | DateRange | Date[];
  onSelect?: (date: Date | DateRange | Date[] | undefined) => void;
  disabled?: boolean;
  initialFocus?: boolean;
  className?: string;
}

export function DatePicker({
  mode,
  selected,
  onSelect,
  disabled = false,
  initialFocus = false,
  className,
}: DatePickerProps) {
  // We need to pass proper props based on the mode
  if (mode === "single") {
    return (
      <Calendar
        mode="single"
        selected={selected as Date}
        onSelect={onSelect as (date: Date | undefined) => void}
        disabled={disabled}
        initialFocus={initialFocus}
        className={className}
      />
    );
  } else if (mode === "range") {
    return (
      <Calendar
        mode="range"
        selected={selected as DateRange}
        onSelect={onSelect as (date: DateRange | undefined) => void}
        disabled={disabled}
        initialFocus={initialFocus}
        className={className}
      />
    );
  } else {
    return (
      <Calendar
        mode="multiple"
        selected={selected as Date[]}
        onSelect={onSelect as (date: Date[] | undefined) => void}
        disabled={disabled}
        initialFocus={initialFocus}
        className={className}
      />
    );
  }
}
