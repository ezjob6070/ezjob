
import { format, isSameDay } from "date-fns";
import { Card } from "@/components/ui/card";
import { Job } from "@/components/jobs/JobTypes";
import { Task } from "@/components/calendar/types";
import { CalendarViewMode } from "../CalendarViewOptions";

interface CalendarSidebarProps {
  selectedDate: Date;
  viewMode: CalendarViewMode;
  jobs: Job[];
  tasks: Task[];
}

const CalendarSidebar = ({ selectedDate, viewMode, jobs, tasks }: CalendarSidebarProps) => {
  return (
    <Card className="md:col-span-1">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">
          {format(selectedDate, viewMode === 'day' ? "MMMM d, yyyy" : "MMMM yyyy")}
        </h2>
      </div>
      <div className="max-h-[500px] overflow-y-auto p-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Jobs ({jobs.length})</h3>
            {jobs.length === 0 ? (
              <p className="text-muted-foreground">No jobs scheduled for this {viewMode}</p>
            ) : (
              <div className="space-y-3">
                {jobs.map(job => (
                  <Card key={job.id} className="p-3 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.clientName}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p>${job.amount}</p>
                        <p className="text-muted-foreground capitalize">{job.status.replace('_', ' ')}</p>
                        {viewMode !== 'day' && job.date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(
                              job.date instanceof Date ? job.date : new Date(job.date), 
                              "MMM d"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Tasks ({tasks.length})</h3>
            {tasks.length === 0 ? (
              <p className="text-muted-foreground">No tasks due for this {viewMode}</p>
            ) : (
              <div className="space-y-3">
                {tasks.map(task => (
                  <Card key={task.id} className="p-3 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.client?.name}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="capitalize">{task.status}</p>
                        <p className="text-muted-foreground capitalize">{task.priority} priority</p>
                        {viewMode !== 'day' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(task.dueDate, "MMM d")}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CalendarSidebar;
