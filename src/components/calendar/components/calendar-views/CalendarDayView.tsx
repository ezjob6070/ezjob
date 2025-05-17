
import { format } from "date-fns";

interface CalendarDayViewProps {
  selectedDate: Date;
  onDateClick?: (date: Date) => void;
}

const CalendarDayView = ({ selectedDate, onDateClick }: CalendarDayViewProps) => {
  return (
    <div className="text-center p-4">
      <div className="font-medium mb-2">
        {format(selectedDate, "EEEE, MMMM d")}
      </div>
      <div 
        className="text-3xl font-bold cursor-pointer" 
        onClick={() => onDateClick && onDateClick(selectedDate)}
      >
        {format(selectedDate, "d")}
      </div>
    </div>
  );
};

export default CalendarDayView;
