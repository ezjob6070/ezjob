import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, CircleCheck, 
  Clock3, AlertCircle, FileText, BellRing, Calendar, Clock, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getEventTypeIcon, getEventTypeBadgeColor, getEventStatusBadgeColor } from "./schedule/eventUtils";
import { ScheduleEvent } from "./schedule/types";

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'on_hold';
}

interface ProjectScheduleAndTasksTabProps {
  project: Project;
}

const ProjectScheduleAndTasksTab = ({ project }: ProjectScheduleAndTasksTabProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: "event-1",
      title: "Project Kickoff Meeting",
      start: new Date(2024, 5, 20, 9, 0),
      end: new Date(2024, 5, 20, 11, 0),
      location: "Conference Room A",
      description: "Initial meeting to discuss project goals and timelines.",
      assignedTo: [],
      status: "scheduled",
      type: "meeting"
    },
    {
      id: "event-2",
      title: "Design Phase Deadline",
      start: new Date(2024, 6, 15),
      end: new Date(2024, 6, 15),
      description: "Deadline for completing the design phase of the project.",
      assignedTo: [],
      status: "scheduled",
      type: "deadline"
    },
    {
      id: "event-3",
      title: "Construction Milestone",
      start: new Date(2024, 7, 10),
      end: new Date(2024, 7, 10),
      description: "Completion of the foundation and framing.",
      assignedTo: [],
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
      assignedTo: [],
      status: "scheduled",
      type: "inspection"
    },
    {
      id: "event-5",
      title: "Electrical Wiring Task",
      start: new Date(2024, 8, 5, 8, 0),
      end: new Date(2024, 8, 7, 17, 0),
      description: "Complete electrical wiring for the building.",
      assignedTo: [],
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
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
    priority: "medium",
    status: "open",
  });
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isEventDetailsDialogOpen, setIsEventDetailsDialogOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handlePrevDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleAddTaskOpen = () => {
    setIsAddTaskDialogOpen(true);
  };

  const handleAddTaskClose = () => {
    setIsAddTaskDialogOpen(false);
  };

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTask = () => {
    // Basic validation
    if (!newTask.title.trim() || !newTask.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    // Create a new task object
    const newTaskToAdd = {
      id: `task-${events.length + 1}`,
      title: newTask.title,
      description: newTask.description,
      start: newTask.dueDate,
      end: newTask.dueDate,
      status: newTask.status,
      type: "task",
    };

    // Update the events state with the new task
    setEvents(prev => [...prev, newTaskToAdd]);

    // Close the dialog and reset the form
    handleAddTaskClose();
    setNewTask({
      title: "",
      description: "",
      dueDate: new Date(),
      priority: "medium",
      status: "open",
    });

    toast.success("Task added successfully!");
  };

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsDialogOpen(true);
  };

  const handleEventDetailsDialogClose = () => {
    setIsEventDetailsDialogOpen(false);
  };

  const handleTaskStatusChange = (status: string) => {
    setNewTask(prev => ({ ...prev, status: status }));
  };

  const handleTaskPriorityChange = (priority: string) => {
    setNewTask(prev => ({ ...prev, priority: priority }));
  };

  // Add a render function for event icons
  const renderEventIcon = (iconName: string) => {
    switch (iconName) {
      case "BellRing":
        return <BellRing className="h-4 w-4" />;
      case "Calendar":
        return <Calendar className="h-4 w-4" />;
      case "Clock":
        return <Clock className="h-4 w-4" />;
      case "Check":
        return <Check className="h-4 w-4" />;
      case "FileText":
        return <FileText className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  // Update any use of getEventTypeIcon to use renderEventIcon
  const renderEventsForSelectedDate = () => {
    return events
      .filter(event => {
        // Filter events for the selected date
        if (!event.start) return false;
        const eventDate = new Date(event.start);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      })
      .map(event => (
        <div 
          key={event.id} 
          className="p-3 border-l-4 border-blue-500 mb-2 bg-white rounded-r shadow-sm hover:shadow transition-shadow cursor-pointer"
          onClick={() => handleEventClick(event)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderEventIcon(getEventTypeIcon(event.type))}
              <span className="font-medium">{event.title}</span>
            </div>
            <Badge className={getEventStatusBadgeColor(event.status)}>
              {event.status}
            </Badge>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {event.start && event.end ? (
              <>
                {format(new Date(event.start), "h:mm a")} - {format(new Date(event.end), "h:mm a")}
                {event.location && <span> • {event.location}</span>}
              </>
            ) : "All day"}
          </div>
        </div>
      ));
  };

  const renderTaskStatus = (status: string) => {
    switch (status) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "blocked":
        return "Blocked";
      default:
        return "Open";
    }
  };

  const renderTaskPriority = (priority: string) => {
    switch (priority) {
      case "high":
        return "High";
      case "medium":
        return "Medium";
      case "low":
        return "Low";
      default:
        return "Medium";
    }
  };
  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CircleCheck className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock3 className="h-4 w-4 text-blue-600" />;
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Schedule & Tasks</h2>
        <Button onClick={handleAddTaskOpen}>Add Task</Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between pb-4 mb-4 border-b">
          <Button variant="outline" size="sm" onClick={handlePrevDay}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <h3 className="text-sm font-medium">{format(selectedDate, 'MMMM dd, yyyy')}</h3>
          <Button variant="outline" size="sm" onClick={handleNextDay}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Events & Reminders</h4>
            {renderEventsForSelectedDate()}
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Tasks</h4>
            {/* Display tasks for the selected date here */}
          </div>
        </div>
      </Card>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleTaskInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleTaskInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Calendar
                mode="single"
                selected={newTask.dueDate}
                onSelect={(date) => {
                  if (date) {
                    setNewTask(prev => ({ ...prev, dueDate: date }));
                  }
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select onValueChange={handleTaskPriorityChange} defaultValue={newTask.priority}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={renderTaskPriority(newTask.priority)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select onValueChange={handleTaskStatusChange} defaultValue={newTask.status}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={renderTaskStatus(newTask.status)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleAddTaskClose}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={isEventDetailsDialogOpen} onOpenChange={handleEventDetailsDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedEvent && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Input type="text" value={selectedEvent.type} readOnly />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Input type="text" value={selectedEvent.status} readOnly />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={selectedEvent.description || ""} readOnly />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleEventDetailsDialogClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectScheduleAndTasksTab;
