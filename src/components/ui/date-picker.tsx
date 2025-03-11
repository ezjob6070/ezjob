
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

interface DatePickerProps {
  mode: "single" | "range" | "multiple";
  selected?: Date | DateRange | Date[];
  onSelect?: (date: Date | DateRange | Date[] | undefined) => void;
  disabled?: boolean;
  initialFocus?: boolean;
}

export function DatePicker({
  mode,
  selected,
  onSelect,
  disabled = false,
  initialFocus = false,
}: DatePickerProps) {
  return (
    <Calendar
      mode={mode}
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      initialFocus={initialFocus}
      className="p-0"
    />
  );
}
