
import { format, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Update filtered jobs when selected date changes
  useEffect(() => {
    setFilteredJobs(initialJobsForSelectedDate);
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  // Effect for filtering whenever search term or status filter changes
  useEffect(() => {
    handleFilter();
  }, [searchTerm, statusFilter, initialJobsForSelectedDate]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  return (
    <div className="mb-6 animate-fade-in">
      <h3 className="text-lg font-medium text-center mb-4">
        {format(selectedDate, "EEEE, MMMM d, yyyy")}
      </h3>
      
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
            {currentJobs.map((job) => (
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
            
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.max(1, prev - 1));
                        }} 
                      />
                    </PaginationItem>
                  )}
                  
                  {currentPage > 2 && (
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(1);
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {currentPage > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage - 1);
                        }}
                      >
                        {currentPage - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationLink 
                      href="#" 
                      isActive
                    >
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage + 1);
                        }}
                      >
                        {currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(totalPages);
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.min(totalPages, prev + 1));
                        }} 
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList;
