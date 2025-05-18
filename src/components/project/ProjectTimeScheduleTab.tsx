
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Import new components
import { ProjectStaff, ScheduleEvent } from "./schedule/types";
import AddEventDialog from "./schedule/AddEventDialog";
import AddReminderDialog from "./schedule/AddReminderDialog";
import EventDetailsDialog from "./schedule/EventDetailsDialog";
import CalendarTabView from "./schedule/CalendarTabView";
import ListTabView from "./schedule/ListTabView";
import StaffTabView from "./schedule/StaffTabView";
import RemindersTabView from "./schedule/RemindersTabView";

interface ProjectTimeScheduleTabProps {
  projectId: number;
  projectStaff?: ProjectStaff[];
}

export default function ProjectTimeScheduleTab({ projectId, projectStaff = [] }: ProjectTimeScheduleTabProps) {
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
    end: new Date(new Date().getTime() + 30 * 60000),
    description: "",
    status: "scheduled",
    type: "reminder"
  });
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [showReminders, setShowReminders] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter events based on showReminders toggle and searchQuery
  const filteredEvents = events
    .filter(event => showReminders ? true : event.type !== "reminder")
    .filter(event => 
      searchQuery ? 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
    );
  
  const remindersCount = events.filter(event => event.type === "reminder").length;
  
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
          <CalendarTabView
            date={date}
            setDate={setDate}
            events={events}
            setSelectedEvent={setSelectedEvent}
            filteredEvents={filteredEvents}
          />
        </TabsContent>

        <TabsContent value="list" className="py-4">
          <ListTabView 
            filteredEvents={filteredEvents} 
            setSelectedEvent={setSelectedEvent}
          />
        </TabsContent>

        <TabsContent value="staff" className="py-4">
          <StaffTabView 
            projectStaff={projectStaff}
            filteredEvents={filteredEvents}
          />
        </TabsContent>
        
        <TabsContent value="reminders" className="py-4">
          <RemindersTabView 
            events={events.filter(event => 
              searchQuery ? 
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
              : true
            )}
            setSelectedEvent={setSelectedEvent}
            handleUpdateEventStatus={handleUpdateEventStatus}
            handleAddReminder={() => setShowAddReminderDialog(true)}
          />
        </TabsContent>
      </Tabs>

      {/* Add Event Dialog */}
      <AddEventDialog 
        open={showAddEventDialog}
        onOpenChange={setShowAddEventDialog}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
      />

      {/* Add Reminder Dialog */}
      <AddReminderDialog 
        open={showAddReminderDialog}
        onOpenChange={setShowAddReminderDialog}
        newReminder={newReminder}
        setNewReminder={setNewReminder}
        handleAddReminder={handleAddReminder}
      />

      {/* Event Details Dialog */}
      <EventDetailsDialog 
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        projectStaff={projectStaff}
        handleDeleteEvent={handleDeleteEvent}
        handleUpdateEventStatus={handleUpdateEventStatus}
      />
    </div>
  );
}
