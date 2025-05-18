
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectStaff, ScheduleEvent } from "./types";
import { getEventTypeIcon, getEventStatusBadgeColor } from "./eventUtils";

interface StaffTabViewProps {
  projectStaff: ProjectStaff[];
  filteredEvents: ScheduleEvent[];
}

export default function StaffTabView({ projectStaff, filteredEvents }: StaffTabViewProps) {
  // Import the icons dynamically based on the event type
  const iconMap = {
    Calendar: function Calendar(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>; },
    Check: function Check(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>; },
    FileText: function FileText(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>; },
    BellRing: function BellRing(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path><path d="M4 2C2.8 3.7 2 5.7 2 8"></path><path d="M22 8c0-2.3-.8-4.3-2-6"></path></svg>; },
    Clock: function Clock(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>; }
  };

  return (
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
                {filteredEvents
                  .filter(event => event.assignedTo?.includes(staff.id))
                  .map(event => {
                    const IconComponent = iconMap[getEventTypeIcon(event.type)];
                    
                    return (
                      <li key={event.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {IconComponent && <IconComponent className="h-4 w-4" />}
                          <span>{event.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(event.start, "MMM d, h:mm a")}
                          </span>
                        </div>
                        <Badge className={getEventStatusBadgeColor(event.status)}>
                          {event.status === "scheduled" ? "Scheduled" : 
                          event.status === "completed" ? "Completed" : "Cancelled"}
                        </Badge>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No staff assigned to this project.</p>
        )}
      </CardContent>
    </Card>
  );
}
