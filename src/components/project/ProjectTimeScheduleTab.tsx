
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
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Plus, X, Check, FileText, MapPin, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ProjectStaff, ProjectTask } from "@/types/project";
import { convertEventToTask, convertTaskToEvent, generateId } from "./utils/scheduleTaskIntegration";

interface ProjectTimeScheduleTabProps {
  projectId: number;
  projectStaff?: ProjectStaff[];
  projectTasks?: ProjectTask[];
  onTaskCreate?: (task: ProjectTask) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<ProjectTask>) => void;
}

// Event types
export interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  assignedTo?: string[];
  status: "scheduled" | "completed" | "cancelled";
  type: "meeting" | "deadline" | "milestone" | "task" | "inspection";
}

export default function ProjectTimeScheduleTab({ 
  projectId, 
  projectStaff = [], 
  projectTasks = [],
  onTaskCreate,
  onTaskUpdate
}: ProjectTimeScheduleTabProps) {
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
    }
  ]);

  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
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
  
  // New state for task creation option
  const [createTask, setCreateTask] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  // Initialize with tasks converted to events
  useEffect(() => {
    if (projectTasks && projectTasks.length > 0) {
      const taskEvents = projectTasks.map(task => {
        const eventBase = convertTaskToEvent(task);
        return {
          ...eventBase,
          id: `task-event-${task.id}`
        };
      });
      
      // Filter out any duplicate events (if task was already converted)
      const taskEventIds = taskEvents.map(e => e.id);
      const filteredEvents = events.filter(e => !e.id.startsWith('task-event-'));
      
      setEvents([...filteredEvents, ...taskEvents]);
    }
  }, [projectTasks]);

  const handleAddEvent = () => {
    const newEventWithId: ScheduleEvent = {
      id: generateId('event'),
      ...newEvent
    };
    
    setEvents(prev => [...prev, newEventWithId]);
    
    // If the create task option is checked, also create a task
    if (createTask && onTaskCreate) {
      const newTask: ProjectTask = {
        id: generateId('task'),
        ...convertEventToTask(newEventWithId),
        createdAt: format(new Date(), "yyyy-MM-dd")
      };
      
      onTaskCreate(newTask);
      toast.success("Event and task added successfully");
    } else {
      toast.success("Event added successfully");
    }
    
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
    setCreateTask(false);
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
    
    // If this is a task-linked event, update the task too
    if (id.startsWith('task-event-') && onTaskUpdate) {
      const taskId = id.replace('task-event-', '');
      onTaskUpdate(taskId, {
        status: status === "completed" ? "completed" : 
                status === "cancelled" ? "blocked" : "in_progress",
        progress: status === "completed" ? 100 : status === "cancelled" ? 0 : 50,
        completedAt: status === "completed" ? format(new Date(), "yyyy-MM-dd") : undefined
      });
    }
    
    setSelectedEvent(prev => (prev?.id === id ? { ...prev, status: status } : prev) || null);
    toast.success(`Event ${status} successfully`);
  };
  
  // Handler for viewing task details
  const handleViewTask = (taskId: string) => {
    if (taskId.startsWith('task-event-')) {
      const actualTaskId = taskId.replace('task-event-', '');
      // You could navigate to task detail or show a task detail dialog here
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Schedule</h2>
        <Button onClick={() => setShowAddEventDialog(true)} className="flex items-center gap-2">
          <Plus size={16} /> Add Event
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="calendar" variant="blue">Calendar View</TabsTrigger>
          <TabsTrigger value="list" variant="blue">List View</TabsTrigger>
          <TabsTrigger value="staff" variant="blue">Staff Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="py-4">
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
                    className="rounded-md border pointer-events-auto"
                    style={{width: "300px"}}
                  />
                </PopoverContent>
              </Popover>
              
              {/* Display Events for Selected Date - now shows task-linked events too */}
              <div className="mt-4">
                {events.filter(event => format(event.start, "yyyy-MM-dd") === format(date || new Date(), "yyyy-MM-dd")).length > 0 ? (
                  events
                    .filter(event => format(event.start, "yyyy-MM-dd") === format(date || new Date(), "yyyy-MM-dd"))
                    .map(event => (
                      <Card key={event.id} className={`mb-2 ${event.id.startsWith('task-event-') ? 'border-l-4 border-l-blue-500' : ''}`}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{event.title}</p>
                              {event.id.startsWith('task-event-') && (
                                <Badge className="bg-blue-100 text-blue-800">Task</Badge>
                              )}
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
                    ))
                ) : (
                  <p className="text-muted-foreground">No events scheduled for this day.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.length > 0 ? (
                  events.map(event => (
                    <Card key={event.id} className={`${event.id.startsWith('task-event-') ? 'border-l-4 border-l-blue-500' : ''}`}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{event.title}</p>
                            {event.id.startsWith('task-event-') && (
                              <Badge className="bg-blue-100 text-blue-800">Task</Badge>
                            )}
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
                      {events
                        .filter(event => event.assignedTo?.includes(staff.id))
                        .map(event => (
                          <li key={event.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{event.title}</span>
                              {event.id.startsWith('task-event-') && (
                                <Badge className="bg-blue-100 text-blue-800">Task</Badge>
                              )}
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
      </Tabs>

      {/* Add Event Dialog - Now with task creation option */}
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
                <Select onValueChange={(value) => setNewEvent({ ...newEvent, type: value as ScheduleEvent["type"] })}>
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
            
            {/* Staff assignment */}
            <div className="grid gap-2">
              <label htmlFor="event-staff" className="text-sm font-medium">
                Assign Staff
              </label>
              <Select 
                onValueChange={(value) => setNewEvent({ 
                  ...newEvent, 
                  assignedTo: value ? [value] : [] 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {projectStaff.map(staff => (
                    <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Option to create task */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="create-task" 
                checked={createTask} 
                onCheckedChange={(checked) => setCreateTask(!!checked)} 
              />
              <label 
                htmlFor="create-task" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
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

      {/* Event Details Dialog - Now with task link */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedEvent.title}
                {selectedEvent.id.startsWith('task-event-') && (
                  <Badge className="bg-blue-100 text-blue-800">Task</Badge>
                )}
              </DialogTitle>
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
              
              {/* Add link to task if this is a task-event */}
              {selectedEvent.id.startsWith('task-event-') && (
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <ListTodo className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Task</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-6 text-sm" 
                      onClick={() => handleViewTask(selectedEvent.id)}
                    >
                      View Task Details
                    </Button>
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

