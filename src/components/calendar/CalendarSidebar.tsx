import { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Job } from "@/components/jobs/JobTypes";
import { initialJobs } from "@/data/jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayProps } from "react-day-picker";

interface CalendarSidebarProps {
  isOpen: boolean;
}

const CalendarSidebar = ({ isOpen }: CalendarSidebarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [jobsForSelectedDate, setJobsForSelectedDate] = useState<Job[]>([]);

  useEffect(() => {
    const filtered = jobs.filter(job => 
      isSameDay(job.date, selectedDate)
    );
    setJobsForSelectedDate(filtered);
  }, [selectedDate, jobs]);

  const getDayColor = (day: Date) => {
    const dayJobs = jobs.filter(job => isSameDay(job.date, day));
    
    if (!dayJobs.length) return "";
    
    if (dayJobs.some(job => job.status === "scheduled")) {
      return "bg-blue-100 text-blue-800";
    } else if (dayJobs.some(job => job.status === "in_progress")) {
      return "bg-yellow-100 text-yellow-800";
    } else if (dayJobs.some(job => job.status === "completed")) {
      return "bg-green-100 text-green-800";
    } else if (dayJobs.some(job => job.status === "cancelled")) {
      return "bg-red-100 text-red-800";
    }
    
    return "";
  };

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

  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed top-0 right-0 z-20 h-screen w-80 flex flex-col bg-card text-card-foreground border-l border-border shadow-lg transition-all duration-300 ease-in-out">
      <div className="h-16 flex items-center px-6 border-b border-border justify-between">
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <CalendarIcon size={18} />
          <span>Calendar</span>
        </h2>
      </div>

      <div className="flex-1 py-6 px-4 overflow-auto">
        <div className="mb-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className={cn("p-3 pointer-events-auto border rounded-md")}
            modifiers={{
              hasJobs: (date) => jobs.some(job => isSameDay(job.date, date)),
            }}
            modifiersClassNames={{
              hasJobs: "font-bold",
            }}
            components={{
              Day: (props: DayProps) => {
                const date = props.date;
                const isSelected = props.selected;
                const isOutsideMonth = date.getMonth() !== props.displayMonth.getMonth();
                const dayColor = getDayColor(date);
                
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
                    {jobs.some(job => isSameDay(job.date, date)) && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></div>
                    )}
                  </button>
                );
              }
            }}
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePreviousDay}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h3 className="text-lg font-medium">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h3>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNextDay}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">
              Jobs ({jobsForSelectedDate.length})
            </h3>
            
            {jobsForSelectedDate.length === 0 ? (
              <p className="text-sm text-muted-foreground">No jobs scheduled for this day.</p>
            ) : (
              jobsForSelectedDate.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-md">{job.title}</CardTitle>
                      <Badge className={getStatusBadgeColor(job.status)}>
                        {job.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
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
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CalendarSidebar;
