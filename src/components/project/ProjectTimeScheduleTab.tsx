
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format, addDays, isSameDay } from "date-fns";
import { toast } from "sonner";
import { ProjectStaff } from "@/types/finance";
import { Clock, Calendar as CalendarIcon, Plus, CheckCircle, User, AlarmClock, CalendarDays } from "lucide-react";

interface ProjectTimeScheduleTabProps {
  projectId: number;
  projectStaff?: ProjectStaff[];
}

interface ScheduleEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  staffIds: string[];
  location?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const ProjectTimeScheduleTab: React.FC<ProjectTimeScheduleTabProps> = ({ projectId, projectStaff = [] }) => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([
    {
      id: "event-1",
      title: "Site Preparation",
      date: new Date(),
      startTime: "08:00",
      endTime: "12:00",
      staffIds: projectStaff.length > 0 ? [projectStaff[0].id] : [],
      location: "Main Building",
      notes: "Initial site preparation and equipment setup",
      status: "scheduled"
    },
    {
      id: "event-2",
      title: "Foundation Work",
      date: addDays(new Date(), 2),
      startTime: "09:00",
      endTime: "17:00",
      staffIds: projectStaff.slice(0, 2).map(s => s.id),
      status: "scheduled"
    },
    {
      id: "event-3",
      title: "Material Delivery",
      date: addDays(new Date(), -1),
      startTime: "13:00",
      endTime: "15:00",
      staffIds: [],
      location: "Loading Dock",
      status: "completed"
    }
  ]);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<ScheduleEvent>>({
    date: new Date(),
    status: 'scheduled',
    staffIds: []
  });

  const eventsForSelectedDate = scheduleEvents.filter(event => 
    isSameDay(event.date, selectedDate)
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  const getStaffNameById = (id: string) => {
    const staff = projectStaff.find(s => s.id === id);
    return staff ? staff.name : "Unassigned";
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      toast.error("Please provide a title, start time and end time");
      return;
    }

    const event: ScheduleEvent = {
      id: `event-${Date.now()}`,
      title: newEvent.title || "",
      date: newEvent.date || new Date(),
      startTime: newEvent.startTime || "",
      endTime: newEvent.endTime || "",
      staffIds: newEvent.staffIds || [],
      location: newEvent.location,
      notes: newEvent.notes,
      status: newEvent.status as 'scheduled' | 'completed' | 'cancelled'
    };

    setScheduleEvents([...scheduleEvents, event]);
    setShowAddEventDialog(false);
    setNewEvent({
      date: new Date(),
      status: 'scheduled',
      staffIds: []
    });
    
    toast.success("Schedule event added successfully");
  };

  const handleEventStatusChange = (eventId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    const updatedEvents = scheduleEvents.map(event => 
      event.id === eventId ? { ...event, status: newStatus } : event
    );
    setScheduleEvents(updatedEvents);
    toast.success(`Event marked as ${newStatus}`);
  };

  const handleDeleteEvent = (eventId: string) => {
    setScheduleEvents(scheduleEvents.filter(event => event.id !== eventId));
    toast.success("Event removed from schedule");
  };

  const toggleStaffSelection = (staffId: string) => {
    setNewEvent(prev => {
      const currentStaffIds = prev.staffIds || [];
      if (currentStaffIds.includes(staffId)) {
        return { ...prev, staffIds: currentStaffIds.filter(id => id !== staffId) };
      } else {
        return { ...prev, staffIds: [...currentStaffIds, staffId] };
      }
    });
  };

  const getDayEventCount = (date: Date) => {
    return scheduleEvents.filter(event => isSameDay(event.date, date)).length;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Project Time & Schedule Management</h2>
        <div className="flex flex-wrap gap-2">
          <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Schedule Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Schedule New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input 
                    id="title"
                    value={newEvent.title || ""}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="E.g., Site meeting, Material delivery"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date *</Label>
                    <div className="border rounded-md overflow-hidden">
                      <Calendar 
                        mode="single"
                        selected={newEvent.date} 
                        onSelect={(date) => setNewEvent({...newEvent, date: date || new Date()})}
                        className="p-3 pointer-events-auto"
                        showOutsideDays
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Input 
                        id="startTime"
                        type="time"
                        value={newEvent.startTime || ""}
                        onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endTime">End Time *</Label>
                      <Input 
                        id="endTime"
                        type="time"
                        value={newEvent.endTime || ""}
                        onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    value={newEvent.location || ""}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder="Event location"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Assign Staff</Label>
                  <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                    {projectStaff.length === 0 ? (
                      <p className="text-sm text-gray-500 p-2">No staff members available</p>
                    ) : (
                      <div className="space-y-2">
                        {projectStaff.map(staff => (
                          <div key={staff.id} className="flex items-center gap-2">
                            <input 
                              type="checkbox"
                              id={`staff-${staff.id}`}
                              checked={(newEvent.staffIds || []).includes(staff.id)}
                              onChange={() => toggleStaffSelection(staff.id)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={`staff-${staff.id}`} className="text-sm cursor-pointer">
                              {staff.name} <span className="text-gray-500">({staff.role})</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newEvent.notes || ""}
                    onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                    placeholder="Additional event details..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddEventDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent}>
                  Schedule Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-md p-4 shadow-sm border">
            <div className="text-sm font-medium text-gray-500">Today's Events</div>
            <div className="text-2xl font-bold mt-1">
              {scheduleEvents.filter(event => isSameDay(event.date, new Date())).length}
            </div>
          </div>
          <div className="bg-white rounded-md p-4 shadow-sm border">
            <div className="text-sm font-medium text-gray-500">This Week</div>
            <div className="text-2xl font-bold mt-1">
              {scheduleEvents.filter(event => {
                const eventDate = new Date(event.date);
                const today = new Date();
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                return eventDate >= startOfWeek && eventDate <= endOfWeek;
              }).length}
            </div>
          </div>
          <div className="bg-white rounded-md p-4 shadow-sm border">
            <div className="text-sm font-medium text-gray-500">Staff Assigned</div>
            <div className="text-2xl font-bold mt-1">
              {new Set(scheduleEvents.flatMap(event => event.staffIds)).size}
            </div>
          </div>
          <div className="bg-white rounded-md p-4 shadow-sm border">
            <div className="text-sm font-medium text-gray-500">Completion Rate</div>
            <div className="text-2xl font-bold mt-1">
              {scheduleEvents.length === 0 ? "0%" : 
                `${Math.round(scheduleEvents.filter(e => e.status === "completed").length / scheduleEvents.length * 100)}%`}
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="calendar" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-gray-100/70">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Clock className="h-4 w-4 mr-2" />
            Schedule List
          </TabsTrigger>
          <TabsTrigger value="staff" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            Staff Schedule
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date || new Date())}
                  className="pointer-events-auto"
                  components={{
                    DayContent: (day) => {
                      const date = day.date;
                      const eventCount = getDayEventCount(date);
                      return (
                        <div className="relative">
                          {day.date.getDate()}
                          {eventCount > 0 && (
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          )}
                        </div>
                      );
                    },
                  }}
                />
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">
                    Selected: {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                  <Button 
                    onClick={() => {
                      setNewEvent(prev => ({ ...prev, date: selectedDate }));
                      setShowAddEventDialog(true);
                    }}
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Event on {format(selectedDate, 'MMM d')}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="bg-gray-50/70">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5 text-blue-600" />
                    Events for {format(selectedDate, 'MMMM d, yyyy')}
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {eventsForSelectedDate.length} Events
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {eventsForSelectedDate.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <AlarmClock className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium">No events scheduled</h3>
                    <p className="mt-1 text-gray-500">
                      There are no events scheduled for this date.
                    </p>
                    <Button
                      onClick={() => {
                        setNewEvent(prev => ({ ...prev, date: selectedDate }));
                        setShowAddEventDialog(true);
                      }}
                      className="mt-4"
                    >
                      Schedule Event
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eventsForSelectedDate.map((event) => (
                      <Card key={event.id} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                <Clock size={20} />
                              </div>
                              <div>
                                <h3 className="font-medium">{event.title}</h3>
                                <p className="text-sm text-gray-500">
                                  {event.startTime} - {event.endTime}
                                </p>
                              </div>
                            </div>
                            {getStatusBadge(event.status)}
                          </div>
                          
                          {event.location && (
                            <div className="mt-3 flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                              <span className="text-sm">{event.location}</span>
                            </div>
                          )}
                          
                          {event.staffIds.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-500 mb-1.5">Assigned staff:</p>
                              <div className="flex flex-wrap gap-2">
                                {event.staffIds.map(staffId => (
                                  <Badge key={staffId} variant="outline" className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {getStaffNameById(staffId)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {event.notes && (
                            <div className="mt-3 text-sm bg-gray-50 p-2 rounded-md">
                              <p className="text-gray-600">{event.notes}</p>
                            </div>
                          )}
                          
                          <div className="mt-4 pt-3 border-t flex justify-between">
                            <div className="flex items-center gap-2">
                              {event.status !== 'completed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-700"
                                  onClick={() => handleEventStatusChange(event.id, 'completed')}
                                >
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                  Mark Completed
                                </Button>
                              )}
                              {event.status === 'scheduled' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-700"
                                  onClick={() => handleEventStatusChange(event.id, 'cancelled')}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Scheduled Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="grid grid-cols-12 gap-4 p-3 font-medium text-gray-600 bg-gray-50 rounded-t-md">
                  <div className="col-span-3">Title</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Time</div>
                  <div className="col-span-2">Staff</div>
                  <div className="col-span-1">Location</div>
                  <div className="col-span-2">Status</div>
                </div>
                
                {scheduleEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No events scheduled yet</p>
                  </div>
                ) : (
                  <div className="rounded-b-md border overflow-hidden">
                    {scheduleEvents
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((event) => (
                      <div key={event.id} className="grid grid-cols-12 gap-4 p-3 border-b last:border-b-0 hover:bg-gray-50">
                        <div className="col-span-3 font-medium">{event.title}</div>
                        <div className="col-span-2">{format(event.date, 'MMM d, yyyy')}</div>
                        <div className="col-span-2">{event.startTime} - {event.endTime}</div>
                        <div className="col-span-2">
                          {event.staffIds.length === 0 ? (
                            <span className="text-gray-400 text-sm">None</span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {event.staffIds.slice(0, 2).map(staffId => (
                                <span key={staffId} className="text-sm">{getStaffNameById(staffId)}</span>
                              ))}
                              {event.staffIds.length > 2 && (
                                <span className="text-xs text-gray-400">
                                  +{event.staffIds.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-span-1">
                          {event.location ? (
                            <span className="text-sm">{event.location}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </div>
                        <div className="col-span-2">
                          {getStatusBadge(event.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff">
          <div className="space-y-6">
            {projectStaff.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <User size={48} className="text-gray-300 mb-3" />
                  <p className="text-xl font-medium text-gray-500">No staff members assigned</p>
                  <p className="text-gray-400 mb-4">Add staff to this project to see their schedules</p>
                  <Button onClick={() => setActiveTab("calendar")} className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    View Calendar
                  </Button>
                </CardContent>
              </Card>
            ) : (
              projectStaff.map((staff) => {
                const staffEvents = scheduleEvents.filter(event => event.staffIds.includes(staff.id));
                return (
                  <Card key={staff.id}>
                    <CardHeader className="bg-gray-50/70">
                      <CardTitle className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                          <User size={18} />
                        </div>
                        <div>
                          <div>{staff.name}</div>
                          <div className="text-sm text-gray-500 font-normal capitalize">{staff.role}</div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {staffEvents.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-gray-500">No events scheduled for this staff member</p>
                          <Button
                            onClick={() => {
                              setNewEvent(prev => ({
                                ...prev,
                                staffIds: [staff.id],
                                date: selectedDate
                              }));
                              setShowAddEventDialog(true);
                            }}
                            variant="outline"
                            className="mt-2"
                          >
                            Schedule Event
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {staffEvents
                            .sort((a, b) => a.date.getTime() - b.date.getTime())
                            .map((event) => (
                            <div key={event.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                  <Clock size={16} />
                                </div>
                                <div>
                                  <p className="font-medium">{event.title}</p>
                                  <p className="text-sm text-gray-500">
                                    {format(event.date, 'MMM d')} • {event.startTime} - {event.endTime}
                                  </p>
                                </div>
                              </div>
                              {getStatusBadge(event.status)}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectTimeScheduleTab;
