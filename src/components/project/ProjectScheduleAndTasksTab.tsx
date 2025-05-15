import React, { useState } from "react";
import { format, isSameDay } from "date-fns";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Project, ProjectTask } from "@/types/project";
import TaskDetailDialog from "./TaskDetailDialog";
import { Plus } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";

// ScheduleEvent type definition
interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  assignedTo?: string[];
  relatedTaskId?: string;
  status: "scheduled" | "completed" | "cancelled";
  type: "meeting" | "deadline" | "milestone" | "task" | "inspection";
}

// Props for the component
interface ProjectScheduleAndTasksTabProps {
  project: Project;
  projectStaff?: Project['staff'];
  onUpdateProject: (updatedProject: Project) => void;
}

export default function ProjectScheduleAndTasksTab({ project, projectStaff = [], onUpdateProject }: ProjectScheduleAndTasksTabProps) {
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
        status: newTask.status === "completed" ? "completed" : 
             newTask.status === "blocked" ? "cancelled" : "scheduled",
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
      status: newTask.status === "completed" ? "completed" : 
             newTask.status === "blocked" ? "cancelled" : "scheduled",
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
            <Plus size={16} /> Add Task
          </Button>
          <Button onClick={() => setShowAddEventDialog(true)} className="flex items-center gap-2">
            <Plus size={16} /> Add Event
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Project Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    event: daysWithEvents,
                    task: daysWithTasks
                  }}
                  modifiersClassNames={{
                    event: "bg-blue-100",
                    task: "border-red-400 border-2"
                  }}
                  components={{
                    Day: ({ day, ...props }) => {
                      const colorClass = getDayColor(day);
                      return (
                        <button
                          {...props}
                          className={cn(
                            props.className,
                            colorClass
                          )}
                        >
                          {format(day, "d")}
                        </button>
                      );
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {format(selectedDate, "MMMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Events</h3>
                    {getEventsForSelectedDate().length > 0 ? (
                      <div className="space-y-2">
                        {getEventsForSelectedDate().map(event => (
                          <div key={event.id} className="p-2 border rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{event.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                                </p>
                              </div>
                              <Badge className={
                                event.status === "completed" ? "bg-green-100 text-green-800" : 
                                event.status === "cancelled" ? "bg-red-100 text-red-800" : 
                                "bg-blue-100 text-blue-800"
                              }>
                                {event.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No events scheduled for this day.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Tasks Due</h3>
                    {getTasksForSelectedDate().length > 0 ? (
                      <div className="space-y-2">
                        {getTasksForSelectedDate().map(task => (
                          <div key={task.id} className="p-2 border rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{task.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  Priority: {task.priority}
                                </p>
                              </div>
                              <Badge className={
                                task.status === "completed" ? "bg-green-100 text-green-800" : 
                                task.status === "in_progress" ? "bg-blue-100 text-blue-800" : 
                                task.status === "blocked" ? "bg-red-100 text-red-800" : 
                                "bg-amber-100 text-amber-800"
                              }>
                                {task.status}
                              </Badge>
                            </div>
                            <div className="mt-2 flex justify-end">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewTaskDetails(task)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No tasks due on this day.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="bg-amber-50">
                      <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      {tasks.filter(task => task.status === "pending").length > 0 ? (
                        <div className="space-y-2">
                          {tasks
                            .filter(task => task.status === "pending")
                            .map(task => (
                              <div key={task.id} className="p-2 border rounded-md">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium">{task.title}</p>
                                  <Badge className={
                                    task.priority === "high" || task.priority === "urgent" ? 
                                    "bg-red-100 text-red-800" : 
                                    task.priority === "medium" ? 
                                    "bg-amber-100 text-amber-800" : 
                                    "bg-blue-100 text-blue-800"
                                  }>
                                    {task.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                                </p>
                                <div className="mt-2 flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUpdateTaskStatus(task.id, "in_progress")}
                                  >
                                    Start
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewTaskDetails(task)}
                                  >
                                    Details
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground p-4 text-center">No pending tasks</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      {tasks.filter(task => task.status === "in_progress").length > 0 ? (
                        <div className="space-y-2">
                          {tasks
                            .filter(task => task.status === "in_progress")
                            .map(task => (
                              <div key={task.id} className="p-2 border rounded-md">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium">{task.title}</p>
                                  <Badge className={
                                    task.priority === "high" || task.priority === "urgent" ? 
                                    "bg-red-100 text-red-800" : 
                                    task.priority === "medium" ? 
                                    "bg-amber-100 text-amber-800" : 
                                    "bg-blue-100 text-blue-800"
                                  }>
                                    {task.priority}
                                  </Badge>
                                </div>
                                <div className="mt-2">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Progress</span>
                                    <span>{task.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${task.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="mt-2 flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUpdateTaskStatus(task.id, "completed")}
                                    className="bg-green-50 text-green-700 hover:bg-green-100"
                                  >
                                    Complete
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewTaskDetails(task)}
                                  >
                                    Details
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground p-4 text-center">No tasks in progress</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-green-50">
                      <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      {tasks.filter(task => task.status === "completed").length > 0 ? (
                        <div className="space-y-2">
                          {tasks
                            .filter(task => task.status === "completed")
                            .map(task => (
                              <div key={task.id} className="p-2 border rounded-md">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium">{task.title}</p>
                                  <Badge className="bg-green-100 text-green-800">
                                    Completed
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Completed: {task.completedAt ? format(new Date(task.completedAt), "MMM d, yyyy") : "N/A"}
                                </p>
                                <div className="mt-2 flex justify-end">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewTaskDetails(task)}
                                  >
                                    Details
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground p-4 text-center">No completed tasks</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-8 relative ml-12">
                  {[...events]
                    .sort((a, b) => a.start.getTime() - b.start.getTime())
                    .map((event, index) => (
                      <div key={event.id} className="relative">
                        <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-blue-500"></div>
                        <div className="mb-1 text-sm text-muted-foreground">
                          {format(event.start, "MMM d, yyyy")}
                        </div>
                        <div className="p-3 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{event.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                              </p>
                              {event.description && (
                                <p className="text-sm mt-1">{event.description}</p>
                              )}
                            </div>
                            <Badge className={
                              event.type === "meeting" ? "bg-blue-100 text-blue-800" :
                              event.type === "deadline" ? "bg-red-100 text-red-800" :
                              event.type === "milestone" ? "bg-green-100 text-green-800" :
                              event.type === "inspection" ? "bg-amber-100 text-amber-800" :
                              "bg-purple-100 text-purple-800"
                            }>
                              {event.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
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

            <div className="grid gap-2">
              <label htmlFor="event-assigned" className="text-sm font-medium">
                Assigned To
              </label>
              <Select 
                value={newEvent.assignedTo?.[0] || ""} 
                onValueChange={(value) => setNewEvent({ ...newEvent, assignedTo: value ? [value] : [] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign to staff member" />
                </SelectTrigger>
                <SelectContent>
                  {projectStaff.map(staff => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name} ({staff.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="create-task"
                checked={createTaskFromEvent}
                onCheckedChange={setCreateTaskFromEvent}
              />
              <label
                htmlFor="create-task"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Create a task from this event
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
                <label htmlFor="task-priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as ProjectTask["priority"] })}
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

              <div className="grid gap-2">
                <label htmlFor="task-status" className="text-sm font-medium">
                  Status
                </label>
                <Select 
                  value={newTask.status} 
                  onValueChange={(value) => setNewTask({ ...newTask, status: value as ProjectTask["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                    onSelect={(date) => setNewTask({ ...newTask, dueDate: format(date || new Date(), "yyyy-MM-dd") })}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <label htmlFor="task-assigned" className="text-sm font-medium">
                Assigned To
              </label>
              <Select 
                value={newTask.assignedTo || ""} 
                onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign to staff member" />
                </SelectTrigger>
                <SelectContent>
                  {projectStaff.map(staff => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name} ({staff.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="create-event"
                checked={createEventFromTask}
                onCheckedChange={setCreateEventFromTask}
              />
              <label
                htmlFor="create-event"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Add this task to calendar
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

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        open={taskDetailDialogOpen}
        onOpenChange={setTaskDetailDialogOpen}
        task={taskForDetailView}
        projectStaff={projectStaff}
        onUpdateTask={(updatedTask) => {
          onUpdateProject({
            ...project,
            tasks: (project.tasks || []).map(t => 
              t.id === updatedTask.id ? updatedTask : t
            )
          });
        }}
        onDeleteTask={handleDeleteTask}
        onAddToCalendar={handleAddTaskToCalendar}
      />
    </div>
  );
}
