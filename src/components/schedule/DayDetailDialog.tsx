
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
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <DialogHeader className="p-6 pb-3 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2 text-gray-800">
            {formattedDate}
            {isToday(date) && (
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 shadow-none">Today</Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            View all scheduled items for this day
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="px-6 pt-2 grid grid-cols-3 bg-transparent gap-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-gray-100 data-[state=active]:shadow-none">All Items</TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-gray-100 data-[state=active]:shadow-none">Jobs</TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-gray-100 data-[state=active]:shadow-none">Tasks</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 px-6">
            <TabsContent value="all" className="mt-4 space-y-5">
              {jobs.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-3 text-gray-700">
                    <Briefcase className="h-4 w-4 mr-1.5 text-blue-500" /> 
                    Jobs ({jobs.length})
                  </h3>
                  <div className="space-y-3">
                    {jobs.map(job => (
                      <div key={job.id} className="p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-800">{job.title}</h4>
                          <Badge variant={job.status === "completed" ? "outline" : "default"} className="shadow-none">
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Client: {job.clientName}
                        </p>
                        {job.scheduledDate && (
                          <p className="text-xs text-gray-500 mt-1">
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
                  <h3 className="text-sm font-medium flex items-center mb-3 text-gray-700">
                    <ClipboardList className="h-4 w-4 mr-1.5 text-amber-500" /> 
                    Tasks ({regularTasks.length})
                  </h3>
                  <div className="space-y-3">
                    {regularTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              ) : null}
              
              {reminders.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-3 text-gray-700">
                    <Bell className="h-4 w-4 mr-1.5 text-blue-500" /> 
                    Reminders ({reminders.length})
                  </h3>
                  <div className="space-y-3">
                    {reminders.map(reminder => (
                      <ReminderCard key={reminder.id} reminder={reminder} />
                    ))}
                  </div>
                </div>
              ) : null}
              
              {jobs.length === 0 && tasks.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-gray-500">
                    No items scheduled for this day
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="jobs" className="mt-4">
              {jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.map(job => (
                    <div key={job.id} className="p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-800">{job.title}</h4>
                        <Badge variant={job.status === "completed" ? "outline" : "default"} className="shadow-none">
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Client: {job.clientName}
                      </p>
                      {job.scheduledDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Time: {typeof job.scheduledDate === 'string' 
                            ? format(new Date(job.scheduledDate), "h:mm a") 
                            : format(job.scheduledDate, "h:mm a")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-gray-500">
                    No jobs scheduled for this day
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-4">
              {tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks.map(task => (
                    task.isReminder ? (
                      <ReminderCard key={task.id} reminder={task} />
                    ) : (
                      <TaskCard key={task.id} task={task} />
                    )
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-gray-500">
                    No tasks or reminders for this day
                  </p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="p-4 border-t border-gray-100">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="shadow-none border-gray-200">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DayDetailDialog;
