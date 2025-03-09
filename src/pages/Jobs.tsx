import { useState, useEffect } from "react";
import { Job } from "@/components/jobs/JobTypes";
import JobTabs from "@/components/jobs/JobTabs";
import JobStats from "@/components/jobs/JobStats";
import { initialJobs } from "@/data/jobs";
import { initialTechnicians } from "@/data/technicians";
import TechnicianCheckboxList from "@/components/finance/technician-filters/TechnicianCheckboxList";
import CompactTechnicianFilter from "@/components/finance/technician-filters/CompactTechnicianFilter";
import CategoryFilter from "@/components/finance/technician-filters/CategoryFilter";
import DateRangeFilter from "@/components/finance/technician-filters/DateRangeFilter";
import { DateRange } from "react-day-picker";
import { addDays, isSameDay, isWithinInterval, startOfDay } from "date-fns";

const JOB_CATEGORIES = [
  "Plumbing",
  "HVAC",
  "Electrical",
  "General Maintenance",
];

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs);
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [categories, setCategories] = useState<string[]>(JOB_CATEGORIES);
  const [appliedFilters, setAppliedFilters] = useState(false);

  const technicianNames = initialTechnicians.map(tech => tech.name);

  // Function to handle job cancellation
  const handleCancelJob = (jobId: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, status: "cancelled" } : job
      )
    );
  };

  // Filter jobs based on search term and other filters
  useEffect(() => {
    let result = jobs;

    // Apply search term filter
    if (searchTerm) {
      result = result.filter(job =>
        job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply technician filter
    if (appliedFilters && selectedTechnicians.length > 0) {
      result = result.filter(job => 
        job.technicianName && selectedTechnicians.includes(job.technicianName)
      );
    }

    // Apply category filter (assuming job titles contain the category)
    if (selectedCategories.length > 0) {
      result = result.filter(job => 
        selectedCategories.some(category => 
          job.title.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    // Apply date range filter
    if (date?.from) {
      const fromDate = startOfDay(date.from);
      const toDate = date.to ? startOfDay(date.to) : fromDate;
      
      result = result.filter(job => {
        const jobDate = startOfDay(job.date);
        
        if (isSameDay(fromDate, toDate)) {
          return isSameDay(jobDate, fromDate);
        }
        
        return isWithinInterval(jobDate, { start: fromDate, end: toDate });
      });
    }

    setFilteredJobs(result);
  }, [jobs, searchTerm, selectedTechnicians, selectedCategories, date, appliedFilters]);

  const toggleTechnician = (techName: string) => {
    setSelectedTechnicians(prev => 
      prev.includes(techName) 
        ? prev.filter(t => t !== techName)
        : [...prev, techName]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addCategory = (category: string) => {
    setCategories(prev => [...prev, category]);
  };

  const selectAllTechnicians = () => {
    setSelectedTechnicians([...technicianNames]);
  };

  const deselectAllTechnicians = () => {
    setSelectedTechnicians([]);
  };

  const clearFilters = () => {
    setSelectedTechnicians([]);
    setSelectedCategories([]);
    setDate(undefined);
    setAppliedFilters(false);
  };

  const applyFilters = () => {
    setAppliedFilters(true);
  };

  return (
    <div className="space-y-6 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Jobs
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all jobs
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryFilter 
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            categories={categories}
            addCategory={addCategory}
          />
          
          <CompactTechnicianFilter 
            technicianNames={technicianNames}
            selectedTechnicians={selectedTechnicians}
            toggleTechnician={toggleTechnician}
            clearFilters={clearFilters}
            applyFilters={applyFilters}
            selectAllTechnicians={selectAllTechnicians}
            deselectAllTechnicians={deselectAllTechnicians}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <DateRangeFilter date={date} setDate={setDate} />
      </div>

      <JobStats jobs={filteredJobs} />
      
      {appliedFilters || selectedCategories.length > 0 || date?.from ? (
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
          <button 
            onClick={clearFilters}
            className="text-sm text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : null}
      
      <JobTabs 
        jobs={filteredJobs} 
        searchTerm={searchTerm}
        onCancelJob={handleCancelJob} 
        onSearchChange={setSearchTerm}
      />
    </div>
  );
};

export default Jobs;
