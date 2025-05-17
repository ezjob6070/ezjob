
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarWeekViewProps {
  selectedDate: Date;
  onDateClick: (date: Date) => void;
}

const CalendarWeekView = ({ selectedDate, onDateClick }: CalendarWeekViewProps) => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((day) => (
        <div 
          key={day.toString()} 
          onClick={() => onDateClick(day)}
          className={cn(
            "flex flex-col items-center justify-center p-1 rounded-md cursor-pointer text-xs sm:text-sm",
            isSameDay(day, selectedDate) 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-gray-100"
          )}
        >
          <div className="text-xs">{format(day, "E")}</div>
          <div className="font-semibold">{format(day, "d")}</div>
        </div>
      ))}
    </div>
  );
};

export default CalendarWeekView;
