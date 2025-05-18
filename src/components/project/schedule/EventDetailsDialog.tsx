
import React from "react";
import { format } from "date-fns";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, FileText, X, Check } from "lucide-react";
import { ProjectStaff, ScheduleEvent } from "./types";
import { getEventTypeBadgeColor, getEventStatusBadgeColor, getEventTypeIcon } from "./eventUtils";

interface EventDetailsDialogProps {
  selectedEvent: ScheduleEvent | null;
  setSelectedEvent: (event: ScheduleEvent | null) => void;
  projectStaff: ProjectStaff[];
  handleDeleteEvent: (id: string) => void;
  handleUpdateEventStatus: (id: string, status: ScheduleEvent["status"]) => void;
}

export default function EventDetailsDialog({
  selectedEvent,
  setSelectedEvent,
  projectStaff,
  handleDeleteEvent,
  handleUpdateEventStatus
}: EventDetailsDialogProps) {
  // Import the icons dynamically based on the event type
  const iconMap = {
    Calendar: CalendarIcon,
    Check: Check,
    FileText: FileText,
    MapPin: MapPin,
    BellRing: function BellRing(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path><path d="M4 2C2.8 3.7 2 5.7 2 8"></path><path d="M22 8c0-2.3-.8-4.3-2-6"></path></svg>; },
    Clock: function Clock(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>; }
  };
  
  if (!selectedEvent) {
    return null;
  }

  const IconComponent = iconMap[getEventTypeIcon(selectedEvent.type)];

  return (
    <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {IconComponent && <IconComponent className="h-4 w-4" />}
            {selectedEvent.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={getEventTypeBadgeColor(selectedEvent.type)}>
              {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
            </Badge>
            <Badge className={getEventStatusBadgeColor(selectedEvent.status)}>
              {selectedEvent.status === "scheduled" ? "Scheduled" : 
               selectedEvent.status === "completed" ? "Completed" : "Cancelled"}
            </Badge>
          </div>
        
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
        </div>

        <DialogFooter className="sm:justify-between">
          <div>
            <Badge className={getEventStatusBadgeColor(selectedEvent.status)}>
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
    </Dialog>
  );
}
