import { useState, useEffect } from "react";
import { Job } from "../jobs/JobTypes";
import { JOB_CATEGORIES, DATE_FILTERS } from "./filters/filterConstants";
import { initialTechnicians } from "@/data/technicians";
import CategoryFilter from "./filters/CategoryFilter";
import TechnicianDropdown from "./filters/TechnicianDropdown";
import DateFilterDropdown from "./filters/DateFilterDropdown";

interface JobFilterBarProps {
  onFilterChange: (jobs: Job[]) => void;
  allJobs: Job[];
}

const JobFilterBar = ({ onFilterChange, allJobs }: JobFilterBarProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedTechnician, setSelectedTechnician] = useState<string>("All Technicians");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("today"); // Today as default
  
  const technicians = [
    "All Technicians",
    ...initialTechnicians.map((tech) => tech.name),
  ];

  const applyFilters = () => {
    let filteredJobs = [...allJobs];

    // Filter by category (assuming job titles contain the category)
    if (selectedCategory !== "All Categories") {
      filteredJobs = filteredJobs.filter((job) => 
        job.title?.toLowerCase().includes(selectedCategory.toLowerCase())
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
  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedTechnician, selectedDateFilter]);

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="flex items-center gap-2">
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          categories={JOB_CATEGORIES} 
          onCategoryChange={setSelectedCategory} 
        />

        <TechnicianDropdown 
          selectedTechnician={selectedTechnician} 
          technicians={technicians} 
          onTechnicianChange={setSelectedTechnician} 
        />

        <DateFilterDropdown 
          selectedDateFilter={selectedDateFilter} 
          dateFilters={DATE_FILTERS} 
          onDateFilterChange={setSelectedDateFilter} 
        />
      </div>
    </div>
  );
};

export default JobFilterBar;
