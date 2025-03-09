
import { useState, useEffect } from "react";
import { format, isSameDay, addMonths, subMonths } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Users, Briefcase, CheckSquare } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Job } from "@/components/jobs/JobTypes";
import { initialJobs } from "@/data/jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Task } from "./types";
import { mockTasks } from "./data/mockTasks";

interface LeftSidebarProps {
  isOpen: boolean;
}

const LeftSidebar = ({ isOpen }: LeftSidebarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [jobsForSelectedDate, setJobsForSelectedDate] = useState<Job[]>([]);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Filter jobs and tasks whenever the selected date changes
  useEffect(() => {
    const filteredJobs = jobs.filter(job => 
      isSameDay(job.date, selectedDate)
    );
    setJobsForSelectedDate(filteredJobs);
    
    const filteredTasks = tasks.filter(task => 
      isSameDay(task.dueDate, selectedDate)
    );
    setTasksForSelectedDate(filteredTasks);
  }, [selectedDate, jobs, tasks]);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed top-0 left-0 z-30 h-screen w-80 flex flex-col bg-card text-card-foreground border-r border-border shadow-lg transition-all duration-300 ease-in-out pt-16">
      <div className="h-16 flex items-center px-6 border-b border-border justify-between">
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <CalendarIcon size={18} />
          <span>Calendar</span>
        </h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <Button variant="ghost" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 overflow-auto">
        {/* Calendar Component */}
        <div className="mb-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className={cn("p-3 pointer-events-auto border rounded-md")}
            month={currentMonth}
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
                
                const jobsCount = jobs.filter(job => isSameDay(job.date, date)).length;
                const tasksCount = tasks.filter(task => isSameDay(task.dueDate, date)).length;
                const hasEvents = jobsCount > 0 || tasksCount > 0;
                
                let dayColor = "";
                if (hasEvents) {
                  if (jobs.some(job => isSameDay(job.date, date) && job.status === "in_progress")) {
                    dayColor = "bg-yellow-100 text-yellow-800";
                  } else if (tasks.some(task => isSameDay(task.dueDate, date) && task.priority === "high")) {
                    dayColor = "bg-red-100 text-red-800";
                  } else {
                    dayColor = "bg-blue-100 text-blue-800";
                  }
                }
                
                return (
                  <button 
                    type="button"
                    className={cn(
                      "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                      dayColor,
                      isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      "relative"
                    )}
                    disabled={isOutsideMonth}
                    {...props}
                  >
                    {format(date, "d")}
                    {hasEvents && (
                      <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-0.5">
                        {jobsCount > 0 && (
                          <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                        )}
                        {tasksCount > 0 && (
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
        
        {/* Day Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const prevDay = new Date(selectedDate);
                prevDay.setDate(prevDay.getDate() - 1);
                setSelectedDate(prevDay);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h3 className="text-md font-medium">
              {format(selectedDate, "EEEE, MMMM d")}
            </h3>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const nextDay = new Date(selectedDate);
                nextDay.setDate(nextDay.getDate() + 1);
                setSelectedDate(nextDay);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {/* Jobs Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">Jobs ({jobsForSelectedDate.length})</h4>
              </div>
              
              {jobsForSelectedDate.length === 0 ? (
                <p className="text-sm text-muted-foreground">No jobs scheduled for this day.</p>
              ) : (
                <div className="space-y-2">
                  {jobsForSelectedDate.map((job) => (
                    <Card key={job.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-medium">{job.title}</h4>
                            <p className="text-xs text-muted-foreground">{job.clientName}</p>
                          </div>
                          <Badge 
                            className={cn(
                              job.status === "scheduled" && "bg-blue-500",
                              job.status === "in_progress" && "bg-yellow-500",
                              job.status === "completed" && "bg-green-500",
                              job.status === "cancelled" && "bg-red-500"
                            )}
                          >
                            {job.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            {/* Tasks Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckSquare className="h-4 w-4 text-red-600" />
                <h4 className="font-medium">Tasks ({tasksForSelectedDate.length})</h4>
              </div>
              
              {tasksForSelectedDate.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks due for this day.</p>
              ) : (
                <div className="space-y-2">
                  {tasksForSelectedDate.map((task) => (
                    <Card key={task.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-medium">{task.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {task.client.name}
                            </p>
                          </div>
                          <Badge 
                            className={cn(
                              task.priority === "low" && "bg-blue-500",
                              task.priority === "medium" && "bg-yellow-500",
                              task.priority === "high" && "bg-red-500"
                            )}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
