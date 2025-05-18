
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellRing, CalendarIcon, Check, Plus } from "lucide-react";
import { ScheduleEvent } from "./types";
import { getEventStatusBadgeColor } from "./eventUtils";

interface RemindersTabViewProps {
  events: ScheduleEvent[];
  setSelectedEvent: (event: ScheduleEvent) => void;
  handleUpdateEventStatus: (id: string, status: ScheduleEvent["status"]) => void;
  handleAddReminder: () => void;
}

export default function RemindersTabView({ 
  events, 
  setSelectedEvent, 
  handleUpdateEventStatus,
  handleAddReminder 
}: RemindersTabViewProps) {
  // Filter events for reminders
  const reminderEvents = events.filter(event => event.type === "reminder");

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Project Reminders</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-purple-800 border-purple-300 hover:bg-purple-50" 
            onClick={handleAddReminder}
          >
            <Plus size={14} /> Add Reminder
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reminderEvents.length > 0 ? (
            reminderEvents
              .sort((a, b) => a.start.getTime() - b.start.getTime())
              .map(event => (
                <Card key={event.id} className="border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BellRing className="h-5 w-5 text-purple-600" />
                        <p className="font-medium">{event.title}</p>
                      </div>
                      <Badge className={getEventStatusBadgeColor(event.status)}>
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
                onClick={handleAddReminder}
                className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
              >
                <Plus size={16} /> Add Your First Reminder
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
