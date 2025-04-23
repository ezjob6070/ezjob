
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Event = {
  id: string;
  title: string;
  datetime: Date;
  type: "meeting" | "call" | "deadline";
  clientName?: string;
};

const eventTypeColors = {
  meeting: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    icon: "👥",
  },
  call: {
    bg: "bg-green-100",
    text: "text-green-700",
    icon: "📞",
  },
  deadline: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    icon: "⏰",
  },
};

type UpcomingEventsProps = {
  events: Event[];
};

const UpcomingEvents = ({ events }: UpcomingEventsProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Helper function to ensure we have a valid Date object
  const ensureValidDate = (date: any): Date => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date;
    }
    // Return current date as fallback
    return new Date();
  };

  const isToday = (date: Date) => {
    const validDate = ensureValidDate(date);
    return validDate.getDate() === today.getDate() &&
      validDate.getMonth() === today.getMonth() &&
      validDate.getFullYear() === today.getFullYear();
  };

  const isTomorrow = (date: Date) => {
    const validDate = ensureValidDate(date);
    return validDate.getDate() === tomorrow.getDate() &&
      validDate.getMonth() === tomorrow.getMonth() &&
      validDate.getFullYear() === tomorrow.getFullYear();
  };

  const getDateLabel = (date: Date) => {
    const validDate = ensureValidDate(date);
    if (isToday(validDate)) return "Today";
    if (isTomorrow(validDate)) return "Tomorrow";
    return format(validDate, "MMM d, yyyy");
  };

  // Ensure all events have valid datetime objects - this is defensive programming
  // since we should have already validated in CalendarView
  const validEvents = events
    .filter(event => event && event.datetime instanceof Date && !isNaN(event.datetime.getTime()))
    .map(event => ({
      ...event,
      // Ensure datetime is a valid Date object
      datetime: ensureValidDate(event.datetime)
    }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {validEvents.length > 0 ? (
            validEvents.map((event) => (
              <div key={event.id} className="p-4 flex items-center">
                <div
                  className={cn(
                    "mr-4 w-10 h-10 rounded-full flex items-center justify-center",
                    eventTypeColors[event.type].bg,
                    eventTypeColors[event.type].text
                  )}
                >
                  {eventTypeColors[event.type].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  {event.clientName && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      with {event.clientName}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex flex-col items-end">
                  <div className="flex items-center text-muted-foreground text-xs">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    <span>{getDateLabel(event.datetime)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {format(event.datetime, "h:mm a")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No upcoming events
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
