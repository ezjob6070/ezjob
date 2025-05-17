
import { format } from "date-fns";

interface CalendarDayViewProps {
  selectedDate: Date;
  onDateClick?: (date: Date) => void;
}

const CalendarDayView = ({ selectedDate, onDateClick }: CalendarDayViewProps) => {
  return (
    <div className="bg-white border rounded-md p-2 sm:p-3 mb-4">
      <div className="text-center font-medium mb-2">
        {format(selectedDate, "EEEE, MMMM d")}
      </div>
      <div 
        className="text-center text-3xl font-bold cursor-pointer" 
        onClick={() => onDateClick && onDateClick(selectedDate)}
      >
        {format(selectedDate, "d")}
      </div>
    </div>
  );
};

export default CalendarDayView;
