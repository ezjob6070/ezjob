
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { format, isToday } from 'date-fns';
import { Job } from '@/types/job';
import { Task } from '@/components/calendar/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, ClipboardList, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCard from '@/components/calendar/components/TaskCard';
import ReminderCard from '@/components/schedule/ReminderCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DayDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  jobs: Job[];
  tasks: Task[];
}

const DayDetailDialog = ({ 
  open, 
  onOpenChange, 
  date, 
  jobs, 
  tasks 
}: DayDetailDialogProps) => {
  const formattedDate = format(date, "MMMM d, yyyy");
  const reminders = tasks.filter(task => task.isReminder);
  const regularTasks = tasks.filter(task => !task.isReminder);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {formattedDate}
            {isToday(date) && (
              <Badge className="bg-blue-50 text-blue-800">Today</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            View all scheduled items for this day
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 -mx-6 px-6">
            <TabsContent value="all" className="mt-0 space-y-4">
              {jobs.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <Briefcase className="h-4 w-4 mr-1" /> 
                    Jobs ({jobs.length})
                  </h3>
                  <div className="space-y-2">
                    {jobs.map(job => (
                      <div key={job.id} className="p-3 bg-white rounded-md border-l-4 border-l-blue-300 shadow-sm">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{job.title}</h4>
                          <Badge variant={job.status === "completed" ? "outline" : "default"}>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Client: {job.clientName}
                        </p>
                        {job.scheduledDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Time: {typeof job.scheduledDate === 'string' 
                              ? format(new Date(job.scheduledDate), "h:mm a") 
                              : format(job.scheduledDate, "h:mm a")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              
              {regularTasks.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <ClipboardList className="h-4 w-4 mr-1" /> 
                    Tasks ({regularTasks.length})
                  </h3>
                  <div className="space-y-2">
                    {regularTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              ) : null}
              
              {reminders.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <Bell className="h-4 w-4 mr-1" /> 
                    Reminders ({reminders.length})
                  </h3>
                  <div className="space-y-2">
                    {reminders.map(reminder => (
                      <ReminderCard key={reminder.id} reminder={reminder} />
                    ))}
                  </div>
                </div>
              ) : null}
              
              {jobs.length === 0 && tasks.length === 0 && (
                <p className="text-center py-4 text-muted-foreground">
                  No items scheduled for this day
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="jobs" className="mt-0">
              {jobs.length > 0 ? (
                <div className="space-y-2">
                  {jobs.map(job => (
                    <div key={job.id} className="p-3 bg-white rounded-md border-l-4 border-l-blue-300 shadow-sm">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{job.title}</h4>
                        <Badge variant={job.status === "completed" ? "outline" : "default"}>
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Client: {job.clientName}
                      </p>
                      {job.scheduledDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Time: {typeof job.scheduledDate === 'string' 
                            ? format(new Date(job.scheduledDate), "h:mm a") 
                            : format(job.scheduledDate, "h:mm a")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No jobs scheduled for this day
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-0">
              {tasks.length > 0 ? (
                <div className="space-y-2">
                  {tasks.map(task => (
                    task.isReminder ? (
                      <ReminderCard key={task.id} reminder={task} />
                    ) : (
                      <TaskCard key={task.id} task={task} />
                    )
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No tasks or reminders for this day
                </p>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="sm:justify-start mt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DayDetailDialog;
