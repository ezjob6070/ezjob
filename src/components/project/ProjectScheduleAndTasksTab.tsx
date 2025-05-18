
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, ArrowRight, Clock, BarChart, List, 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon,
  BellRing, Clock3, LayoutList, TimerIcon
} from "lucide-react";
import { Project, ProjectStaff, ProjectTask } from "@/types/project";
import { format, addDays, addMonths, subMonths, parseISO, isToday, isSameMonth, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarViewMode } from "@/components/schedule/CalendarViewOptions";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ProjectScheduleAndTasksTabProps {
  project: Project;
  projectStaff?: ProjectStaff[];
}

// Event types for project schedule
interface ScheduleEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "meeting" | "delivery" | "construction" | "inspection" | "reminder";
  status: "scheduled" | "completed" | "cancelled";
  description?: string;
  location?: string;
  assignedTo?: string[];
}

const ProjectScheduleAndTasksTab = ({ project, projectStaff }: ProjectScheduleAndTasksTabProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline' | 'list' | 'reminders'>('calendar');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showEventDetails, setShowEventDetails] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  
  // Sample events for the project calendar
  const events: ScheduleEvent[] = [
    {
      id: 1,
      title: "Site Inspection",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "09:00 AM - 11:00 AM",
      type: "meeting",
      status: "completed",
      description: "Initial site inspection with project manager and client",
      location: "Project Site",
      assignedTo: projectStaff?.slice(0, 2).map(staff => staff.id)
    },
    {
      id: 2,
      title: "Material Delivery",
      date: format(addDays(new Date(), 2), "yyyy-MM-dd"),
      time: "01:00 PM - 03:00 PM",
      type: "delivery",
      status: "scheduled",
      description: "Delivery of construction materials",
      location: "Project Site"
    },
    {
      id: 3,
      title: "Foundation Work",
      date: format(addDays(new Date(), 5), "yyyy-MM-dd"),
      time: "08:00 AM - 05:00 PM",
      type: "construction",
      status: "scheduled",
      description: "Begin foundation work",
      location: "Project Site",
      assignedTo: projectStaff?.slice(1, 4).map(staff => staff.id)
    },
    {
      id: 4,
      title: "Client Meeting",
      date: format(addDays(new Date(), 7), "yyyy-MM-dd"),
      time: "02:00 PM - 03:00 PM",
      type: "meeting",
      status: "scheduled",
      description: "Progress update meeting with client",
      location: "Office"
    },
    {
      id: 5,
      title: "Electrical Installation",
      date: format(addDays(new Date(), 10), "yyyy-MM-dd"),
      time: "08:00 AM - 05:00 PM",
      type: "construction",
      status: "scheduled",
      description: "Electrical wiring installation",
      location: "Project Site"
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
    },
    {
      id: 8,
      title: "Submit Permit Application",
      date: format(addDays(new Date(), 3), "yyyy-MM-dd"),
      time: "09:00 AM",
      type: "reminder",
      status: "scheduled",
      description: "Remember to submit building permit application"
    },
    {
      id: 9,
      title: "Call Supplier",
      date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      time: "02:00 PM",
      type: "reminder",
      status: "scheduled",
      description: "Call supplier about delayed materials"
    }
  ];

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const handleAddEvent = () => {
    toast.success("Add event functionality will be implemented here.");
  };

  const handleAddReminder = () => {
    toast.success("Add reminder functionality will be implemented here.");
  };

  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter events for the selected date
  const eventsForSelectedDate = filteredEvents.filter(event => 
    event.date === format(selectedDate, "yyyy-MM-dd")
  );
  
  // Filter events by type - useful for the reminders tab
  const reminderEvents = filteredEvents.filter(event => event.type === "reminder");
  
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
      case "reminder":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <CalendarIcon className="h-4 w-4 text-blue-600" />;
      case "delivery":
        return <ArrowRight className="h-4 w-4 text-amber-600" />;
      case "construction":
        return <BarChart className="h-4 w-4 text-green-600" />;
      case "inspection":
        return <List className="h-4 w-4 text-purple-600" />;
      case "reminder":
        return <BellRing className="h-4 w-4 text-rose-600" />;
      default:
        return <CalendarIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  // Calendar view with day indicators showing events
  const renderCalendar = () => {
    return (
      <div>
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
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          month={currentDate}
          className="rounded-md border shadow-sm"
          components={{
            Day: ({ date, ...props }) => {
              // Check if there are events for this day
              const dateString = format(date, "yyyy-MM-dd");
              const hasEvents = events.some(event => event.date === dateString);
              const hasMeetings = events.some(event => event.date === dateString && event.type === "meeting");
              const hasDeliveries = events.some(event => event.date === dateString && event.type === "delivery");
              const hasConstruction = events.some(event => event.date === dateString && event.type === "construction");
              const hasReminders = events.some(event => event.date === dateString && event.type === "reminder");
              
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, new Date());
              const isCurrentMonth = isSameMonth(date, currentDate);
              
              return (
                <div
                  {...props}
                  className={cn(
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative pointer-events-auto",
                    isToday ? "bg-blue-50 text-blue-900" : "",
                    isSelected ? "bg-primary text-primary-foreground" : "",
                    !isCurrentMonth ? "text-gray-400" : ""
                  )}
                >
                  <div className="flex items-center justify-center h-full">
                    {format(date, "d")}
                  </div>
                  
                  {hasEvents && (
                    <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-1">
                      {hasMeetings && <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>}
                      {hasDeliveries && <div className="h-1.5 w-1.5 bg-amber-500 rounded-full"></div>}
                      {hasConstruction && <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>}
                      {hasReminders && <div className="h-1.5 w-1.5 bg-rose-500 rounded-full"></div>}
                    </div>
                  )}
                </div>
              );
            }
          }}
        />
        
        <div className="flex justify-center gap-4 mt-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Meetings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 bg-amber-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Deliveries</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Construction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 bg-rose-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Reminders</span>
          </div>
        </div>
      </div>
    );
  };

  // Timeline view
  const renderTimeline = () => {
    // Sort events by date
    const sortedEvents = [...filteredEvents].sort((a, b) => {
      const dateA = new Date(a.date + "T" + a.time.split(" - ")[0]).getTime();
      const dateB = new Date(b.date + "T" + b.time.split(" - ")[0]).getTime();
      return dateA - dateB;
    });
    
    return (
      <div className="relative pl-8">
        {/* Vertical timeline line */}
        <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {sortedEvents.map((event) => (
            <div key={event.id} className="relative">
              <div className={cn(
                "absolute left-[-20px] w-7 h-7 rounded-full flex items-center justify-center",
                event.status === "completed" ? "bg-green-100" : 
                event.status === "cancelled" ? "bg-red-100" : "bg-blue-100"
              )}>
                {getEventTypeIcon(event.type)}
              </div>
              
              <div className="bg-white rounded-lg border shadow-sm p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(event.date), "EEEE, MMMM d")} • {event.time}
                    </p>
                    {event.location && (
                      <p className="text-sm text-gray-500">Location: {event.location}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                    <Badge className={getEventStatusColor(event.status)}>{event.status}</Badge>
                  </div>
                </div>
                
                {event.description && (
                  <p className="text-sm mt-2 text-gray-700">{event.description}</p>
                )}
                
                {event.assignedTo && event.assignedTo.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Assigned to:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {event.assignedTo.map(staffId => {
                        const staff = projectStaff?.find(s => s.id === staffId);
                        return staff && (
                          <Badge key={staff.id} variant="outline" className="text-xs">
                            {staff.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3" 
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventDetails(true);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
          
          {sortedEvents.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No events found</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // List view
  const renderList = () => {
    // Group events by date
    const eventsByDate: Record<string, ScheduleEvent[]> = {};
    filteredEvents.forEach(event => {
      if (!eventsByDate[event.date]) {
        eventsByDate[event.date] = [];
      }
      eventsByDate[event.date].push(event);
    });
    
    // Sort dates
    const sortedDates = Object.keys(eventsByDate).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
    
    return (
      <div className="space-y-6">
        {sortedDates.map(date => (
          <div key={date}>
            <h3 className="font-medium text-gray-800 mb-2">
              {format(new Date(date), "EEEE, MMMM d, yyyy")}
            </h3>
            <div className="space-y-2">
              {eventsByDate[date].map(event => (
                <Card key={event.id} className="bg-white">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <div className={cn(
                          "p-2 rounded-full",
                          event.type === "meeting" ? "bg-blue-100" :
                          event.type === "delivery" ? "bg-amber-100" :
                          event.type === "construction" ? "bg-green-100" :
                          event.type === "inspection" ? "bg-purple-100" :
                          event.type === "reminder" ? "bg-rose-100" : "bg-gray-100"
                        )}>
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-500">{event.time}</p>
                          {event.location && (
                            <p className="text-sm text-gray-500">{event.location}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                        <Badge className={getEventStatusColor(event.status)}>{event.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        
        {sortedDates.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No events found</p>
          </div>
        )}
      </div>
    );
  };

  // Reminders view
  const renderReminders = () => {
    return (
      <div className="space-y-4">
        {reminderEvents.length > 0 ? (
          reminderEvents.map(reminder => (
            <Card key={reminder.id} className="bg-white border-l-4 border-l-rose-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="bg-rose-100 p-2 rounded-full">
                      <BellRing className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{reminder.title}</h4>
                      <p className="text-sm text-gray-600">
                        {format(new Date(reminder.date), "EEEE, MMMM d")} at {reminder.time}
                      </p>
                      {reminder.description && (
                        <p className="text-sm mt-2">{reminder.description}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={getEventStatusColor(reminder.status)}>{reminder.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-10">
            <BellRing className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No reminders found</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={handleAddReminder}>
              <Plus className="h-4 w-4 mr-1" /> Add Reminder
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Render events for selected date (for calendar view)
  const renderEventsForSelectedDate = () => {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-lg">
          Events for {format(selectedDate, "MMMM d, yyyy")}
        </h3>
        
        {eventsForSelectedDate.length > 0 ? (
          <div className="space-y-3">
            {eventsForSelectedDate.map(event => (
              <Card key={event.id} className="bg-white">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <div className={cn(
                        "p-2 rounded-full",
                        event.type === "meeting" ? "bg-blue-100" :
                        event.type === "delivery" ? "bg-amber-100" :
                        event.type === "construction" ? "bg-green-100" :
                        event.type === "inspection" ? "bg-purple-100" :
                        event.type === "reminder" ? "bg-rose-100" : "bg-gray-100"
                      )}>
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-500">{event.time}</p>
                        {event.location && (
                          <p className="text-sm text-gray-500">{event.location}</p>
                        )}
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                      <Badge className={getEventStatusColor(event.status)}>{event.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-md border">
            <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No events for this date</p>
            <div className="flex justify-center mt-4 gap-2">
              <Button size="sm" variant="outline" onClick={handleAddEvent}>
                <Plus className="h-4 w-4 mr-1" /> Add Event
              </Button>
              <Button size="sm" variant="outline" onClick={handleAddReminder}>
                <BellRing className="h-4 w-4 mr-1" /> Add Reminder
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Metrics cards
  const completedEvents = events.filter(event => event.status === "completed").length;
  const totalEvents = events.length;
  const scheduledEvents = events.filter(event => event.status === "scheduled").length;
  const reminderCount = events.filter(event => event.type === "reminder").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Schedule</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleAddReminder} className="bg-rose-600 text-white hover:bg-rose-700">
            <BellRing className="h-4 w-4 mr-1" /> Add Reminder
          </Button>
          <Button onClick={handleAddEvent}>
            <Plus className="h-4 w-4 mr-1" /> Add Event
          </Button>
        </div>
      </div>
      
      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        
        <Card className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-4 border border-rose-100 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-rose-700">Reminders</span>
            <div className="p-1.5 bg-rose-100 rounded-full">
              <BellRing className="h-4 w-4 text-rose-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-rose-800">{reminderCount}</div>
        </Card>
      </div>
      
      {/* View selector */}
      <Tabs 
        value={viewMode} 
        onValueChange={(value) => setViewMode(value as 'calendar' | 'timeline' | 'list' | 'reminders')}
      >
        <TabsList>
          <TabsTrigger value="calendar" className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-1">
            <Clock3 className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-1">
            <LayoutList className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-1">
            <BellRing className="h-4 w-4" />
            Reminders
          </TabsTrigger>
        </TabsList>
        
        <div className="my-4">
          <Input
            placeholder="Search events and reminders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <TabsContent value="calendar">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4 bg-white">
                  {renderCalendar()}
                </div>
                <div className="border rounded-lg p-4 bg-white overflow-auto max-h-[500px]">
                  {renderEventsForSelectedDate()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              {renderTimeline()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              {renderList()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reminders">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              {renderReminders()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Event Details Dialog could be implemented here */}
    </div>
  );
};

export default ProjectScheduleAndTasksTab;
