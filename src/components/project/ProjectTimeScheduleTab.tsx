
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { format, addDays, isToday, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, Plus, X, Check, FileText, MapPin, Bell, BellRing, CalendarDays, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ProjectStaff } from "@/types/project";

interface ProjectTimeScheduleTabProps {
  projectId: number;
  projectStaff?: ProjectStaff[];
}

// Event types
interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  assignedTo?: string[];
  status: "scheduled" | "completed" | "cancelled";
  type: "meeting" | "deadline" | "milestone" | "task" | "inspection" | "reminder";
}

type CalendarViewMode = "day" | "week" | "month";

export default function ProjectTimeScheduleTab({ projectId, projectStaff = [] }: ProjectTimeScheduleTabProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("calendar");
  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: "event-1",
      title: "Project Kickoff Meeting",
      start: new Date(2024, 5, 20, 9, 0),
      end: new Date(2024, 5, 20, 11, 0),
      location: "Conference Room A",
      description: "Initial meeting to discuss project goals and timelines.",
      assignedTo: projectStaff.slice(0, 3).map(staff => staff.id),
      status: "scheduled",
      type: "meeting"
    },
    {
      id: "event-2",
      title: "Design Phase Deadline",
      start: new Date(2024, 6, 15),
      end: new Date(2024, 6, 15),
      description: "Deadline for completing the design phase of the project.",
      assignedTo: projectStaff.slice(1, 4).map(staff => staff.id),
      status: "scheduled",
      type: "deadline"
    },
    {
      id: "event-3",
      title: "Construction Milestone",
      start: new Date(2024, 7, 10),
      end: new Date(2024, 7, 10),
      description: "Completion of the foundation and framing.",
      assignedTo: projectStaff.slice(0, 2).map(staff => staff.id),
      status: "completed",
      type: "milestone"
    },
    {
      id: "event-4",
      title: "Client Inspection",
      start: new Date(2024, 7, 25, 14, 0),
      end: new Date(2024, 7, 25, 16, 0),
      location: "Project Site",
      description: "Client visit to inspect progress.",
      assignedTo: projectStaff.slice(2, 5).map(staff => staff.id),
      status: "scheduled",
      type: "inspection"
    },
    {
      id: "event-5",
      title: "Electrical Wiring Task",
      start: new Date(2024, 8, 5, 8, 0),
      end: new Date(2024, 8, 7, 17, 0),
      description: "Complete electrical wiring for the building.",
      assignedTo: projectStaff.slice(1, 3).map(staff => staff.id),
      status: "scheduled",
      type: "task"
    },
    {
      id: "event-6",
      title: "Order Materials Reminder",
      start: new Date(2024, 5, 25, 10, 0),
      end: new Date(2024, 5, 25, 10, 30),
      description: "Remember to order construction materials for next phase.",
      status: "scheduled",
      type: "reminder"
    },
    {
      id: "event-7",
      title: "Invoice Due Reminder",
      start: new Date(2024, 6, 5, 9, 0),
      end: new Date(2024, 6, 5, 9, 30),
      description: "Client invoice is due today.",
      status: "scheduled",
      type: "reminder"
    }
  ]);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [showAddReminderDialog, setShowAddReminderDialog] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<ScheduleEvent, "id">>({
    title: "",
    start: new Date(),
    end: new Date(),
    location: "",
    description: "",
    assignedTo: [],
    status: "scheduled",
    type: "meeting"
  });
  const [newReminder, setNewReminder] = useState<Omit<ScheduleEvent, "id">>({
    title: "",
    start: new Date(),
    end: new Date(new Date().getTime() + 30 * 60000), // 30 minutes later
    description: "",
    status: "scheduled",
    type: "reminder"
  });
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [showReminders, setShowReminders] = useState(true);
  
  // New state for calendar view mode
  const [calendarViewMode, setCalendarViewMode] = useState<CalendarViewMode>("month");
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  const handleAddEvent = () => {
    const newEventWithId: ScheduleEvent = {
      id: `event-${events.length + 1}`,
      ...newEvent
    };
    setEvents(prev => [...prev, newEventWithId]);
    setShowAddEventDialog(false);
    setNewEvent({
      title: "",
      start: new Date(),
      end: new Date(),
      location: "",
      description: "",
      assignedTo: [],
      status: "scheduled",
      type: "meeting"
    });
    toast.success("Event added successfully");
  };

  const handleAddReminder = () => {
    const newReminderWithId: ScheduleEvent = {
      id: `reminder-${events.length + 1}`,
      ...newReminder
    };
    setEvents(prev => [...prev, newReminderWithId]);
    setShowAddReminderDialog(false);
    setNewReminder({
      title: "",
      start: new Date(),
      end: new Date(new Date().getTime() + 30 * 60000),
      description: "",
      status: "scheduled",
      type: "reminder"
    });
    toast.success("Reminder added successfully");
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    setSelectedEvent(null);
    toast.success("Event deleted successfully");
  };

  const handleUpdateEventStatus = (id: string, status: ScheduleEvent["status"]) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, status: status } : event
      )
    );
    setSelectedEvent(prev => (prev?.id === id ? { ...prev, status: status } : prev) || null);
    toast.success(`Event ${status} successfully`);
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <BellRing className="h-4 w-4 text-purple-600" />;
      case "meeting":
        return <CalendarIcon className="h-4 w-4 text-blue-600" />;
      case "deadline":
        return <Clock className="h-4 w-4 text-red-600" />;
      case "milestone":
        return <Check className="h-4 w-4 text-green-600" />;
      case "inspection":
        return <FileText className="h-4 w-4 text-amber-600" />;
      case "task":
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <CalendarIcon className="h-4 w-4 text-blue-600" />;
    }
  };

  const getEventTypeBadgeColor = (type: string) => {
    switch (type) {
      case "reminder":
        return "bg-purple-100 text-purple-800";
      case "meeting":
        return "bg-blue-100 text-blue-800";
      case "deadline":
        return "bg-red-100 text-red-800";
      case "milestone":
        return "bg-green-100 text-green-800";
      case "inspection":
        return "bg-amber-100 text-amber-800";
      case "task":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Navigate to previous period based on current view
  const goToPrevious = () => {
    const newDate = new Date(currentViewDate);
    switch (calendarViewMode) {
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setCurrentViewDate(newDate);
    setDate(newDate);
  };
  
  // Navigate to next period based on current view
  const goToNext = () => {
    const newDate = new Date(currentViewDate);
    switch (calendarViewMode) {
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setCurrentViewDate(newDate);
    setDate(newDate);
  };
  
  // Reset to today
  const goToToday = () => {
    setCurrentViewDate(new Date());
    setDate(new Date());
  };

  // Filter events based on showReminders toggle
  const filteredEvents = showReminders 
    ? events 
    : events.filter(event => event.type !== "reminder");
    
  // Count for display in tabs and sidebar
  const remindersCount = events.filter(event => event.type === "reminder").length;
  const todayRemindersCount = events.filter(event => 
    event.type === "reminder" && isToday(event.start)
  ).length;
  
  const upcomingReminders = events
    .filter(event => event.type === "reminder" && event.status === "scheduled")
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5);
  
  // Filter events for the day view
  const getDayEvents = (date: Date) => {
    return filteredEvents.filter(event => 
      isSameDay(event.start, date)
    );
  };
  
  // Get week dates for week view
  const getWeekDates = (date: Date) => {
    const week = [];
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + (start.getDay() === 0 ? -6 : 1)); // Start with Monday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      week.push(day);
    }
    
    return week;
  };
  
  // Format date range for display in header
  const getViewDateTitle = () => {
    switch (calendarViewMode) {
      case "day":
        return format(currentViewDate, "MMMM d, yyyy");
      case "week": {
        const weekDates = getWeekDates(currentViewDate);
        return `${format(weekDates[0], "MMM d")} - ${format(weekDates[6], "MMM d, yyyy")}`;
      }
      case "month":
        return format(currentViewDate, "MMMM yyyy");
    }
  };
  
  // Render the calendar view based on selected mode
  const renderCalendarView = () => {
    switch (calendarViewMode) {
      case "day":
        return renderDayView();
      case "week":
        return renderWeekView();
      case "month":
        return renderMonthView();
    }
  };
  
  // Render day view with hourly slots
  const renderDayView = () => {
    const dayEvents = getDayEvents(currentViewDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="space-y-4">
        <div className="grid gap-2">
          {hours.map(hour => {
            const timeLabel = `${hour === 0 ? '12' : hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'pm' : 'am'}`;
            const hourEvents = dayEvents.filter(event => event.start.getHours() === hour);
            
            return (
              <div key={hour} className={cn(
                "grid grid-cols-[80px_1fr] gap-2 py-1 pl-1 border-l-4",
                hourEvents.length ? "border-l-primary" : "border-l-gray-200"
              )}>
                <div className="text-sm text-muted-foreground font-medium pt-1.5">
                  {timeLabel}
                </div>
                <div className="space-y-1">
                  {hourEvents.map(event => (
                    <div 
                      key={event.id}
                      className={cn(
                        "p-2 rounded-md text-sm",
                        event.type === "reminder" ? "bg-purple-100 border border-purple-200" : "bg-blue-100 border border-blue-200"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getEventTypeIcon(event.type)}
                          <span className="font-medium">{event.title}</span>
                        </div>
                        <Badge variant="outline" className={getEventTypeBadgeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                      </div>
                      {event.location && (
                        <div className="text-xs flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render week view with days as columns
  const renderWeekView = () => {
    const weekDates = getWeekDates(currentViewDate);
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((day, index) => (
            <div 
              key={index} 
              className={cn(
                "text-center p-2 font-medium border-b-2",
                isToday(day) ? "border-primary" : "border-transparent"
              )}
            >
              <div className="text-sm">{format(day, "EEE")}</div>
              <div className={cn(
                "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm",
                isToday(day) ? "bg-primary text-primary-foreground" : ""
              )}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2 min-h-[400px]">
          {weekDates.map((day, index) => {
            const dayEvents = getDayEvents(day);
            const reminderCount = dayEvents.filter(e => e.type === "reminder").length;
            const otherCount = dayEvents.length - reminderCount;
            
            return (
              <div 
                key={index} 
                className={cn(
                  "border rounded-md p-2 h-full",
                  isToday(day) ? "bg-blue-50 border-primary" : ""
                )}
              >
                <div className="space-y-2">
                  {dayEvents.length > 0 ? (
                    <>
                      {dayEvents.map(event => (
                        <div 
                          key={event.id} 
                          className={cn(
                            "p-1.5 rounded text-xs cursor-pointer hover:opacity-80",
                            event.type === "reminder" ? "bg-purple-100 border border-purple-200" : 
                            event.type === "meeting" ? "bg-blue-100 border border-blue-200" :
                            event.type === "deadline" ? "bg-red-100 border border-red-200" : 
                            event.type === "milestone" ? "bg-green-100 border border-green-200" : 
                            "bg-gray-100 border border-gray-200"
                          )}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="flex items-center gap-1 mb-0.5">
                            {getEventTypeIcon(event.type)}
                            <span className="font-medium truncate">{event.title}</span>
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {format(event.start, "h:mm a")}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center text-xs text-muted-foreground py-2">
                      No events
                    </div>
                  )}
                </div>
                
                {(reminderCount > 0 || otherCount > 0) && (
                  <div className="flex justify-between text-xs mt-2 pt-2 border-t">
                    {reminderCount > 0 && (
                      <span className="flex items-center gap-1 text-purple-600">
                        <BellRing className="h-3 w-3" />
                        {reminderCount}
                      </span>
                    )}
                    {otherCount > 0 && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <CalendarIcon className="h-3 w-3" />
                        {otherCount}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render month view with calendar
  const renderMonthView = () => {
    return (
      <div>
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={setDate}
          month={currentViewDate}
          className={cn("border rounded-md bg-white p-1 w-full", "pointer-events-auto")}
          modifiers={{
            hasEvent: (day) => filteredEvents.some(event => isSameDay(event.start, day))
          }}
          modifiersClassNames={{
            hasEvent: "font-bold"
          }}
          components={{
            Day: ({ date: dayDate, ...props }) => {
              const dayEvents = getDayEvents(dayDate);
              const hasEvents = dayEvents.length > 0;
              const reminderCount = dayEvents.filter(e => e.type === "reminder").length;
              const otherCount = dayEvents.length - reminderCount;
              
              return (
                <div className="relative">
                  <button 
                    type="button" 
                    {...props} 
                    className={cn(
                      props.className,
                      "h-12 w-12 p-0 font-normal relative",
                      isToday(dayDate) && "bg-blue-50",
                      hasEvents && "font-medium"
                    )}
                  >
                    <time dateTime={format(dayDate, "yyyy-MM-dd")}>
                      {format(dayDate, "d")}
                    </time>
                    
                    {hasEvents && (
                      <div className="absolute bottom-1 left-0 right-0 flex justify-center items-center gap-1 text-[10px]">
                        {reminderCount > 0 && (
                          <span className="flex items-center text-xs bg-purple-100 text-purple-800 px-1 rounded">
                            {reminderCount}
                          </span>
                        )}
                        {otherCount > 0 && (
                          <span className="flex items-center text-xs bg-blue-100 text-blue-800 px-1 rounded">
                            {otherCount}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              );
            }
          }}
        />
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-800"></div>
            <span className="text-xs">Reminders</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-800"></div>
            <span className="text-xs">Meetings</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-100 border border-red-800"></div>
            <span className="text-xs">Deadlines</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-800"></div>
            <span className="text-xs">Milestones</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Schedule</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Show Reminders</span>
            <Switch 
              checked={showReminders} 
              onCheckedChange={setShowReminders} 
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowAddReminderDialog(true)} 
              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
            >
              <Bell size={16} /> Add Reminder
            </Button>
            <Button onClick={() => setShowAddEventDialog(true)} className="flex items-center gap-2">
              <Plus size={16} /> Add Event
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="calendar" variant="blue">Calendar View</TabsTrigger>
          <TabsTrigger value="list" variant="blue">List View</TabsTrigger>
          <TabsTrigger value="staff" variant="blue">Staff Schedule</TabsTrigger>
          <TabsTrigger value="reminders" variant="blue">
            <div className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              Reminders ({remindersCount})
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-3">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Project Calendar</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="bg-card border rounded-md flex p-0.5">
                      <Button 
                        variant={calendarViewMode === "day" ? "default" : "ghost"} 
                        size="sm"
                        onClick={() => setCalendarViewMode("day")}
                        className="rounded-r-none text-xs h-8"
                      >
                        Day
                      </Button>
                      <Button 
                        variant={calendarViewMode === "week" ? "default" : "ghost"} 
                        size="sm"
                        onClick={() => setCalendarViewMode("week")}
                        className="rounded-none text-xs h-8"
                      >
                        Week
                      </Button>
                      <Button 
                        variant={calendarViewMode === "month" ? "default" : "ghost"} 
                        size="sm"
                        onClick={() => setCalendarViewMode("month")}
                        className="rounded-l-none text-xs h-8"
                      >
                        Month
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="h-8" onClick={goToToday}>Today</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between px-4">
                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={goToPrevious}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h3 className="text-lg font-medium">{getViewDateTitle()}</h3>
                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={goToNext}>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
                
                {renderCalendarView()}
              </CardContent>
            </Card>
            
            {/* Right sidebar with reminders */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BellRing className="h-5 w-5 text-purple-600" />
                  Today's Reminders
                  {todayRemindersCount > 0 && (
                    <Badge className="ml-2 bg-purple-100 text-purple-800 hover:bg-purple-200">
                      {todayRemindersCount}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingReminders.filter(event => isToday(event.start)).length > 0 ? (
                    upcomingReminders
                      .filter(event => isToday(event.start))
                      .map(reminder => (
                        <Card key={reminder.id} className="border-purple-200 shadow-sm">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <BellRing className="h-4 w-4 text-purple-600" />
                                <span className="font-medium">{reminder.title}</span>
                              </div>
                              <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">
                                {format(reminder.start, "h:mm a")}
                              </Badge>
                            </div>
                            {reminder.description && (
                              <p className="text-sm text-gray-600">{reminder.description}</p>
                            )}
                            <div className="flex justify-end gap-2 pt-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-xs"
                                onClick={() => setSelectedEvent(reminder)}
                              >
                                View
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleUpdateEventStatus(reminder.id, "completed")}
                              >
                                <Check className="h-3 w-3 mr-1" /> Done
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <BellRing className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p>No reminders for today</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 mb-2">
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Upcoming Reminders
                  </h4>
                  {upcomingReminders.filter(event => !isToday(event.start)).length > 0 ? (
                    <div className="space-y-2">
                      {upcomingReminders
                        .filter(event => !isToday(event.start))
                        .map(reminder => (
                          <div 
                            key={reminder.id} 
                            className="flex items-center justify-between p-2 rounded-md bg-gray-50 border cursor-pointer hover:bg-gray-100"
                            onClick={() => setSelectedEvent(reminder)}
                          >
                            <div className="flex items-center gap-2">
                              <BellRing className="h-3 w-3 text-purple-600" />
                              <span className="text-sm truncate max-w-[140px]">{reminder.title}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{format(reminder.start, "MMM d")}</span>
                          </div>
                        ))
                      }
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full mt-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        onClick={() => setActiveTab("reminders")}
                      >
                        View all reminders
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-center py-2 text-muted-foreground">No upcoming reminders</p>
                  )}
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700" 
                    onClick={() => setShowAddReminderDialog(true)}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Add New Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(event => (
                    <Card key={event.id} className={event.type === "reminder" ? "border-purple-200" : ""}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <div className="flex items-center gap-2">
                            {getEventTypeIcon(event.type)}
                            <p className="font-medium">{event.title}</p>
                            <Badge className={getEventTypeBadgeColor(event.type)}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(event.start, "PPP")} • {format(event.start, "p")} - {format(event.end, "p")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={
                            event.status === "completed" ? "bg-green-100 text-green-800" : 
                            event.status === "cancelled" ? "bg-red-100 text-red-800" : 
                            "bg-blue-100 text-blue-800"
                          }>
                            {event.status === "scheduled" ? "Scheduled" : 
                             event.status === "completed" ? "Completed" : "Cancelled"}
                          </Badge>
                          <Button variant="secondary" size="sm" onClick={() => setSelectedEvent(event)}>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground">No events scheduled.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Schedules</CardTitle>
            </CardHeader>
            <CardContent>
              {projectStaff.length > 0 ? (
                projectStaff.map(staff => (
                  <div key={staff.id} className="mb-4">
                    <h3 className="text-lg font-semibold">{staff.name}</h3>
                    <p className="text-muted-foreground">{staff.role}</p>
                    <ul className="mt-2 space-y-1">
                      {filteredEvents
                        .filter(event => event.assignedTo?.includes(staff.id))
                        .map(event => (
                          <li key={event.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getEventTypeIcon(event.type)}
                              <span>{event.title}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(event.start, "MMM d, h:mm a")}
                              </span>
                            </div>
                            <Badge className={
                              event.status === "completed" ? "bg-green-100 text-green-800" : 
                              event.status === "cancelled" ? "bg-red-100 text-red-800" : 
                              "bg-blue-100 text-blue-800"
                            }>
                              {event.status === "scheduled" ? "Scheduled" : 
                              event.status === "completed" ? "Completed" : "Cancelled"}
                            </Badge>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No staff assigned to this project.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reminders Tab */}
        <TabsContent value="reminders" className="py-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Project Reminders</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 text-purple-800 border-purple-300 hover:bg-purple-50" 
                  onClick={() => setShowAddReminderDialog(true)}
                >
                  <Plus size={14} /> Add Reminder
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.filter(event => event.type === "reminder").length > 0 ? (
                  events
                    .filter(event => event.type === "reminder")
                    .sort((a, b) => a.start.getTime() - b.start.getTime())
                    .map(event => (
                      <Card key={event.id} className="border-purple-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BellRing className="h-5 w-5 text-purple-600" />
                              <p className="font-medium">{event.title}</p>
                            </div>
                            <Badge className={
                              event.status === "completed" ? "bg-green-100 text-green-800" : 
                              event.status === "cancelled" ? "bg-red-100 text-red-800" : 
                              "bg-blue-100 text-blue-800"
                            }>
                              {event.status === "scheduled" ? "Scheduled" : 
                               event.status === "completed" ? "Completed" : "Cancelled"}
                            </Badge>
                          </div>
                          
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                          )}
                          
                          <div className="flex items-center gap-2 mt-3">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                            <p className="text-sm text-gray-600">
                              {format(event.start, "PPP")} at {format(event.start, "h:mm a")}
                            </p>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-3">
                            {event.status === "scheduled" && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100"
                                onClick={() => handleUpdateEventStatus(event.id, "completed")}
                              >
                                <Check size={14} /> Mark as Done
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedEvent(event)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-purple-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-800 mb-1">No reminders yet</p>
                    <p className="text-gray-500 mb-4">Add reminders to keep track of important events</p>
                    <Button 
                      onClick={() => setShowAddReminderDialog(true)}
                      className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus size={16} /> Add Your First Reminder
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Event Dialog */}
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="event-type" className="text-sm font-medium">
                Event Type
              </label>
              <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value as ScheduleEvent["type"] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          
            <div className="grid gap-2">
              <label htmlFor="event-title" className="text-sm font-medium">
                Event Title
              </label>
              <Input
                id="event-title"
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="event-start" className="text-sm font-medium">
                  Start Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !newEvent.start && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newEvent.start ? format(newEvent.start, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newEvent.start}
                      onSelect={(date) => setNewEvent({ ...newEvent, start: date || new Date() })}
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <label htmlFor="event-end" className="text-sm font-medium">
                  End Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !newEvent.end && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newEvent.end ? format(newEvent.end, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newEvent.end}
                      onSelect={(date) => setNewEvent({ ...newEvent, end: date || new Date() })}
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="event-location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="event-location"
                value={newEvent.location}
                onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="event-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="event-description"
                value={newEvent.description}
                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddEvent}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Reminder Dialog */}
      <Dialog open={showAddReminderDialog} onOpenChange={setShowAddReminderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              Add New Reminder
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="reminder-title" className="text-sm font-medium">
                Reminder Title
              </label>
              <Input
                id="reminder-title"
                placeholder="What do you need to remember?"
                value={newReminder.title}
                onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="reminder-date" className="text-sm font-medium">
                Reminder Date & Time
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal",
                        !newReminder.start && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newReminder.start ? format(newReminder.start, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newReminder.start}
                      onSelect={(date) => {
                        if (date) {
                          const currentStart = newReminder.start;
                          const hours = currentStart.getHours();
                          const minutes = currentStart.getMinutes();
                          
                          const newDate = new Date(date);
                          newDate.setHours(hours, minutes);
                          
                          setNewReminder({
                            ...newReminder,
                            start: newDate,
                            end: new Date(newDate.getTime() + 30 * 60000) // 30 min later
                          });
                        }
                      }}
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
                
                <div>
                  <Input 
                    type="time"
                    value={`${newReminder.start.getHours().toString().padStart(2, '0')}:${newReminder.start.getMinutes().toString().padStart(2, '0')}`}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      
                      const newDate = new Date(newReminder.start);
                      newDate.setHours(hours, minutes);
                      
                      setNewReminder({
                        ...newReminder,
                        start: newDate,
                        end: new Date(newDate.getTime() + 30 * 60000) // 30 min later
                      });
                    }}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="reminder-description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="reminder-description"
                placeholder="Add more details about this reminder"
                value={newReminder.description || ""}
                onChange={e => setNewReminder({ ...newReminder, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleAddReminder}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Bell className="h-4 w-4 mr-2" /> Add Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getEventTypeIcon(selectedEvent.type)}
                {selectedEvent.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={getEventTypeBadgeColor(selectedEvent.type)}>
                  {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                </Badge>
                <Badge className={
                  selectedEvent.status === "completed" ? "bg-green-100 text-green-800" : 
                  selectedEvent.status === "cancelled" ? "bg-red-100 text-red-800" : 
                  "bg-blue-100 text-blue-800"
                }>
                  {selectedEvent.status === "scheduled" ? "Scheduled" : 
                   selectedEvent.status === "completed" ? "Completed" : "Cancelled"}
                </Badge>
              </div>
            
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CalendarIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedEvent.start, "PPP")} • {format(selectedEvent.start, "p")} - {format(selectedEvent.end, "p")}
                  </p>
                </div>
              </div>

              {selectedEvent.location && (
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                </div>
              </div>

              {selectedEvent.assignedTo && selectedEvent.assignedTo.length > 0 && (
                <div>
                  <p className="text-sm font-medium">Assigned To</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedEvent.assignedTo.map(staffId => {
                      const staff = projectStaff.find(s => s.id === staffId);
                      return staff ? (
                        <Badge key={staff.id} className="bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-1 text-xs">
                          {staff.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="sm:justify-between">
              <div>
                <Badge className={
                  selectedEvent.status === "completed" ? "bg-green-100 text-green-800" : 
                  selectedEvent.status === "cancelled" ? "bg-red-100 text-red-800" : 
                  "bg-blue-100 text-blue-800"
                }>
                  {selectedEvent.status === "scheduled" ? "Scheduled" : 
                   selectedEvent.status === "completed" ? "Completed" : "Cancelled"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                  Delete
                </Button>
                {selectedEvent.status === "scheduled" && (
                  <>
                    <Button variant="outline" onClick={() => handleUpdateEventStatus(selectedEvent.id, "cancelled")} className="border-red-200 text-red-600 hover:bg-red-50">
                      <X size={16} className="mr-1" /> Cancel
                    </Button>
                    <Button onClick={() => handleUpdateEventStatus(selectedEvent.id, "completed")} className="bg-green-600 hover:bg-green-700">
                      <Check size={16} className="mr-1" /> Complete
                    </Button>
                  </>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
