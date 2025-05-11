
import { format, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Job } from "@/components/jobs/JobTypes";
import { useState, useEffect } from "react";
import JobFilterBar from "@/components/jobs/JobFilterBar";

interface JobsListProps {
  selectedDate: Date;
  jobsForSelectedDate: Job[];
  onPreviousDay: () => void;
  onNextDay: () => void;
  allJobs: Job[];
}

const JobsList = ({ 
  selectedDate, 
  jobsForSelectedDate: initialJobsForSelectedDate, 
  onPreviousDay, 
  onNextDay,
  allJobs
}: JobsListProps) => {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobsForSelectedDate);

  // Update filtered jobs when selected date changes
  useEffect(() => {
    setFilteredJobs(initialJobsForSelectedDate);
  }, [initialJobsForSelectedDate]);

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

  const handleFilterChange = (jobs: Job[]) => {
    // Filter jobs for the selected date
    const jobsForDate = jobs.filter(job => isSameDay(job.date, selectedDate));
    setFilteredJobs(jobsForDate);
  };

  return (
    <div className="mb-6">
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
      
      <JobFilterBar onFilterChange={handleFilterChange} allJobs={allJobs} />
      
      <div className="space-y-4">
        <h3 className="font-medium">
          Jobs ({filteredJobs.length})
        </h3>
        
        {filteredJobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No jobs scheduled for this day.</p>
        ) : (
          filteredJobs.map((job) => (
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
  );
};

export default JobsList;
