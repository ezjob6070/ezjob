
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, SearchIcon, CalendarIcon, UserIcon, FilterIcon, XIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Job, JobStatus } from "@/pages/Jobs";
import { format, subDays, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type JobsTableProps = {
  jobs: Job[];
  formatCurrency: (amount: number) => string;
  technicians: { id: string; name: string }[];
  onCancelJob: (jobId: string) => void;
};

type DateFilterType = "all" | "today" | "week" | "month" | "custom";

const JobsTable = ({ jobs, formatCurrency, technicians, onCancelJob }: JobsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [technicianFilter, setTechnicianFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("all");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [showFilters, setShowFilters] = useState(false);
  const [jobToCancel, setJobToCancel] = useState<string | null>(null);
  
  const filteredJobs = jobs.filter((job) => {
    // Search filter
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.technicianName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Technician filter
    const matchesTechnician = technicianFilter === "" || job.technicianId === technicianFilter;
    
    // Date filter
    let matchesDate = true;
    const jobDate = new Date(job.scheduledDate);
    
    switch(dateFilter) {
      case "today":
        matchesDate = format(jobDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
        break;
      case "week":
        const weekStart = startOfWeek(new Date());
        const weekEnd = endOfWeek(new Date());
        matchesDate = isWithinInterval(jobDate, { start: weekStart, end: weekEnd });
        break;
      case "month":
        const monthStart = startOfMonth(new Date());
        const monthEnd = endOfMonth(new Date());
        matchesDate = isWithinInterval(jobDate, { start: monthStart, end: monthEnd });
        break;
      case "custom":
        if (customDateRange.from && customDateRange.to) {
          matchesDate = isWithinInterval(jobDate, { 
            start: customDateRange.from, 
            end: customDateRange.to 
          });
        }
        break;
      default:
        matchesDate = true;
    }
    
    return matchesSearch && matchesTechnician && matchesDate;
  });

  const statusColors = {
    "scheduled": "bg-blue-100 text-blue-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    "completed": "bg-green-100 text-green-800",
    "cancelled": "bg-red-100 text-red-800",
  };

  const handleCancelConfirm = () => {
    if (jobToCancel) {
      onCancelJob(jobToCancel);
      setJobToCancel(null);
      toast({
        title: "Job Cancelled",
        description: "The job has been successfully cancelled",
      });
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setTechnicianFilter("");
    setDateFilter("all");
    setCustomDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <FilterIcon className="h-4 w-4" />
          Filters
        </Button>
        <Button variant="outline">Export</Button>
      </div>
      
      {showFilters && (
        <div className="p-4 border rounded-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Technician</label>
              <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Technicians" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Technicians</SelectItem>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as DateFilterType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {dateFilter === "custom" && (
              <div>
                <label className="text-sm font-medium mb-1 block">Custom Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateRange.from && customDateRange.to ? (
                        `${format(customDateRange.from, "MMM d, yyyy")} - ${format(customDateRange.to, "MMM d, yyyy")}`
                      ) : (
                        "Select date range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={customDateRange}
                      onSelect={setCustomDateRange as any}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={resetFilters} className="gap-2">
              <XIcon className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.clientName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserIcon className="h-3.5 w-3.5" />
                      </div>
                      {job.technicianName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      {format(new Date(job.scheduledDate), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(job.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[job.status]}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Job</DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {job.status !== "cancelled" && (
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => setJobToCancel(job.id)}
                          >
                            Cancel Job
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  No jobs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={!!jobToCancel} onOpenChange={() => setJobToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this job? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm} className="bg-red-600 hover:bg-red-700">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobsTable;
