
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, ArrowRight, Clock, BarChart, List, 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon 
} from "lucide-react";
import { Project, ProjectStaff, ProjectTask } from "@/types/project";
import { format, addDays, addMonths, subMonths, parseISO, isToday, isSameMonth, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ProjectScheduleAndTasksTabProps {
  project: Project;
  projectStaff?: ProjectStaff[];
}

const ProjectScheduleAndTasksTab = ({ project, projectStaff }: ProjectScheduleAndTasksTabProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline' | 'month'>('month');
  
  // Sample tasks/events for the project calendar
  const events = [
    {
      id: 1,
      title: "Site Inspection",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "09:00 AM - 11:00 AM",
      type: "meeting",
      status: "completed"
    },
    {
      id: 2,
      title: "Material Delivery",
      date: format(addDays(new Date(), 2), "yyyy-MM-dd"),
      time: "01:00 PM - 03:00 PM",
      type: "delivery",
      status: "scheduled"
    },
    {
      id: 3,
      title: "Foundation Work",
      date: format(addDays(new Date(), 5), "yyyy-MM-dd"),
      time: "08:00 AM - 05:00 PM",
      type: "construction",
      status: "scheduled"
    },
    {
      id: 4,
      title: "Client Meeting",
      date: format(addDays(new Date(), 7), "yyyy-MM-dd"),
      time: "02:00 PM - 03:00 PM",
      type: "meeting",
      status: "scheduled"
    },
    {
      id: 5,
      title: "Electrical Installation",
      date: format(addDays(new Date(), 10), "yyyy-MM-dd"),
      time: "08:00 AM - 05:00 PM",
      type: "construction",
      status: "scheduled"
    },
    {
      id: 6,
      title: "Plumbing Work",
      date: format(addDays(new Date(), 12), "yyyy-MM-dd"),
      time: "08:00 AM - 05:00 PM",
      type: "construction",
      status: "scheduled"
    },
    {
      id: 7,
      title: "Quality Inspection",
      date: format(addDays(new Date(), 15), "yyyy-MM-dd"),
      time: "10:00 AM - 12:00 PM",
      type: "inspection",
      status: "scheduled"
    }
  ];

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800";
      case "delivery":
        return "bg-amber-100 text-amber-800";
      case "construction":
        return "bg-green-100 text-green-800";
      case "inspection":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter events for the selected date
  const eventsForSelectedDate = events.filter(event => 
    event.date === format(selectedDate, "yyyy-MM-dd")
  );

  // Month view - organize events by day in the current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days = [];
    for (let i = 0; i < daysInMonth; i++) {
      const day = new Date(year, month, i + 1);
      days.push(day);
    }
    
    return days;
  };
  
  const daysInMonth = getDaysInMonth();
  
  // Metrics data
  const completedEvents = events.filter(e => e.status === "completed").length;
  const totalEvents = events.length;
  const scheduledEvents = events.filter(e => e.status === "scheduled").length;

  // Timeline items sorted by date
  const timelineEvents = [...events].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Render Month View
  const renderMonthView = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          
          <h3 className="text-lg font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          
          <Button variant="outline" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square p-1"></div>
          ))}
          
          {daysInMonth.map((day) => {
            const dateString = format(day, "yyyy-MM-dd");
            const dayEvents = events.filter(event => event.date === dateString);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div 
                key={dateString}
                className={cn(
                  "aspect-square p-1 border rounded-md transition-all",
                  isToday(day) ? "bg-blue-50 border-blue-200" : "border-gray-100 hover:border-gray-300",
                  isSelected ? "ring-2 ring-blue-500 border-blue-500" : "",
                  isCurrentMonth ? "" : "opacity-40"
                )}
                onClick={() => setSelectedDate(day)}
              >
                <div className={cn(
                  "flex flex-col h-full",
                  isToday(day) ? "font-medium" : ""
                )}>
                  <div className="text-right text-sm p-1">
                    {format(day, "d")}
                  </div>
                  
                  {dayEvents.length > 0 && (
                    <div className="flex-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div 
                          key={event.id}
                          className={cn(
                            "text-xs px-1 py-0.5 mb-0.5 rounded truncate",
                            getEventTypeColor(event.type)
                          )}
                        >
                          {event.title}
                        </div>
                      ))}
                      
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 px-1">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Timeline View
  const renderTimelineView = () => {
    return (
      <div className="space-y-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-4">
            {timelineEvents.map((event, index) => {
              const eventDate = parseISO(event.date);
              const isPast = eventDate < new Date();
              
              return (
                <div key={event.id} className="flex gap-4 items-start relative">
                  <div 
                    className={cn(
                      "w-[18px] h-[18px] rounded-full mt-1 flex-shrink-0 z-10",
                      event.status === "completed" ? "bg-green-500" : isPast ? "bg-amber-500" : "bg-blue-500"
                    )}
                  ></div>
                  
                  <Card className="flex-1">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="font-medium text-lg">{event.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <CalendarIcon className="h-4 w-4" />
                            {format(parseISO(event.date), "MMM d, yyyy")}
                            <Clock className="h-4 w-4 ml-2" />
                            {event.time}
                          </div>
                        </div>
                        
                        <Badge className={cn(
                          "mt-2 sm:mt-0",
                          getEventTypeColor(event.type)
                        )}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render calendar view
  const renderCalendarView = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                className="rounded-md pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="bg-white p-4 rounded-md border shadow-sm">
          <h3 className="font-medium text-lg mb-4">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h3>
          
          {eventsForSelectedDate.length > 0 ? (
            <div className="space-y-3">
              {eventsForSelectedDate.map(event => (
                <Card key={event.id} className="overflow-hidden">
                  <div className={cn(
                    "h-1",
                    event.status === "completed" ? "bg-green-500" : "bg-blue-500"
                  )}></div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </div>
                      </div>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No events scheduled for this day
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Schedule</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>
      
      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-blue-700">Total Events</span>
            <div className="p-1.5 bg-blue-100 rounded-full">
              <CalendarIcon className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-blue-800">{totalEvents}</div>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-amber-700">Scheduled</span>
            <div className="p-1.5 bg-amber-100 rounded-full">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-amber-800">{scheduledEvents}</div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-green-700">Completed</span>
            <div className="p-1.5 bg-green-100 rounded-full">
              <BarChart className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-green-800">{completedEvents}</div>
        </Card>
      </div>
      
      {/* View selector */}
      <Card className="bg-white border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-medium text-gray-600 mr-2">View:</h3>
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as 'calendar' | 'timeline' | 'month')}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="month" className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  Month
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  Day View
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      {/* Content based on selected view */}
      <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
        <CardContent className="p-6">
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'calendar' && renderCalendarView()}
          {viewMode === 'timeline' && renderTimelineView()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectScheduleAndTasksTab;
