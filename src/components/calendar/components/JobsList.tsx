
import { format, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Update filtered jobs when selected date changes
  useEffect(() => {
    setFilteredJobs(initialJobsForSelectedDate);
  }, [initialJobsForSelectedDate]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500 hover:bg-blue-600";
      case "in_progress":
      case "in-progress":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const handleFilter = () => {
    // Filter jobs based on search term and status
    let jobs = initialJobsForSelectedDate;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(term) || 
        (job.clientName || job.client?.name || '').toLowerCase().includes(term) ||
        (job.technicianName || job.technician?.name || '').toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== "all") {
      jobs = jobs.filter(job => job.status === statusFilter);
    }
    
    setFilteredJobs(jobs);
  };

  // Effect for filtering whenever search term or status filter changes
  useEffect(() => {
    handleFilter();
  }, [searchTerm, statusFilter, initialJobsForSelectedDate]);

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreviousDay}
          className="h-8 w-8 p-0"
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
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex gap-2 mb-4">
        <Input 
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9"
        />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Job Status</h4>
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">
            Jobs ({filteredJobs.length})
          </h3>
        </div>
        
        {filteredJobs.length === 0 ? (
          <div className="text-sm text-muted-foreground p-4 text-center bg-muted/50 rounded-lg">
            No jobs scheduled for this day.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="overflow-hidden shadow-sm border-muted">
                <CardHeader className="p-3 pb-0">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{job.title}</CardTitle>
                    <Badge className={getStatusBadgeColor(job.status)}>
                      {job.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Client:</span>
                      <span className="font-medium text-foreground">{job.clientName || job.client?.name}</span>
                    </div>
                    {(job.technicianName || job.technician?.name) && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Technician:</span>
                        <span className="font-medium text-foreground">{job.technicianName || job.technician?.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>Amount:</span>
                      <span className="font-medium text-foreground">${job.amount}</span>
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

export default JobsList;
