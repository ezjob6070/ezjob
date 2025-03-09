
import { useState } from "react";
import { Filter, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Job } from "../jobs/JobTypes";
import { initialTechnicians } from "@/data/technicians";

interface JobFilterBarProps {
  onFilterChange: (jobs: Job[]) => void;
  allJobs: Job[];
}

const JOB_CATEGORIES = [
  "All Categories",
  "Plumbing",
  "HVAC",
  "Electrical",
  "General Maintenance",
];

const DATE_FILTERS = [
  { label: "All Dates", value: "all" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "this_week" },
  { label: "Next Week", value: "next_week" },
  { label: "This Month", value: "this_month" },
  { label: "Next Month", value: "next_month" },
];

const JobFilterBar = ({ onFilterChange, allJobs }: JobFilterBarProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedTechnician, setSelectedTechnician] = useState<string>("All Technicians");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("all");

  const technicians = [
    "All Technicians",
    ...initialTechnicians.map((tech) => tech.name),
  ];

  const applyFilters = () => {
    let filteredJobs = [...allJobs];

    // Filter by category (assuming job titles contain the category)
    if (selectedCategory !== "All Categories") {
      filteredJobs = filteredJobs.filter((job) => 
        job.title.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by technician
    if (selectedTechnician !== "All Technicians") {
      filteredJobs = filteredJobs.filter(
        (job) => job.technicianName === selectedTechnician
      );
    }

    // Filter by date range
    if (selectedDateFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay()); // Start of this week (Sunday)
      
      const nextWeekStart = new Date(thisWeekStart);
      nextWeekStart.setDate(thisWeekStart.getDate() + 7); // Start of next week
      
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 6); // End of next week
      
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      
      switch (selectedDateFilter) {
        case "today":
          filteredJobs = filteredJobs.filter((job) => {
            const jobDate = new Date(job.date);
            return (
              jobDate.getDate() === today.getDate() &&
              jobDate.getMonth() === today.getMonth() &&
              jobDate.getFullYear() === today.getFullYear()
            );
          });
          break;
        case "this_week":
          filteredJobs = filteredJobs.filter((job) => {
            const jobDate = new Date(job.date);
            return jobDate >= thisWeekStart && jobDate < nextWeekStart;
          });
          break;
        case "next_week":
          filteredJobs = filteredJobs.filter((job) => {
            const jobDate = new Date(job.date);
            return jobDate >= nextWeekStart && jobDate <= nextWeekEnd;
          });
          break;
        case "this_month":
          filteredJobs = filteredJobs.filter((job) => {
            const jobDate = new Date(job.date);
            return jobDate >= thisMonthStart && jobDate < nextMonthStart;
          });
          break;
        case "next_month":
          filteredJobs = filteredJobs.filter((job) => {
            const jobDate = new Date(job.date);
            return jobDate >= nextMonthStart && jobDate <= nextMonthEnd;
          });
          break;
      }
    }

    onFilterChange(filteredJobs);
  };

  // Apply filters whenever any filter changes
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setTimeout(applyFilters, 0);
  };

  const handleTechnicianChange = (value: string) => {
    setSelectedTechnician(value);
    setTimeout(applyFilters, 0);
  };

  const handleDateFilterChange = (value: string) => {
    setSelectedDateFilter(value);
    setTimeout(applyFilters, 0);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="flex items-center gap-2">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {JOB_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTechnician} onValueChange={handleTechnicianChange}>
          <SelectTrigger className="w-[180px]">
            <Users className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Technician" />
          </SelectTrigger>
          <SelectContent>
            {technicians.map((tech) => (
              <SelectItem key={tech} value={tech}>
                {tech}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {DATE_FILTERS.find(f => f.value === selectedDateFilter)?.label || "All Dates"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {DATE_FILTERS.map((filter) => (
              <DropdownMenuItem 
                key={filter.value}
                onClick={() => handleDateFilterChange(filter.value)}
                className={selectedDateFilter === filter.value ? "bg-accent" : ""}
              >
                {filter.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default JobFilterBar;
