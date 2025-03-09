
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Job } from "@/components/jobs/JobTypes";
import { initialJobs } from "@/data/jobs";
import { format, isSameDay } from "date-fns";
import JobsList from "@/components/calendar/components/JobsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/components/calendar/types";
import { mockTasks } from "@/components/calendar/data/mockTasks";
import UpcomingEvents from "@/components/UpcomingEvents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [jobsForSelectedDate, setJobsForSelectedDate] = useState<Job[]>([]);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([]);

  const updateSelectedDateItems = (date: Date) => {
    const filteredJobs = jobs.filter(job => isSameDay(job.date, date));
    setJobsForSelectedDate(filteredJobs);
    
    const filteredTasks = tasks.filter(task => isSameDay(task.dueDate, date));
    setTasksForSelectedDate(filteredTasks);
    
    setSelectedDate(date);
  };

  const upcomingEvents = [
    ...jobs.map(job => ({
      id: job.id,
      title: job.title,
      datetime: job.date,
      type: "meeting" as const,
      clientName: job.clientName,
    })),
    ...tasks.map(task => ({
      id: task.id,
      title: task.title,
      datetime: task.dueDate,
      type: "deadline" as const,
      clientName: task.client.name,
    })),
  ].sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
   .slice(0, 5);

  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    updateSelectedDateItems(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    updateSelectedDateItems(nextDay);
  };

  const getDayClassName = (date: Date) => {
    const hasJobs = jobs.some(job => isSameDay(job.date, date));
    const hasTasks = tasks.some(task => isSameDay(task.dueDate, date));
    const hasHighPriorityTasks = tasks.some(task => 
      isSameDay(task.dueDate, date) && task.priority === 'high'
    );
    
    if (hasHighPriorityTasks) return "bg-red-100 text-red-900 font-medium";
    if (hasJobs && hasTasks) return "bg-purple-100 text-purple-900 font-medium";
    if (hasJobs) return "bg-blue-100 text-blue-900 font-medium";
    if (hasTasks) return "bg-amber-100 text-amber-900 font-medium";
    return "";
  };

  useState(() => {
    updateSelectedDateItems(selectedDate);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Schedule</h1>
        <p className="text-muted-foreground">
          Manage your appointments, jobs, and tasks in one place.
        </p>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent className="p-0 pb-6">
                <div className="flex justify-end items-center px-2 w-full">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && updateSelectedDateItems(date)}
                    className="w-full scale-125 transform origin-right mr-12"
                    modifiers={{
                      hasEvents: (date) => 
                        jobs.some(job => isSameDay(job.date, date)) || 
                        tasks.some(task => isSameDay(task.dueDate, date)),
                    }}
                    modifiersClassNames={{
                      hasEvents: "font-bold",
                    }}
                    components={{
                      Day: ({ date, displayMonth, ...props }) => {
                        const isSelected = isSameDay(date, selectedDate);
                        const isOutsideMonth = date.getMonth() !== displayMonth.getMonth();
                        
                        return (
                          <button 
                            type="button"
                            className={cn(
                              "h-9 w-9 p-0 aria-selected:opacity-100 rounded-md relative",
                              getDayClassName(date),
                              isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                              isOutsideMonth && "text-muted-foreground opacity-50"
                            )}
                            disabled={isOutsideMonth}
                            {...props}
                          >
                            {format(date, "d")}
                            {(jobs.some(job => isSameDay(job.date, date)) || 
                              tasks.some(task => isSameDay(task.dueDate, date))) && 
                              !isSelected && (
                              <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-0.5">
                                {jobs.some(job => isSameDay(job.date, date)) && (
                                  <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                                )}
                                {tasks.some(task => isSameDay(task.dueDate, date)) && (
                                  <div className="w-1 h-1 rounded-full bg-red-500"></div>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      }
                    }}
                  />
                </div>
                <div className="flex justify-center gap-6 mt-4 px-4 w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-500"></div>
                    <span className="text-xs">Jobs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-500"></div>
                    <span className="text-xs">Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-500"></div>
                    <span className="text-xs">Both</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-100 border border-red-500"></div>
                    <span className="text-xs">High Priority</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Jobs ({jobsForSelectedDate.length})</h3>
                    {jobsForSelectedDate.length === 0 ? (
                      <p className="text-muted-foreground">No jobs scheduled for this day</p>
                    ) : (
                      <div className="space-y-3">
                        {jobsForSelectedDate.map(job => (
                          <Card key={job.id} className="p-3 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="font-medium">{job.title}</p>
                                <p className="text-sm text-muted-foreground">{job.clientName}</p>
                              </div>
                              <div className="text-right text-sm">
                                <p>${job.amount}</p>
                                <p className="text-muted-foreground capitalize">{job.status.replace('_', ' ')}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tasks ({tasksForSelectedDate.length})</h3>
                    {tasksForSelectedDate.length === 0 ? (
                      <p className="text-muted-foreground">No tasks due for this day</p>
                    ) : (
                      <div className="space-y-3">
                        {tasksForSelectedDate.map(task => (
                          <Card key={task.id} className="p-3 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="font-medium">{task.title}</p>
                                <p className="text-sm text-muted-foreground">{task.client.name}</p>
                              </div>
                              <div className="text-right text-sm">
                                <p className="capitalize">{task.status}</p>
                                <p className="text-muted-foreground capitalize">{task.priority} priority</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <UpcomingEvents events={upcomingEvents} />
        </TabsContent>
        
        <TabsContent value="jobs">
          <JobsList 
            selectedDate={selectedDate}
            jobsForSelectedDate={jobsForSelectedDate}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
          />
        </TabsContent>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePreviousDay}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <CardTitle>{format(selectedDate, "EEEE, MMMM d, yyyy")}</CardTitle>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNextDay}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tasksForSelectedDate.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No tasks due for this day</p>
              ) : (
                <div className="space-y-4">
                  {tasksForSelectedDate.map(task => (
                    <Card key={task.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-sm text-muted-foreground">{task.client.name}</p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              className={cn(
                                task.priority === "low" && "bg-blue-500",
                                task.priority === "medium" && "bg-yellow-500",
                                task.priority === "high" && "bg-red-500"
                              )}
                            >
                              {task.priority}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1 capitalize">{task.status}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Schedule;
