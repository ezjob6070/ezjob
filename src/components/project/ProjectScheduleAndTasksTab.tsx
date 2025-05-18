import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, ArrowRight, Calendar as CalendarIcon, List, 
  ChevronLeft, ChevronRight, Plus, 
  BellRing, Clock3, LayoutList, CheckCircle2, AlertCircle,
  User, MapPin, FileText, ArrowUp, CircleCheck
} from "lucide-react";
import { Project, ProjectStaff, ProjectTask } from "@/types/project";
import { format, addDays, addMonths, subMonths, parseISO, isToday, isSameMonth, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

// Task interface with more properties for better task cards
interface EnhancedTask {
  id: number;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed" | "blocked" | "review";
  priority: "low" | "medium" | "high" | "urgent";
  deadline: string;
  progress: number;
  assignedTo: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  createdAt: string;
  tags: string[];
  attachments?: number;
  comments?: number;
  location?: string;
}

// New interfaces for dialogs
interface NewEvent {
  title: string;
  date: string;
  time: string;
  endTime?: string;
  type: "meeting" | "delivery" | "construction" | "inspection";
  description?: string;
  location?: string;
  assignedTo?: string[];
}

interface NewReminder {
  title: string;
  date: string;
  time: string;
  description?: string;
}

interface NewTask {
  title: string;
  description: string;
  deadline: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo: string[];
  tags: string[];
  location?: string;
}

const ProjectScheduleAndTasksTab = ({ project, projectStaff }: ProjectScheduleAndTasksTabProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline' | 'list' | 'reminders' | 'tasks'>('calendar');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showEventDetails, setShowEventDetails] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [taskView, setTaskView] = useState<'kanban' | 'list'>('list');
  const [taskFilter, setTaskFilter] = useState<'all' | 'in_progress' | 'completed' | 'blocked'>('all');
  
  // States for dialogs
  const [addEventDialogOpen, setAddEventDialogOpen] = useState<boolean>(false);
  const [addReminderDialogOpen, setAddReminderDialogOpen] = useState<boolean>(false);
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState<boolean>(false);
  
  // States for new items
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "09:00 AM",
    endTime: "10:00 AM",
    type: "meeting",
    description: "",
    location: "",
    assignedTo: []
  });

  const [newReminder, setNewReminder] = useState<NewReminder>({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "09:00 AM",
    description: ""
  });

  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    deadline: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    priority: "medium",
    assignedTo: [],
    tags: []
  });
  
  // Sample events for the project calendar
  const [events, setEvents] = useState<ScheduleEvent[]>([
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
  ]);

  // Enhanced tasks for a professional task card design
  const [tasks, setTasks] = useState<EnhancedTask[]>([
    {
      id: 1,
      title: "Foundation Planning",
      description: "Complete foundation planning and get client approval on blueprints",
      status: "completed",
      priority: "high",
      deadline: format(addDays(new Date(), 2), "yyyy-MM-dd"),
      progress: 100,
      assignedTo: [
        { id: "1", name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1" },
        { id: "2", name: "Jane Smith", avatar: "https://i.pravatar.cc/150?img=2" }
      ],
      createdAt: format(subMonths(new Date(), 1), "yyyy-MM-dd"),
      tags: ["Planning", "Design"]
    },
    {
      id: 2,
      title: "Electrical Wiring Installation",
      description: "Complete electrical wiring installation for all floors according to approved plans",
      status: "in_progress",
      priority: "high",
      deadline: format(addDays(new Date(), 5), "yyyy-MM-dd"),
      progress: 65,
      assignedTo: [
        { id: "3", name: "Robert Johnson", avatar: "https://i.pravatar.cc/150?img=3" },
        { id: "4", name: "Lisa Anderson", avatar: "https://i.pravatar.cc/150?img=4" }
      ],
      createdAt: format(addDays(new Date(), -10), "yyyy-MM-dd"),
      tags: ["Electrical", "Installation"],
      attachments: 3,
      comments: 12,
      location: "Main Building, Floor 2"
    },
    {
      id: 3,
      title: "Plumbing System Installation",
      description: "Install all plumbing systems according to the approved plans",
      status: "in_progress",
      priority: "medium",
      deadline: format(addDays(new Date(), 7), "yyyy-MM-dd"),
      progress: 42,
      assignedTo: [
        { id: "5", name: "Michael Brown", avatar: "https://i.pravatar.cc/150?img=5" }
      ],
      createdAt: format(addDays(new Date(), -8), "yyyy-MM-dd"),
      tags: ["Plumbing", "Installation"],
      attachments: 2,
      comments: 5,
      location: "Main Building, All Floors"
    },
    {
      id: 4,
      title: "HVAC System Installation",
      description: "Install HVAC systems and conduct initial testing",
      status: "not_started",
      priority: "medium",
      deadline: format(addDays(new Date(), 12), "yyyy-MM-dd"),
      progress: 0,
      assignedTo: [
        { id: "6", name: "David Wilson", avatar: "https://i.pravatar.cc/150?img=6" },
        { id: "7", name: "Emily Taylor", avatar: "https://i.pravatar.cc/150?img=7" }
      ],
      createdAt: format(addDays(new Date(), -5), "yyyy-MM-dd"),
      tags: ["HVAC", "Installation"]
    },
    {
      id: 5,
      title: "Interior Painting",
      description: "Complete interior painting for all rooms according to approved color schemes",
      status: "blocked",
      priority: "low",
      deadline: format(addDays(new Date(), 15), "yyyy-MM-dd"),
      progress: 10,
      assignedTo: [
        { id: "8", name: "Sarah Miller", avatar: "https://i.pravatar.cc/150?img=8" }
      ],
      createdAt: format(addDays(new Date(), -3), "yyyy-MM-dd"),
      tags: ["Interior", "Painting"],
      attachments: 5,
      comments: 8
    },
    {
      id: 6,
      title: "Quality Inspection",
      description: "Perform detailed quality inspection of all completed work",
      status: "not_started",
      priority: "urgent",
      deadline: format(addDays(new Date(), 20), "yyyy-MM-dd"),
      progress: 0,
      assignedTo: [
        { id: "9", name: "Thomas Clark", avatar: "https://i.pravatar.cc/150?img=9" },
        { id: "10", name: "Jessica Lewis", avatar: "https://i.pravatar.cc/150?img=10" }
      ],
      createdAt: format(addDays(new Date(), -1), "yyyy-MM-dd"),
      tags: ["Inspection", "Quality Control"]
    }
  ]);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  // Dialog handler functions
  const handleAddEventDialogOpen = () => {
    setNewEvent({
      title: "",
      date: format(selectedDate, "yyyy-MM-dd"),
      time: "09:00 AM",
      endTime: "10:00 AM",
      type: "meeting",
      description: "",
      location: "",
      assignedTo: []
    });
    setAddEventDialogOpen(true);
  };

  const handleAddReminderDialogOpen = () => {
    setNewReminder({
      title: "",
      date: format(selectedDate, "yyyy-MM-dd"),
      time: "09:00 AM",
      description: ""
    });
    setAddReminderDialogOpen(true);
  };

  const handleAddTaskDialogOpen = () => {
    setNewTask({
      title: "",
      description: "",
      deadline: format(addDays(selectedDate, 7), "yyyy-MM-dd"),
      priority: "medium",
      assignedTo: [],
      tags: []
    });
    setAddTaskDialogOpen(true);
  };
  
  // Action handlers
  const handleAddEvent = () => {
    const newEventWithId: ScheduleEvent = {
      id: events.length + 10,
      title: newEvent.title,
      date: newEvent.date,
      time: `${newEvent.time} - ${newEvent.endTime}`,
      type: newEvent.type,
      status: "scheduled",
      description: newEvent.description,
      location: newEvent.location,
      assignedTo: newEvent.assignedTo
    };
    
    setEvents([...events, newEventWithId]);
    setAddEventDialogOpen(false);
    toast.success("Event added successfully");
  };

  const handleAddReminder = () => {
    const newReminderWithId: ScheduleEvent = {
      id: events.length + 10,
      title: newReminder.title,
      date: newReminder.date,
      time: newReminder.time,
      type: "reminder",
      status: "scheduled",
      description: newReminder.description
    };
    
    setEvents([...events, newReminderWithId]);
    setAddReminderDialogOpen(false);
    toast.success("Reminder added successfully");
  };

  const handleAddTask = () => {
    const assignedUsers = newTask.assignedTo.map(id => {
      const staff = projectStaff?.find(staff => staff.id === id);
      return {
        id,
        name: staff?.name || "Unknown",
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
      };
    });
    
    const newTaskWithId: EnhancedTask = {
      id: tasks.length + 1,
      title: newTask.title,
      description: newTask.description,
      status: "not_started",
      priority: newTask.priority,
      deadline: newTask.deadline,
      progress: 0,
      assignedTo: assignedUsers,
      createdAt: format(new Date(), "yyyy-MM-dd"),
      tags: newTask.tags,
      location: newTask.location
    };
    
    setTasks([...tasks, newTaskWithId]);
    setAddTaskDialogOpen(false);
    toast.success("Task added successfully");
  };

  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter tasks based on search query and status filter
  const filteredTasks = tasks.filter(task => {
    // Filter by search query
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by status
    const matchesStatus = taskFilter === 'all' || task.status === taskFilter;
    
    return matchesSearch && matchesStatus;
  });

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
    const sortedEvents = [...filteredEvents].sort((a, b) => {
      const dateA = new Date(a.date + "T" + a.time.split(" - ")[0]).getTime();
      const dateB = new Date(b.date + "T" + b.time.split(" - ")[0]).getTime();
      return dateA - dateB;
    });
    
    return (
      <div className="relative pl-8">
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
    const eventsByDate: Record<string, ScheduleEvent[]> = {};
    filteredEvents.forEach(event => {
      if (!eventsByDate[event.date]) {
        eventsByDate[event.date] = [];
      }
      eventsByDate[event.date].push(event);
    });
    
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
            <Button size="sm" variant="outline" className="mt-3" onClick={handleAddReminderDialogOpen}>
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
              <Button size="sm" variant="outline" onClick={handleAddEventDialogOpen}>
                <Plus className="h-4 w-4 mr-1" /> Add Event
              </Button>
              <Button size="sm" variant="outline" onClick={handleAddReminderDialogOpen}>
                <BellRing className="h-4 w-4 mr-1" /> Add Reminder
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // New function: Render tasks in a professional card layout
  const renderTasks = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold">Project Tasks</h3>
            <Badge className="bg-blue-500 text-white">{filteredTasks.length} Tasks</Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setTaskView('list')} 
                className={cn("px-3", taskView === 'list' ? "bg-blue-100 text-blue-800 border-blue-200" : "")}
              >
                <List className="h-4 w-4 mr-1" /> List
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setTaskView('kanban')} 
                className={cn("px-3", taskView === 'kanban' ? "bg-blue-100 text-blue-800 border-blue-200" : "")}
              >
                <LayoutList className="h-4 w-4 mr-1" /> Kanban
              </Button>
            </div>
            
            <Button onClick={handleAddTaskDialogOpen}>
              <Plus className="h-4 w-4 mr-1" /> Add Task
            </Button>
          </div>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setTaskFilter('all')} 
            className={cn(taskFilter === 'all' ? "bg-gray-100 border-gray-300" : "")}
          >
            All Tasks
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setTaskFilter('in_progress')} 
            className={cn(taskFilter === 'in_progress' ? "bg-blue-100 text-blue-800 border-blue-200" : "")}
          >
            In Progress
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setTaskFilter('completed')} 
            className={cn(taskFilter === 'completed' ? "bg-green-100 text-green-800 border-green-200" : "")}
          >
            Completed
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setTaskFilter('blocked')} 
            className={cn(taskFilter === 'blocked' ? "bg-red-100 text-red-800 border-red-200" : "")}
          >
            Blocked
          </Button>
        </div>
        
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 border rounded-lg">
            <LayoutList className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No tasks found matching your criteria</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={handleAddTaskDialogOpen}>
              <Plus className="h-4 w-4 mr-1" /> Add New Task
            </Button>
          </div>
        ) : taskView === 'list' ? (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden border-l-4 hover:shadow-md transition-shadow" style={{
                borderLeftColor: task.status === 'completed' ? '#10B981' : 
                                task.status === 'in_progress' ? '#3B82F6' : 
                                task.status === 'blocked' ? '#EF4444' : '#6B7280'
              }}>
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-1.5 rounded-full", 
                          task.status === 'completed' ? "bg-green-100" : 
                          task.status === 'in_progress' ? "bg-blue-100" : 
                          task.status === 'blocked' ? "bg-red-100" : "bg-gray-100"
                        )}>
                          {getTaskStatusIcon(task.status)}
                        </div>
                        <h4 className="font-semibold">{task.title}</h4>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getTaskPriorityColor(task.priority)}>
                          {task.priority === 'urgent' && <ArrowUp className="h-3 w-3 mr-1" />}
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                        <Badge className={getTaskStatusColor(task.status)}>
                          {task.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5">
                        <Clock3 className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">Due: {format(new Date(task.deadline), "MMM d, yyyy")}</span>
                        
                        {task.location && (
                          <div className="flex items-center ml-3">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500 ml-1">{task.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {task.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-medium">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-1.5" />
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
                      <div className="flex items-center -space-x-2">
                        {task.assignedTo.map((person) => (
                          <Avatar key={person.id} className="h-6 w-6 border border-white">
                            <AvatarImage src={person.avatar} alt={person.name} />
                            <AvatarFallback className="text-xs">{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        ))}
                        {task.assignedTo.length > 0 && (
                          <span className="text-xs text-gray-500 ml-3">
                            {task.assignedTo.length} {task.assignedTo.length === 1 ? 'person' : 'people'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {task.comments && (
                          <div className="flex items-center text-xs text-gray-500">
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            {task.comments}
                          </div>
                        )}
                        {task.attachments && (
                          <div className="flex items-center text-xs text-gray-500">
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            {task.attachments}
                          </div>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => handleTaskAction(task.id, 'view')}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Kanban view (simple version)
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 border">
              <h4 className="font-medium mb-3 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                In Progress ({filteredTasks.filter(t => t.status === 'in_progress').length})
              </h4>
              <div className="space-y-3">
                {filteredTasks.filter(t => t.status === 'in_progress').map(task => (
                  <Card key={task.id} className="bg-white">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium">{task.title}</h5>
                        <Badge className={getTaskPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                      <div className="mt-2">
                        <Progress value={task.progress} className="h-1.5" />
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          {format(new Date(task.deadline), "MMM d")}
                        </div>
                        <div className="flex items-center -space-x-2">
                          {task.assignedTo.slice(0, 3).map((person) => (
                            <Avatar key={person.id} className="h-5 w-5 border border-white">
                              <AvatarFallback className="text-xs">{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 border">
              <h4 className="font-medium mb-3 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                Blocked ({filteredTasks.filter(t => t.status === 'blocked').length})
              </h4>
              <div className="space-y-3">
                {filteredTasks.filter(t => t.status === 'blocked').map(task => (
                  <Card key={task.id} className="bg-white">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium">{task.title}</h5>
                        <Badge className={getTaskPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                      <div className="mt-2">
                        <Progress value={task.progress} className="h-1.5" />
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          {format(new Date(task.deadline), "MMM d")}
                        </div>
                        <div className="flex items-center -space-x-2">
                          {task.assignedTo.slice(0, 3).map((person) => (
                            <Avatar key={person.id} className="h-5 w-5 border border-white">
                              <AvatarFallback className="text-xs">{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 border">
              <h4 className="font-medium mb-3 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Completed ({filteredTasks.filter(t => t.status === 'completed').length})
              </h4>
              <div className="space-y-3">
                {filteredTasks.filter(t => t.status === 'completed').map(task => (
                  <Card key={task.id} className="bg-white">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium">{task.title}</h5>
                        <Badge className={getTaskPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                      <div className="mt-2">
                        <Progress value={task.progress} className="h-1.5" />
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          {format(new Date(task.deadline), "MMM d")}
                        </div>
                        <div className="flex items-center -space-x-2">
                          {task.assignedTo.slice(0, 3).map((person) => (
                            <Avatar key={person.id} className="h-5 w-5 border border-white">
                              <AvatarFallback className="text-xs">{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-2xl font-bold">Project Schedule & Tasks</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleAddReminderDialogOpen} className="flex items-center gap-1 text-rose-600 border-rose-200 hover:bg-rose-50">
            <BellRing className="h-4 w-4 mr-1" /> Add Reminder
          </Button>
          <Button variant="outline" onClick={handleAddTaskDialogOpen} className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50">
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
          <Button onClick={handleAddEventDialogOpen} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-1" /> Add Event
          </Button>
        </div>
      </div>
      
      {/* View selector */}
      <Tabs 
        value={viewMode} 
        onValueChange={(value) => setViewMode(value as 'calendar' | 'timeline' | 'list' | 'reminders' | 'tasks')}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList className="bg-muted/50">
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
            <TabsTrigger value="tasks" className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Tasks
            </TabsTrigger>
          </TabsList>
          
          <Input
            placeholder="Search events and tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <TabsContent value="calendar" className="mt-0">
          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 bg-gradient-to-b from-indigo-50/50 to-white border-r border-gray-100">
                  {renderCalendar()}
                </div>
                <div className="p-6 overflow-auto max-h-[500px]">
                  {renderEventsForSelectedDate()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-0">
          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              {renderTimeline()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              {renderList()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reminders" className="mt-0">
          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              {renderReminders()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-0">
          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              {renderTasks()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Event Dialog */}
      <Dialog open={addEventDialogOpen} onOpenChange={setAddEventDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="event-type" className="text-sm font-medium">
                Event Type
              </label>
              <Select 
                value={newEvent.type} 
                onValueChange={(value) => 
                  setNewEvent({ ...newEvent, type: value as "meeting" | "delivery" | "construction" | "inspection" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
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
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="event-date" className="text-sm font-medium">
                  Date
                </label>
                <Input
                  id="event-date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="event-time" className="text-sm font-medium">
                  Start Time
                </label>
                <Input
                  id="event-time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="event-endtime" className="text-sm font-medium">
                End Time
              </label>
              <Input
                id="event-endtime"
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="event-location" className="text-sm font-medium">
                Location (optional)
              </label>
              <Input
                id="event-location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="Enter location"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="event-description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="event-description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Add more details"
                rows={3}
              />
            </div>
            
            {projectStaff && projectStaff.length > 0 && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Assign Staff (optional)
                </label>
                <Select
                  value={newEvent.assignedTo?.[0]}
                  onValueChange={(value) => setNewEvent({ ...newEvent, assignedTo: [value] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assign staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectStaff.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddEventDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEvent} disabled={!newEvent.title}>Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Reminder Dialog */}
      <Dialog open={addReminderDialogOpen} onOpenChange={setAddReminderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-rose-600" />
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
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="reminder-date" className="text-sm font-medium">
                  Date
                </label>
                <Input
                  id="reminder-date"
                  type="date"
                  value={newReminder.date}
                  onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="reminder-time" className="text-sm font-medium">
                  Time
                </label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="reminder-description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="reminder-description"
                placeholder="Add more details about this reminder"
                value={newReminder.description}
                onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddReminderDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-rose-600 hover:bg-rose-700"
              onClick={handleAddReminder}
              disabled={!newReminder.title}
            >
              <BellRing className="h-4 w-4 mr-2" /> Add Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Task Dialog */}
      <Dialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              Add New Task
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="task-title" className="text-sm font-medium">
                Task Title
              </label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="task-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="task-description"
                placeholder="Describe the task"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="task-deadline" className="text-sm font-medium">
                  Deadline
                </label>
                <Input
                  id="task-deadline"
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="task-priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value) => 
                    setNewTask({ ...newTask, priority: value as "low" | "medium" | "high" | "urgent" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {projectStaff && projectStaff.length > 0 && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Assign Staff
                </label>
                <Select
                  value={newTask.assignedTo[0]}
                  onValueChange={(value) => setNewTask({ ...newTask, assignedTo: [value] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assign staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectStaff.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid gap-2">
              <label htmlFor="task-location" className="text-sm font-medium">
                Location (optional)
              </label>
              <Input
                id="task-location"
                placeholder="Task location"
                value={newTask.location}
                onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="task-tags" className="text-sm font-medium">
                Tags (comma separated)
              </label>
              <Input
                id="task-tags"
                placeholder="e.g. Planning, Design, Electrical"
                value={newTask.tags.join(", ")}
                onChange={(e) => setNewTask({ 
                  ...newTask, 
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag !== "") 
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTaskDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddTask}
              disabled={!newTask.title || !newTask.description}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectScheduleAndTasksTab;
