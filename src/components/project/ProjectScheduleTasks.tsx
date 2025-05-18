
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar as CalendarIcon, 
  FileText, 
  PlusCircle, 
  Bell, 
  Clock, 
  List, 
  Check, 
  Search,
  Paperclip 
} from "lucide-react";
import { format } from "date-fns";
import { Project } from "@/types/project";
import { ScheduleEvent, ProjectStaff } from "./schedule/types";

interface ProjectScheduleTasksProps {
  project: Project;
  projectStaff?: ProjectStaff[];
}

export default function ProjectScheduleTasks({ project, projectStaff = [] }: ProjectScheduleTasksProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample events for demonstration
  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: "event-1",
      title: "Project Kickoff Meeting",
      start: new Date(2024, 5, 20, 9, 0),
      end: new Date(2024, 5, 20, 11, 0),
      location: "Conference Room A",
      description: "Initial meeting to discuss project goals and timelines.",
      assignedTo: projectStaff.slice(0, 2).map(staff => staff.id),
      status: "scheduled",
      type: "meeting"
    },
    {
      id: "event-2",
      title: "Design Phase Deadline",
      start: new Date(2024, 6, 15),
      end: new Date(2024, 6, 15),
      description: "Deadline for completing the design phase of the project.",
      assignedTo: projectStaff.slice(0, 1).map(staff => staff.id),
      status: "scheduled",
      type: "deadline"
    },
    {
      id: "reminder-1",
      title: "Order Materials Reminder",
      start: new Date(2024, 5, 25, 10, 0),
      end: new Date(2024, 5, 25, 10, 30),
      description: "Remember to order construction materials for next phase.",
      status: "scheduled",
      type: "reminder"
    }
  ]);
  
  // Get events for the selected date
  const eventsForSelectedDate = events.filter(event => 
    format(event.start, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );
  
  // Get reminders (sorted by date)
  const reminders = events
    .filter(event => event.type === "reminder")
    .sort((a, b) => a.start.getTime() - b.start.getTime());
  
  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    searchQuery 
      ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  );

  // Handle adding a new task
  const handleAddTask = () => {
    const newTask: ScheduleEvent = {
      id: `task-${events.length + 1}`,
      title: "New Task",
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
      description: "",
      status: "scheduled",
      type: "task"
    };
    
    setEvents([...events, newTask]);
  };
  
  // Handle adding a reminder
  const handleAddReminder = () => {
    const newReminder: ScheduleEvent = {
      id: `reminder-${events.length + 1}`,
      title: "New Reminder",
      start: new Date(),
      end: new Date(new Date().getTime() + 30 * 60 * 1000), // 30 minutes later
      description: "",
      status: "scheduled",
      type: "reminder"
    };
    
    setEvents([...events, newReminder]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Schedule & Tasks</h2>
          <p className="text-muted-foreground">Manage project timeline, tasks and reminders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1" onClick={handleAddTask}>
            <PlusCircle size={16} />
            <Paperclip size={16} className="ml-1" />
            Add Task
          </Button>
          <Button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700" onClick={handleAddReminder}>
            <Bell size={16} />
            Add Reminder
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search tasks, reminders and events..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Tabs defaultValue="calendar" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 mb-4">
          <TabsTrigger value="calendar" className="flex items-center gap-1">
            <CalendarIcon size={16} />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-1">
            <Clock size={16} />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-1">
            <List size={16} />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-1">
            <Bell size={16} />
            Reminders
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Project Calendar</h3>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    className="rounded-md border mx-auto"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Events for selected day */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Events for {format(date, "MMMM d, yyyy")}</h3>
                  
                  {eventsForSelectedDate.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No events scheduled for this day
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {eventsForSelectedDate.map((event) => (
                        <div 
                          key={event.id} 
                          className="p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2">
                              {event.type === "meeting" && (
                                <CalendarIcon size={16} className="mt-1 text-blue-600" />
                              )}
                              {event.type === "reminder" && (
                                <Bell size={16} className="mt-1 text-purple-600" />
                              )}
                              {event.type === "task" && (
                                <FileText size={16} className="mt-1 text-indigo-600" />
                              )}
                              {event.type === "deadline" && (
                                <Clock size={16} className="mt-1 text-red-600" />
                              )}
                              <div>
                                <p className="font-medium">{event.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {event.type}
                            </div>
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-2 ml-6">
                              {event.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming Reminders */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Upcoming Reminders</h3>
              
              {reminders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No reminders scheduled
                </div>
              ) : (
                <div className="space-y-3">
                  {reminders.slice(0, 3).map((reminder) => (
                    <div 
                      key={reminder.id} 
                      className="p-3 border border-purple-200 rounded-md bg-white hover:bg-purple-50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <Bell size={16} className="mt-1 text-purple-600" />
                        <div>
                          <p className="font-medium">{reminder.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(reminder.start, "MMM d, yyyy")} at {format(reminder.start, "h:mm a")}
                          </p>
                          {reminder.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {reminder.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Project Timeline</h3>
              
              <div className="relative border-l border-gray-200 ml-3 pl-8 space-y-10">
                {events.sort((a, b) => a.start.getTime() - b.start.getTime())
                  .map((event, index) => (
                    <div key={event.id} className="relative">
                      <div className={`
                        absolute -left-11 w-6 h-6 rounded-full flex items-center justify-center
                        ${event.type === "meeting" ? "bg-blue-100" : ""}
                        ${event.type === "deadline" ? "bg-red-100" : ""}
                        ${event.type === "task" ? "bg-indigo-100" : ""}
                        ${event.type === "reminder" ? "bg-purple-100" : ""}
                      `}>
                        {event.type === "meeting" && <CalendarIcon size={14} className="text-blue-600" />}
                        {event.type === "deadline" && <Clock size={14} className="text-red-600" />}
                        {event.type === "task" && <FileText size={14} className="text-indigo-600" />}
                        {event.type === "reminder" && <Bell size={14} className="text-purple-600" />}
                      </div>
                      
                      <div className="absolute -left-28 top-0 w-14 text-sm text-muted-foreground">
                        {format(event.start, "MMM d")}
                      </div>
                      
                      <div className="pb-6">
                        <h4 className="text-lg font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                        </p>
                        {event.description && (
                          <p className="text-muted-foreground mt-2">{event.description}</p>
                        )}
                        {event.location && (
                          <p className="text-sm mt-1">Location: {event.location}</p>
                        )}
                        
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`
                            text-xs px-2 py-1 rounded
                            ${event.status === "scheduled" ? "bg-blue-100 text-blue-800" : ""}
                            ${event.status === "completed" ? "bg-green-100 text-green-800" : ""}
                            ${event.status === "cancelled" ? "bg-red-100 text-red-800" : ""}
                          `}>
                            {event.status}
                          </span>
                          
                          <span className={`
                            text-xs px-2 py-1 rounded
                            ${event.type === "meeting" ? "bg-blue-100 text-blue-800" : ""}
                            ${event.type === "deadline" ? "bg-red-100 text-red-800" : ""}
                            ${event.type === "task" ? "bg-indigo-100 text-indigo-800" : ""}
                            ${event.type === "reminder" ? "bg-purple-100 text-purple-800" : ""}
                          `}>
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Tasks</h3>
                <Button className="flex items-center gap-1" onClick={handleAddTask}>
                  <PlusCircle size={16} />
                  <Paperclip size={16} className="ml-1" />
                  Add Task
                </Button>
              </div>
              
              {filteredEvents.filter(event => event.type === "task").length === 0 ? (
                <div className="text-center py-12 border rounded-md bg-gray-50">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No tasks created</h3>
                  <p className="text-gray-500 mb-4">
                    Create tasks to track project progress
                  </p>
                  <Button className="flex items-center gap-1 mx-auto" onClick={handleAddTask}>
                    <PlusCircle size={16} />
                    Create Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents
                    .filter(event => event.type === "task")
                    .map(task => (
                      <div key={task.id} className="p-4 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center bg-white">
                              {task.status === "completed" && <Check size={12} className="text-green-600" />}
                            </div>
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`
                              text-xs px-2 py-1 rounded
                              ${task.status === "scheduled" ? "bg-blue-100 text-blue-800" : ""}
                              ${task.status === "completed" ? "bg-green-100 text-green-800" : ""}
                              ${task.status === "cancelled" ? "bg-red-100 text-red-800" : ""}
                            `}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-muted-foreground flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Due: {format(task.end, "MMM d, yyyy")}
                          </span>
                          {task.assignedTo && task.assignedTo.length > 0 && (
                            <span>
                              Assigned: {task.assignedTo.length} staff members
                            </span>
                          )}
                        </div>
                        <div className="mt-3 pt-3 border-t flex justify-end">
                          <Button variant="outline" size="sm" className="text-xs">
                            <Paperclip size={12} className="mr-1" />
                            Attach Document
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Reminders</h3>
                <Button className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700" onClick={handleAddReminder}>
                  <Bell size={16} />
                  Add Reminder
                </Button>
              </div>
              
              {filteredEvents.filter(event => event.type === "reminder").length === 0 ? (
                <div className="text-center py-12 border rounded-md bg-gray-50">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No reminders created</h3>
                  <p className="text-gray-500 mb-4">
                    Create reminders to keep track of important events
                  </p>
                  <Button className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 mx-auto" onClick={handleAddReminder}>
                    <Bell size={16} />
                    Add Reminder
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents
                    .filter(event => event.type === "reminder")
                    .sort((a, b) => a.start.getTime() - b.start.getTime())
                    .map(reminder => (
                      <div 
                        key={reminder.id} 
                        className="p-4 border border-purple-200 rounded-md bg-white hover:bg-purple-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Bell size={16} className="mt-1 text-purple-600" />
                            <div>
                              <h4 className="font-medium">{reminder.title}</h4>
                              {reminder.description && (
                                <p className="text-sm text-muted-foreground mt-1">{reminder.description}</p>
                              )}
                              <p className="text-sm mt-2 flex items-center gap-1">
                                <Clock size={14} className="text-muted-foreground" />
                                <span>{format(reminder.start, "MMM d, yyyy")} at {format(reminder.start, "h:mm a")}</span>
                              </p>
                            </div>
                          </div>
                          <div>
                            <span className={`
                              text-xs px-2 py-1 rounded
                              ${reminder.status === "scheduled" ? "bg-blue-100 text-blue-800" : ""}
                              ${reminder.status === "completed" ? "bg-green-100 text-green-800" : ""}
                              ${reminder.status === "cancelled" ? "bg-red-100 text-red-800" : ""}
                            `}>
                              {reminder.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                          {reminder.status === "scheduled" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            >
                              <Check size={12} className="mr-1" />
                              Mark as Done
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="text-xs">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
