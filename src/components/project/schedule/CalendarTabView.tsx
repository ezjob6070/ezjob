
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScheduleEvent } from "./types";
import { getEventTypeIcon, getEventTypeBadgeColor } from "./eventUtils";

interface CalendarTabViewProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  events: ScheduleEvent[];
  setSelectedEvent: (event: ScheduleEvent) => void;
  filteredEvents: ScheduleEvent[];
}

export default function CalendarTabView({
  date,
  setDate,
  events,
  setSelectedEvent,
  filteredEvents
}: CalendarTabViewProps) {
  // Filter Events for Selected Date
  const eventsForSelectedDate = filteredEvents.filter(event => 
    format(event.start, "yyyy-MM-dd") === format(date || new Date(), "yyyy-MM-dd")
  );

  // Import the icons dynamically based on the event type
  const iconMap = {
    Calendar: CalendarIcon,
    Check: function Check(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>; },
    FileText: function FileText(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>; },
    BellRing: function BellRing(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path><path d="M4 2C2.8 3.7 2 5.7 2 8"></path><path d="M22 8c0-2.3-.8-4.3-2-6"></path></svg>; },
    Clock: function Clock(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>; }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Calendar</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              style={{width: "300px"}}
            />
          </PopoverContent>
        </Popover>
        
        {/* Display Events for Selected Date */}
        <div className="mt-4">
          {eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate.map(event => {
              const IconComponent = iconMap[getEventTypeIcon(event.type)];
              
              return (
                <Card key={event.id} className={`mb-2 ${event.type === "reminder" ? "border-purple-200" : ""}`}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {IconComponent && <IconComponent className="h-4 w-4 text-blue-600" />}
                        <p className="font-medium">{event.title}</p>
                        <Badge className={getEventTypeBadgeColor(event.type)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => setSelectedEvent(event)}>
                        View Details
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(event.start, "p")} - {format(event.end, "p")}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-muted-foreground">No events scheduled for this day.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
