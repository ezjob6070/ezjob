
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isToday } from "date-fns";
import { Job } from "@/types/job";
import { Task } from "@/components/calendar/types";
import { Briefcase, ListTodo, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  jobs: Job[];
  tasks: Task[];
}

const DayDetailDialog = ({ open, onOpenChange, date, jobs, tasks }: DayDetailDialogProps) => {
  const formattedDate = format(date, "MMMM d, yyyy");
  const isSelectedDateToday = isToday(date);
  const reminderTasks = tasks.filter(task => task.isReminder);
  const regularTasks = tasks.filter(task => !task.isReminder);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            {formattedDate}
            {isSelectedDateToday && (
              <Badge className="ml-2 bg-blue-50 text-blue-800">Today</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
            <TabsTrigger value="tasks">Tasks ({regularTasks.length + reminderTasks.length})</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 pr-4">
            <TabsContent value="all" className="space-y-6 mt-0">
              {/* Jobs Section */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                  <h3 className="text-sm font-medium">Jobs ({jobs.length})</h3>
                </div>
                
                {jobs.length > 0 ? (
                  <div className="space-y-2">
                    {jobs.map(job => (
                      <div key={job.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{job.title || job.description || "Untitled Job"}</h4>
                          <Badge variant="outline" className="text-xs">
                            {job.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          {job.clientName || "No client"}
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                          <div>${job.amount}</div>
                          <div>{job.time || "No time specified"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-3 text-center text-sm text-gray-500">
                    No jobs scheduled
                  </div>
                )}
              </div>

              {/* Tasks Section */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <ListTodo className="h-4 w-4 text-gray-500 mr-2" />
                  <h3 className="text-sm font-medium">Tasks ({regularTasks.length})</h3>
                </div>
                
                {regularTasks.length > 0 ? (
                  <div className="space-y-2">
                    {regularTasks.map(task => (
                      <div 
                        key={task.id} 
                        className={cn(
                          "p-3 rounded-lg",
                          task.status === "completed" ? "bg-gray-50" : "bg-gray-50"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <Badge 
                            variant={
                              task.status === "completed" ? "outline" :
                              task.status === "overdue" ? "destructive" :
                              task.status === "in progress" ? "secondary" : 
                              "default"
                            }
                            className="text-xs"
                          >
                            {task.status}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="mt-1 text-xs text-gray-500">{task.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-3 text-center text-sm text-gray-500">
                    No tasks scheduled
                  </div>
                )}
              </div>
              
              {/* Reminders Section */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <Bell className="h-4 w-4 text-gray-500 mr-2" />
                  <h3 className="text-sm font-medium">Reminders ({reminderTasks.length})</h3>
                </div>
                
                {reminderTasks.length > 0 ? (
                  <div className="space-y-2">
                    {reminderTasks.map(reminder => (
                      <div key={reminder.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{reminder.title}</h4>
                          <div className="text-xs text-gray-500">
                            {new Date(reminder.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        {reminder.description && (
                          <p className="mt-1 text-xs text-gray-500">{reminder.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-3 text-center text-sm text-gray-500">
                    No reminders set
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4 mt-0">
              {jobs.length > 0 ? (
                <div className="space-y-2">
                  {jobs.map(job => (
                    <div key={job.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{job.title || job.description || "Untitled Job"}</h4>
                        <Badge variant="outline">
                          {job.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          Client: {job.clientName || "No client"}
                        </div>
                        {job.description && (
                          <div className="text-sm text-gray-600">
                            Description: {job.description}
                          </div>
                        )}
                        <div className="text-sm text-gray-600">
                          Amount: ${job.amount}
                        </div>
                        {job.time && (
                          <div className="text-sm text-gray-600">
                            Time: {job.time}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  No jobs scheduled for this day
                </div>
              )}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4 mt-0">
              {regularTasks.length > 0 || reminderTasks.length > 0 ? (
                <div className="space-y-6">
                  {regularTasks.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium flex items-center">
                        <ListTodo className="h-4 w-4 mr-2" />
                        Tasks
                      </h3>
                      <div className="space-y-2">
                        {regularTasks.map(task => (
                          <div key={task.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{task.title}</h4>
                              <Badge 
                                variant={
                                  task.status === "completed" ? "outline" :
                                  task.status === "overdue" ? "destructive" :
                                  task.status === "in progress" ? "secondary" : 
                                  "default"
                                }
                              >
                                {task.status}
                              </Badge>
                            </div>
                            {task.description && (
                              <div className="text-sm text-gray-600 mt-2">
                                {task.description}
                              </div>
                            )}
                            {task.client?.name && (
                              <div className="text-sm text-gray-600 mt-2">
                                Client: {task.client.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {reminderTasks.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        Reminders
                      </h3>
                      <div className="space-y-2">
                        {reminderTasks.map(reminder => (
                          <div key={reminder.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{reminder.title}</h4>
                              <div className="text-sm text-gray-500">
                                {new Date(reminder.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            {reminder.description && (
                              <div className="text-sm text-gray-600 mt-2">
                                {reminder.description}
                              </div>
                            )}
                            {reminder.client?.name && (
                              <div className="text-sm text-gray-600 mt-2">
                                Client: {reminder.client.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  No tasks or reminders for this day
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DayDetailDialog;
