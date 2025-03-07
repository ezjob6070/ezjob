
import { useState, useEffect } from "react";
import { format, isSameDay, addMonths, subMonths } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Job } from "@/components/jobs/JobTypes";
import { initialJobs } from "@/data/jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  BriefcaseIcon,
  ClipboardListIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayProps } from "react-day-picker";

interface LeftCalendarSidebarProps {
  isOpen: boolean;
}

// Mock task data - in a real app, this would come from a central store or API
const mockTasks = [
  {
    id: "1",
    title: "Follow up on proposal",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    priority: "high",
    status: "todo",
    client: { name: "John Doe" }
  },
  {
    id: "2",
    title: "Schedule quarterly review",
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    priority: "medium",
    status: "in-progress",
    client: { name: "Jane Smith" }
  },
  {
    id: "3",
    title: "Update client information",
    dueDate: new Date(new Date().setDate(new Date().getDate())),
    priority: "low",
    status: "todo",
    client: { name: "Bob Johnson" }
  }
];

const LeftCalendarSidebar = ({ isOpen }: LeftCalendarSidebarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [tasks, setTasks] = useState<any[]>(mockTasks);
  const [jobsForSelectedDate, setJobsForSelectedDate] = useState<Job[]>([]);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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
    <aside className="fixed top-0 left-0 z-30 h-screen w-80 flex flex-col bg-card text-card-foreground border-r border-border shadow-lg transition-all duration-300 ease-in-out ml-16">
      <SidebarHeader 
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <div className="flex-1 py-6 px-4 overflow-auto">
        <CalendarWidget 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
          jobs={jobs}
          tasks={tasks}
          currentMonth={currentMonth}
        />
        <DaySummary 
          selectedDate={selectedDate}
          jobsForSelectedDate={jobsForSelectedDate}
          tasksForSelectedDate={tasksForSelectedDate}
          onPreviousDay={() => {
            const prevDay = new Date(selectedDate);
            prevDay.setDate(prevDay.getDate() - 1);
            setSelectedDate(prevDay);
          }}
          onNextDay={() => {
            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            setSelectedDate(nextDay);
          }}
        />
      </div>
    </aside>
  );
};

interface SidebarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const SidebarHeader = ({ currentMonth, onPrevMonth, onNextMonth }: SidebarHeaderProps) => (
  <div className="h-16 flex items-center px-6 border-b border-border justify-between">
    <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
      <CalendarIcon size={18} />
      <span>Calendar</span>
    </h2>
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={onPrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium">
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <Button variant="ghost" size="sm" onClick={onNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

interface CalendarWidgetProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  jobs: Job[];
  tasks: any[];
  currentMonth: Date;
}

const CalendarWidget = ({ selectedDate, setSelectedDate, jobs, tasks, currentMonth }: CalendarWidgetProps) => {
  const getDayColor = (day: Date) => {
    const dayJobs = jobs.filter(job => isSameDay(job.date, day));
    const dayTasks = tasks.filter(task => isSameDay(task.dueDate, day));
    
    if (!dayJobs.length && !dayTasks.length) return "";
    
    if (dayTasks.some(task => task.priority === "high") || 
        dayJobs.some(job => job.status === "in_progress")) {
      return "bg-yellow-100 text-yellow-800";
    } else if (dayJobs.some(job => job.status === "scheduled")) {
      return "bg-blue-100 text-blue-800";
    } else if (dayTasks.length > 0 || dayJobs.length > 0) {
      return "bg-green-100 text-green-800";
    }
    
    return "";
  };

  return (
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
          Day: ({ date, displayMonth, ...props }: DayProps) => {
            const isSelected = isSameDay(date, selectedDate);
            const isOutsideMonth = date.getMonth() !== displayMonth.getMonth();
            const dayColor = getDayColor(date);
            
            const jobsCount = jobs.filter(job => isSameDay(job.date, date)).length;
            const tasksCount = tasks.filter(task => isSameDay(task.dueDate, date)).length;
            const hasEvents = jobsCount > 0 || tasksCount > 0;
            
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
  );
};

interface DaySummaryProps {
  selectedDate: Date;
  jobsForSelectedDate: Job[];
  tasksForSelectedDate: any[];
  onPreviousDay: () => void;
  onNextDay: () => void;
}

const DaySummary = ({ 
  selectedDate, 
  jobsForSelectedDate, 
  tasksForSelectedDate,
  onPreviousDay,
  onNextDay
}: DaySummaryProps) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500 hover:bg-blue-600";
      case "in_progress":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600";
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "low":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreviousDay}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-medium">
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </h3>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNextDay}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Jobs Section */}
      <div className="space-y-3">
        <h3 className="font-medium flex items-center gap-2">
          <BriefcaseIcon className="h-4 w-4" />
          Jobs ({jobsForSelectedDate.length})
        </h3>
        
        {jobsForSelectedDate.length === 0 ? (
          <p className="text-sm text-muted-foreground">No jobs scheduled for this day.</p>
        ) : (
          <div className="space-y-2">
            {jobsForSelectedDate.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardHeader className="p-3 pb-1">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-md">{job.title}</CardTitle>
                    <Badge className={getStatusBadgeColor(job.status)}>
                      {job.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Client:</span>
                      <span className="font-medium">{job.clientName}</span>
                    </div>
                    {job.technicianName && (
                      <div className="flex justify-between mt-1">
                        <span className="text-muted-foreground">Technician:</span>
                        <span className="font-medium">{job.technicianName}</span>
                      </div>
                    )}
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">${job.amount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Tasks Section */}
      <div className="space-y-3">
        <h3 className="font-medium flex items-center gap-2">
          <ClipboardListIcon className="h-4 w-4" />
          Tasks ({tasksForSelectedDate.length})
        </h3>
        
        {tasksForSelectedDate.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks scheduled for this day.</p>
        ) : (
          <div className="space-y-2">
            {tasksForSelectedDate.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardHeader className="p-3 pb-1">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-md">{task.title}</CardTitle>
                    <Badge className={getPriorityBadgeColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Client:</span>
                      <span className="font-medium">{task.client.name}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">{task.status.replace('-', ' ')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftCalendarSidebar;
