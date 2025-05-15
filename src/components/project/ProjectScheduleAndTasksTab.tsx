import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, isSameDay } from "date-fns";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { Project, ProjectStaff, ProjectTask, ProjectTaskInspection } from "@/types/project";
import { 
  CalendarIcon, Clock, Plus, X, Check, FileText, 
  Calendar as CalendarIcon2, ListTodo, User, AlertTriangle, MapPin 
} from "lucide-react";
import { cn } from "@/lib/utils";
import TaskDetailDialog from "./TaskDetailDialog";

// Event types for scheduling
interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  assignedTo?: string[];
  status: "scheduled" | "completed" | "cancelled";
  type: "meeting" | "deadline" | "milestone" | "task" | "inspection";
  relatedTaskId?: string; // Reference to a task if this event is linked to one
}

interface UnifiedViewProps {
  project: Project;
  projectStaff?: ProjectStaff[];
}

interface ProjectScheduleAndTasksTabProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
}

export default function ProjectScheduleAndTasksTab({ project, projectStaff = [], onUpdateProject }: UnifiedViewProps) {
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
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
    }
  ]);
  
  const [tasks, setTasks] = useState<ProjectTask[]>(project.tasks || [
    {
      id: "task-1",
      title: "Complete Foundation Work",
      description: "Ensure the foundation is properly laid and inspected",
      status: "in_progress",
      priority: "high",
      dueDate: "2024-06-20",
      assignedTo: projectStaff[0]?.id,
      completedAt: undefined,
      createdAt: "2024-05-01",
      progress: 65
    },
    {
      id: "task-2",
      title: "Order Building Materials",
      description: "Place orders for all necessary building materials",
      status: "completed",
      priority: "medium",
      dueDate: "2024-05-15",
      assignedTo: projectStaff[1]?.id,
      completedAt: "2024-05-14",
      createdAt: "2024-05-01",
      progress: 100
    },
    {
      id: "task-3",
      title: "Schedule Electrical Inspection",
      description: "Contact city inspector to schedule electrical work inspection",
      status: "pending",
      priority: "medium",
      dueDate: "2024-07-10",
      assignedTo: projectStaff[2]?.id,
      completedAt: undefined,
      createdAt: "2024-05-01",
      progress: 0,
      inspections: [
        {
          id: "inspection-1",
          title: "Pre-Inspection Checklist",
          status: "pending",
          inspector: "City Electrical Inspector",
          notes: "Ensure all wiring is properly labeled"
        }
      ]
    }
  ]);

  // Dialogs state
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
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
  const [newTask, setNewTask] = useState<Omit<ProjectTask, "id">>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: format(new Date(), "yyyy-MM-dd"),
    createdAt: format(new Date(), "yyyy-MM-dd"),
    progress: 0,
    assignedTo: undefined
  });
  
  const [createTaskFromEvent, setCreateTaskFromEvent] = useState(false);
  const [createEventFromTask, setCreateEventFromTask] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);

  // Task detail dialog management
  const [taskForDetailView, setTaskForDetailView] = useState<ProjectTask | null>(null);
  const [taskDetailDialogOpen, setTaskDetailDialogOpen] = useState(false);

  // Add a new event and optionally create a related task
  const handleAddEvent = () => {
    const newEventId = `event-${uuid()}`;
    const newEventWithId: ScheduleEvent = {
      id: newEventId,
      ...newEvent
    };
    
    setEvents(prev => [...prev, newEventWithId]);
    
    // If checked to create a task from this event
    if (createTaskFromEvent) {
      const newTaskId = `task-${uuid()}`;
      const taskFromEvent: ProjectTask = {
        id: newTaskId,
        title: newEvent.title,
        description: newEvent.description || "",
        status: "pending",
        priority: "medium",
        dueDate: format(newEvent.end, "yyyy-MM-dd"),
        assignedTo: newEvent.assignedTo?.[0],
        createdAt: format(new Date(), "yyyy-MM-dd"),
        progress: 0
      };
      
      // Link task and event
      newEventWithId.relatedTaskId = newTaskId;
      
      setTasks(prev => [...prev, taskFromEvent]);
      toast.success("Event and related task added successfully");
    } else {
      toast.success("Event added successfully");
    }
    
    setShowAddEventDialog(false);
    setCreateTaskFromEvent(false);
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
  };

  // Add a new task and optionally create a related event
  const handleAddTask = () => {
    const newTaskId = `task-${uuid()}`;
    const newTaskWithId: ProjectTask = {
      id: newTaskId,
      ...newTask
    };
    
    setTasks(prev => [...prev, newTaskWithId]);
    
    // If checked to create an event from this task
    if (createEventFromTask) {
      const taskDueDate = new Date(newTask.dueDate);
      const endDate = new Date(taskDueDate);
      endDate.setHours(taskDueDate.getHours() + 2); // Default 2-hour duration
      
      const newEventId = `event-${uuid()}`;
      const eventFromTask: ScheduleEvent = {
        id: newEventId,
        title: newTask.title,
        start: taskDueDate,
        end: endDate,
        description: newTask.description || "",
        status: task.status === "completed" ? "completed" : 
             task.status === "blocked" ? "cancelled" : "scheduled",
        type: "task",
        assignedTo: newTask.assignedTo ? [newTask.assignedTo] : [],
        relatedTaskId: newTaskId
      };
      
      setEvents(prev => [...prev, eventFromTask]);
      toast.success("Task and related event added successfully");
    } else {
      toast.success("Task added successfully");
    }
    
    setShowAddTaskDialog(false);
    setCreateEventFromTask(false);
    setNewTask({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      createdAt: format(new Date(), "yyyy-MM-dd"),
      progress: 0,
      assignedTo: undefined
    });
  };

  // Handle updating an event's status
  const handleUpdateEventStatus = (id: string, status: ScheduleEvent["status"]) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, status: status } : event
      )
    );
    
    // Find the event and check if it has a related task
    const updatedEvent = events.find(event => event.id === id);
    if (updatedEvent?.relatedTaskId) {
      // Update the linked task's status too
      const taskStatus = status === "completed" ? "completed" : 
                        status === "cancelled" ? "blocked" : "in_progress";
      
      setTasks(prev =>
        prev.map(task =>
          task.id === updatedEvent.relatedTaskId ? { 
            ...task, 
            status: taskStatus,
            progress: taskStatus === "completed" ? 100 : task.progress,
            completedAt: taskStatus === "completed" ? format(new Date(), "yyyy-MM-dd") : undefined
          } : task
        )
      );
      
      toast.success(`Event and related task status updated to ${status}`);
    } else {
      toast.success(`Event status updated to ${status}`);
    }
    
    setSelectedEvent(prev => (prev?.id === id ? { ...prev, status: status } : prev) || null);
  };

  // Handle updating a task's status
  const handleUpdateTaskStatus = (id: string, status: ProjectTask["status"]) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { 
          ...task, 
          status, 
          progress: status === "completed" ? 100 : task.progress,
          completedAt: status === "completed" ? format(new Date(), "yyyy-MM-dd") : undefined
        } : task
      )
    );
    
    // Find if there's a related event for this task
    const eventForTask = events.find(event => event.relatedTaskId === id);
    if (eventForTask) {
      // Update the linked event's status too
      const eventStatus = status === "completed" ? "completed" : 
                         status === "blocked" ? "cancelled" : "scheduled";
      
      setEvents(prev =>
        prev.map(event =>
          event.relatedTaskId === id ? { ...event, status: eventStatus } : event
        )
      );
      
      toast.success(`Task and related event status updated to ${status}`);
    } else {
      toast.success(`Task status updated to ${status}`);
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = (id: string) => {
    const eventToDelete = events.find(event => event.id === id);
    
    // If the event has a related task, ask if that should be deleted too
    if (eventToDelete?.relatedTaskId) {
      // For simplicity, we'll just delete both
      setTasks(prev => prev.filter(task => task.id !== eventToDelete.relatedTaskId));
      setEvents(prev => prev.filter(event => event.id !== id));
      toast.success("Event and related task deleted successfully");
    } else {
      setEvents(prev => prev.filter(event => event.id !== id));
      toast.success("Event deleted successfully");
    }
    
    setSelectedEvent(null);
  };

  // Handle deleting a task
  const handleDeleteTask = (id: string) => {
    // Fix by referencing tasks correctly
    const taskToDelete = (project.tasks || []).find(t => t.id === id);
    if (!taskToDelete) return;
    
    onUpdateProject({
      ...project,
      tasks: (project.tasks || []).filter(t => t.id !== id)
    });
  };

  // Add task to calendar by creating a new event
  const handleAddTaskToCalendar = (task: ProjectTask) => {
    const taskDueDate = new Date(task.dueDate);
    const endDate = new Date(taskDueDate);
    endDate.setHours(taskDueDate.getHours() + 2); // Default 2-hour duration
    
    const newEventId = `event-${uuid()}`;
    const eventFromTask: ScheduleEvent = {
      id: newEventId,
      title: task.title,
      start: taskDueDate,
      end: endDate,
      description: task.description || "",
      status: task.status === "completed" ? "completed" : 
             task.status === "blocked" ? "cancelled" : "scheduled",
      type: "task",
      assignedTo: task.assignedTo ? [task.assignedTo] : [],
      relatedTaskId: task.id
    };
    
    setEvents(prev => [...prev, eventFromTask]);
    toast.success("Task added to calendar");
  };

  // Get events for the selected date
  const getEventsForSelectedDate = () => {
    return events.filter(event => isSameDay(event.start, selectedDate));
  };

  // Get tasks due on the selected date
  const getTasksForSelectedDate = () => {
    return tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return isSameDay(dueDate, selectedDate);
    });
  };

  // Data for calendar display
  const daysWithEvents = events.map(event => new Date(event.start));
  const daysWithTasks = tasks
    .filter(task => task.dueDate)
    .map(task => new Date(task.dueDate));

  // Color coding for calendar days
  const getDayColor = (day: Date) => {
    const dayEvents = events.filter(event => isSameDay(event.start, day));
    const dayTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return isSameDay(dueDate, day);
    });
    
    if (!dayEvents.length && !dayTasks.length) return "";
    
    // Priority colors
    if (dayTasks.some(task => task.priority === "high" || task.priority === "urgent") || 
        dayEvents.some(event => event.type === "deadline")) {
      return "bg-red-100 text-red-800";
    } else if (dayTasks.some(task => task.status === "in_progress") || 
               dayEvents.some(event => event.status === "scheduled" && event.type === "meeting")) {
      return "bg-blue-100 text-blue-800";
    } else if (dayTasks.some(task => task.status === "completed") ||
               dayEvents.some(event => event.status === "completed")) {
      return "bg-green-100 text-green-800";
    } else {
      return "bg-amber-100 text-amber-800";
    }
  };

  // Handle view task details
  const handleViewTaskDetails = (task: ProjectTask) => {
    setTaskForDetailView(task);
    setTaskDetailDialogOpen(true);
  };

  const handleCompleteTask = (id: string) => {
    onUpdateProject({
      ...project,
      tasks: (project.tasks || []).map(t => 
        t.id === id ? { ...t, status: "completed" } : t
      )
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Schedule & Tasks</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAddTaskDialog(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <ListTodo size={16} />
            Add Task
          </Button>
          <Button 
            onClick={() => setShowAddEventDialog(true)} 
            className="flex items-center gap-2"
          >
            <CalendarIcon size={16} />
            Add Calendar Event
          </Button>
        </div>
      </div>

      <Tabs defaultValue="unified" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="unified">Unified View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="tasks">Tasks List</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
        </TabsList>

        {/* Unified View Tab - Shows calendar and due tasks for selected date */}
        <TabsContent value="unified" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendar Widget */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Project Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className={cn("p-3 pointer-events-auto border rounded-md")}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  components={{
                    Day: ({ date, displayMonth, ...props }) => {
                      const isSelected = isSameDay(date, selectedDate);
                      const isOutsideMonth = date.getMonth() !== displayMonth.getMonth();
                      const dayColor = getDayColor(date);
                      
                      // Count events and tasks for this day
                      const eventsCount = events.filter(event => isSameDay(event.start, date)).length;
                      const tasksCount = tasks.filter(task => {
                        const dueDate = new Date(task.dueDate);
                        return isSameDay(dueDate, date);
                      }).length;
                      
                      const hasItems = eventsCount > 0 || tasksCount > 0;
                      
                      return (
                        <button 
                          type="button"
                          className={cn(
                            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                            dayColor,
                            isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                            "relative"
                          )}
                          disabled={isOutsideMonth}
                          {...props}
                        >
                          {format(date, "d")}
                          {hasItems && (
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                              <div className="flex gap-0.5">
                                {eventsCount > 0 && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                )}
                                {tasksCount > 0 && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                )}
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    }
                  }}
                />

                <div className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span>Events</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Tasks</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Day View with Events and Tasks */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{format(selectedDate, "EEEE, MMMM d, yyyy")}</CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Events for the day */}
                <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                  <CalendarIcon2 className="h-5 w-5 text-blue-600" />
                  Events
                </h3>
                <div className="mb-4">
                  {getEventsForSelectedDate().length > 0 ? (
                    <div className="space-y-3">
                      {getEventsForSelectedDate().map(event => (
                        <Card key={event.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{event.title}</h4>
                                <div className="text-sm text-muted-foreground">
                                  {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                                </div>
                                {event.description && (
                                  <p className="text-sm mt-1">{event.description}</p>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={
                                  event.status === "completed" ? "bg-green-100 text-green-800" : 
                                  event.status === "cancelled" ? "bg-red-100 text-red-800" : 
                                  "bg-blue-100 text-blue-800"
                                }>
                                  {event.status}
                                </Badge>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedEvent(event)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No events scheduled for today.</p>
                  )}
                </div>

                {/* Tasks for the day */}
                <h3 className="font-medium text-lg mb-3 mt-6 flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-green-600" />
                  Tasks Due Today
                </h3>
                <div>
                  {getTasksForSelectedDate().length > 0 ? (
                    <div className="space-y-3">
                      {getTasksForSelectedDate().map(task => (
                        <Card key={task.id} className={cn(
                          "border-l-4",
                          task.priority === "urgent" ? "border-l-red-600" :
                          task.priority === "high" ? "border-l-red-500" :
                          task.priority === "medium" ? "border-l-yellow-500" :
                          "border-l-green-500"
                        )}>
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{task.title}</h4>
                                <div className="text-sm flex items-center gap-2">
                                  <Badge className={
                                    task.status === "completed" ? "bg-green-100 text-green-800" : 
                                    task.status === "in_progress" ? "bg-blue-100 text-blue-800" : 
                                    task.status === "blocked" ? "bg-red-100 text-red-800" : 
                                    "bg-amber-100 text-amber-800"
                                  }>
                                    {task.status.replace('_', ' ')}
                                  </Badge>
                                  <Badge variant="outline" className="capitalize">
                                    {task.priority} priority
                                  </Badge>
                                </div>
                                {task.description && (
                                  <p className="text-sm mt-1">{task.description}</p>
                                )}
                              </div>
                              <div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewTaskDetails(task)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tasks due today.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Calendar View Tab */}
        <TabsContent value="calendar" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Calendar</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex justify-between items-center mb-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentMonth(newDate);
                  }}
                >
                  Previous Month
                </Button>
                <h3 className="text-lg font-medium">
                  {format(currentMonth, "MMMM yyyy")}
                </h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentMonth(newDate);
                  }}
                >
                  Next Month
                </Button>
              </div>
              
              {/* Full Calendar */}
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className={cn("p-3 pointer-events-auto border rounded-md")}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                components={{
                  Day: ({ date, displayMonth, ...props }) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isOutsideMonth = date.getMonth() !== displayMonth.getMonth();
                    const dayColor = getDayColor(date);
                    
                    // Count events and tasks for this day
                    const eventsCount = events.filter(event => isSameDay(event.start, date)).length;
                    const tasksCount = tasks.filter(task => {
                      const dueDate = new Date(task.dueDate);
                      return isSameDay(dueDate, date);
                    }).length;
                    
                    const hasItems = eventsCount > 0 || tasksCount > 0;
                    
                    return (
                      <button 
                        type="button"
                        className={cn(
                          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                          dayColor,
                          isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                          "relative"
                        )}
                        disabled={isOutsideMonth}
                        {...props}
                      >
                        {format(date, "d")}
                        {hasItems && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className="flex gap-0.5">
                              {eventsCount > 0 && (
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              )}
                              {tasksCount > 0 && (
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              )}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  }
                }}
              />
              
              <div className="text-xs text-gray-500 flex items-center justify-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>Events</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Tasks</span>
                </div>
              </div>
              
              {/* Display Events for Selected Date */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <CalendarIcon2 className="h-4 w-4 text-blue-600" />
                      Events
                    </h4>
                    
                    {getEventsForSelectedDate().length > 0 ? (
                      <div className="space-y-2">
                        {getEventsForSelectedDate().map(event => (
                          <Card key={event.id} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-2">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium text-sm">{event.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                                  </p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2"
                                  onClick={() => setSelectedEvent(event)}
                                >
                                  View
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <ListTodo className="h-4 w-4 text-green-600" />
                      Tasks Due
                    </h4>
                    
                    {getTasksForSelectedDate().length > 0 ? (
                      <div className="space-y-2">
                        {getTasksForSelectedDate().map(task => (
                          <Card key={task.id} className={cn(
                            "border-l-4",
                            task.priority === "urgent" ? "border-l-red-600" :
                            task.priority === "high" ? "border-l-red-500" :
                            task.priority === "medium" ? "border-l-yellow-500" :
                            "border-l-green-500"
                          )}>
                            <CardContent className="p-2">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium text-sm">{task.title}</p>
                                  <div className="flex gap-1 mt-0.5">
                                    <Badge className={cn(
                                      "text-xs px-1 py-0",
                                      task.status === "completed" ? "bg-green-100 text-green-800" : 
                                      task.status === "in_progress" ? "bg-blue-100 text-blue-800" : 
                                      task.status === "blocked" ? "bg-red-100 text-red-800" : 
                                      "bg-amber-100 text-amber-800"
                                    )}>
                                      {task.status.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2"
                                  onClick={() => handleViewTaskDetails(task)}
                                >
                                  View
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No tasks due on this day.</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks List Tab */}
        <TabsContent value="tasks" className="py-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Project Tasks</CardTitle>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.length > 0 ? (
                  tasks.map(task => (
                    <Card key={task.id} className={cn(
                      "border-l-4",
                      task.priority === "urgent" ? "border-l-red-600" :
                      task.priority === "high" ? "border-l-red-500" :
                      task.priority === "medium" ? "border-l-yellow-500" :
                      "border-l-green-500"
                    )}>
                      <CardContent className="p-3">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                          <div className="flex-grow">
                            <h3 className="font-medium">{task.title}</h3>
                            
                            <div className="flex flex-wrap gap-2 my-2">
                              <Badge className={cn(
                                task.status === "completed" ? "bg-green-100 text-green-800" : 
                                task.status === "in_progress" ? "bg-blue-100 text-blue-800" : 
                                task.status === "blocked" ? "bg-red-100 text-red-800" : 
                                "bg-amber-100 text-amber-800"
                              )}>
                                {task.status.replace('_', ' ')}
                              </Badge>
                              
                              <Badge variant="outline" className="capitalize">
                                {task.priority} priority
                              </Badge>
                              
                              <Badge variant="outline" className="bg-gray-100">
                                Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                              </Badge>
                            </div>
                            
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            )}
                            
                            {/* Progress bar */}
                            <div className="w-full mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{task.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={cn(
                                    "h-2 rounded-full",
                                    task.progress >= 100 ? "bg-green-500" :
                                    task.progress >= 70 ? "bg-blue-500" :
                                    task.progress >= 30 ? "bg-yellow-500" :
                                    "bg-red-500"
                                  )}
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {/* Show assigned user if any */}
                            {task.assignedTo && (
                              <div className="text-sm flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>
                                  {projectStaff.find(staff => staff.id === task.assignedTo)?.name || "Unassigned"}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              {/* Show calendar button if not already on calendar */}
                              {!events.some(event => event.relatedTaskId === task.id) && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleAddTaskToCalendar(task)}
                                >
                                  Add to Calendar
                                </Button>
                              )}
                              
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleViewTaskDetails(task)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ListTodo className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No tasks added yet</h3>
                    <p className="text-muted-foreground mb-4">Create tasks to track project progress</p>
                    <Button onClick={() => setShowAddTaskDialog(true)}>
                      <Plus size={16} className="mr-1" /> Add Task
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kanban Board Tab */}
        <TabsContent value="kanban" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Pending Column */}
            <Card>
              <CardHeader className="bg-amber-50 py-3">
                <CardTitle className="text-sm font-medium text-amber-800">Pending</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-2">
                  {tasks.filter(t => t.status === "pending").map(task => (
                    <Card key={task.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewTaskDetails(task)}>
                      <CardContent className="p-2">
                        <p className="font-medium text-sm">{task.title}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="capitalize text-xs">
                            {task.priority}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            {format(new Date(task.dueDate), "MMM d")}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {tasks.filter(t => t.status === "pending").length === 0 && (
                    <div className="text-center py-8 text-sm text-gray-500">
                      No pending tasks
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* In Progress Column */}
            <Card>
              <CardHeader className="bg-blue-50 py-3">
                <CardTitle className="text-sm font-medium text-blue-800">In Progress</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-2">
                  {tasks.filter(t => t.status === "in_progress").map(task => (
                    <Card key={task.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewTaskDetails(task)}>
                      <CardContent className="p-2">
                        <p className="font-medium text-sm">{task.title}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="capitalize text-xs">
                            {task.priority}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            {format(new Date(task.dueDate), "MMM d")}
                          </div>
                        </div>
                        {/* Simple progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                          <div 
                            className="bg-blue-500 h-1 rounded-full" 
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {tasks.filter(t => t.status === "in_progress").length === 0 && (
                    <div className="text-center py-8 text-sm text-gray-500">
                      No in-progress tasks
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Blocked Column */}
            <Card>
              <CardHeader className="bg-red-50 py-3">
                <CardTitle className="text-sm font-medium text-red-800">Blocked</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-2">
                  {tasks.filter(t => t.status === "blocked").map(task => (
                    <Card key={task.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewTaskDetails(task)}>
                      <CardContent className="p-2">
                        <p className="font-medium text-sm">{task.title}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="capitalize text-xs">
                            {task.priority}
                          </Badge>
                          <div className="flex items-center text-xs text-red-600">
                            <AlertTriangle size={12} className="mr-1" />
                            Blocked
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {tasks.filter(t => t.status === "blocked").length === 0 && (
                    <div className="text-center py-8 text-sm text-gray-500">
                      No blocked tasks
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Completed Column */}
            <Card>
              <CardHeader className="bg-green-50 py-3">
                <CardTitle className="text-sm font-medium text-green-800">Completed</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-2">
                  {tasks.filter(t => t.status === "completed").map(task => (
                    <Card key={task.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewTaskDetails(task)}>
                      <CardContent className="p-2">
                        <p className="font-medium text-sm line-through text-gray-500">{task.title}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs bg-green-50">
                            <Check size={10} className="mr-1" /> Done
                          </Badge>
                          <div className="text-xs text-gray-500">
                            {task.completedAt ? format(new Date(task.completedAt), "MMM d") : ""}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {tasks.filter(t => t.status === "completed").length === 0 && (
                    <div className="text-center py-8 text-sm text-gray-500">
                      No completed tasks
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
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
                        "w-full justify-start text-left font-normal",
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
                      onSelect={(date) => date && setNewEvent({ ...newEvent, start: date })}
                      className="rounded-md border pointer-events-auto"
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
                        "w-full justify-start text-left font-normal",
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
                      onSelect={(date) => date && setNewEvent({ ...newEvent, end: date })}
                      className="rounded-md border pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label htmlFor="event-type" className="text-sm font-medium">
                  Event Type
                </label>
                <Select onValueChange={(value) => setNewEvent({ 
                  ...newEvent, 
                  type: value as ScheduleEvent["type"] 
                })}>
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
            
            {/* Assigned staff select */}
            <div className="grid gap-2">
              <label htmlFor="event-assigned" className="text-sm font-medium">
                Assign To
              </label>
              <Select onValueChange={(value) => setNewEvent({ 
                ...newEvent, 
                assignedTo: value ? [value] : [] 
              })}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign to staff" />
                </SelectTrigger>
                <SelectContent>
                  {projectStaff.map(staff => (
                    <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="create-task"
                checked={createTaskFromEvent}
                onChange={() => setCreateTaskFromEvent(!createTaskFromEvent)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="create-task" className="text-sm font-medium leading-none">
                Also create a task from this event
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddEvent}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="task-title" className="text-sm font-medium">
                Task Title
              </label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="task-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="task-due-date" className="text-sm font-medium">
                  Due Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newTask.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTask.dueDate ? format(new Date(newTask.dueDate), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(newTask.dueDate)}
                      onSelect={(date) => date && setNewTask({ ...newTask, dueDate: format(date, "yyyy-MM-dd") })}
                      className="rounded-md border pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <label htmlFor="task-priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select 
                  defaultValue="medium"
                  onValueChange={(value) => setNewTask({ 
                    ...newTask, 
                    priority: value as ProjectTask["priority"] 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="task-assigned" className="text-sm font-medium">
                Assign To
              </label>
              <Select onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign to staff" />
                </SelectTrigger>
                <SelectContent>
                  {projectStaff.map(staff => (
                    <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="create-event"
                checked={createEventFromTask}
                onChange={() => setCreateEventFromTask(!createEventFromTask)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="create-event" className="text-sm font-medium leading-none">
                Also add this task to the calendar
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddTask}>
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
                  <p className="text-sm text-muted-foreground">{selectedEvent.description || "No description provided"}</p>
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

              {/* If this event is linked to a task, show task info too */}
              {selectedEvent.relatedTaskId && (
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Linked Task</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 px-2 text-xs"
                      onClick={() => {
                        const task = tasks.find(t => t.id === selectedEvent.relatedTaskId);
                        if (task) {
                          setSelectedEvent(null);
                          handleViewTaskDetails(task);
                        }
                      }}
                    >
                      View Task
                    </Button>
                  </div>
                  {tasks.find(t => t.id === selectedEvent.relatedTaskId) && (
                    <div className="text-xs text-gray-500 mt-1">
                      {tasks.find(t => t.id === selectedEvent.relatedTaskId)?.title}
                    </div>
                  )}
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
                  {selectedEvent.status}
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

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        open={taskDetailDialogOpen}
        onOpenChange={setTaskDetailDialogOpen}
        task={taskForDetailView || tasks[0]} // Fallback to first task if none selected
        onTaskUpdate={(taskId, updates) => {
          setTasks(prev =>
            prev.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
            )
          );
          
          // If there's an event related to this task, update it too if needed
          if (updates.status) {
            const eventForTask = events.find(event => event.relatedTaskId === taskId);
            if (eventForTask) {
              const eventStatus = updates.status === "completed" ? "completed" : 
                               updates.status === "blocked" ? "cancelled" : "scheduled";
              
              setEvents(prev =>
                prev.map(event =>
                  event.relatedTaskId === taskId ? { ...event, status: eventStatus } : event
                )
              );
            }
          }
        }}
        onUpdateStatus={handleUpdateTaskStatus}
        onDelete={handleDeleteTask}
        onAddToCalendar={handleAddTaskToCalendar}
        projectStaff={projectStaff || []}
      />
    </div>
  );
}

export default ProjectScheduleAndTasksTab;
