
import { useState, useEffect } from "react";
import { Job, PaymentMethod } from "@/components/jobs/JobTypes";
import JobTabs from "@/components/jobs/JobTabs";
import JobStats from "@/components/jobs/JobStats";
import { initialJobs } from "@/data/jobs";
import { initialTechnicians } from "@/data/technicians";
import { DateRange } from "react-day-picker";
import { addDays, isSameDay, isWithinInterval, startOfDay } from "date-fns";
import JobFiltersSection from "@/components/jobs/JobFiltersSection";
import JobFilterInfoBar from "@/components/jobs/JobFilterInfoBar";
import JobsPageHeader from "@/components/jobs/JobsPageHeader";
import { AmountRange } from "@/components/jobs/AmountFilter";

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
  const [amountRange, setAmountRange] = useState<AmountRange | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [categories, setCategories] = useState<string[]>(JOB_CATEGORIES);
  const [appliedFilters, setAppliedFilters] = useState(false);

  const technicianNames = initialTechnicians.map(tech => tech.name);

  const handleCancelJob = (jobId: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, status: "cancelled" } : job
      )
    );
  };

  useEffect(() => {
    let result = jobs;

    if (searchTerm) {
      result = result.filter(job =>
        job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (appliedFilters && selectedTechnicians.length > 0) {
      result = result.filter(job => 
        job.technicianName && selectedTechnicians.includes(job.technicianName)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(job => 
        selectedCategories.some(category => 
          job.title.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

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

    if (amountRange) {
      result = result.filter(job => {
        if (amountRange.min !== undefined && amountRange.max !== undefined) {
          return job.amount >= amountRange.min && job.amount <= amountRange.max;
        } else if (amountRange.min !== undefined) {
          return job.amount >= amountRange.min;
        } else if (amountRange.max !== undefined) {
          return job.amount <= amountRange.max;
        }
        return true;
      });
    }

    if (paymentMethod) {
      result = result.filter(job => 
        job.paymentMethod === paymentMethod
      );
    }

    setFilteredJobs(result);
  }, [jobs, searchTerm, selectedTechnicians, selectedCategories, date, amountRange, paymentMethod, appliedFilters]);

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
    setAmountRange(null);
    setPaymentMethod(null);
    setAppliedFilters(false);
  };

  const applyFilters = () => {
    setAppliedFilters(true);
  };
  
  const hasActiveFilters = appliedFilters || 
    selectedCategories.length > 0 || 
    date?.from || 
    amountRange || 
    paymentMethod;

  const filterComponents = JobFiltersSection({
    technicianNames,
    selectedTechnicians,
    selectedCategories,
    date,
    amountRange,
    paymentMethod,
    categories,
    appliedFilters,
    toggleTechnician,
    toggleCategory,
    setDate,
    setAmountRange,
    setPaymentMethod,
    addCategory,
    selectAllTechnicians,
    deselectAllTechnicians,
    clearFilters,
    applyFilters
  });

  return (
    <div className="space-y-6 py-8">
      <JobsPageHeader />

      <JobStats jobs={filteredJobs} />
      
      <JobFilterInfoBar 
        filteredCount={filteredJobs.length}
        totalCount={jobs.length}
        hasActiveFilters={Boolean(hasActiveFilters)}
        clearFilters={clearFilters}
      />
      
      <JobTabs 
        jobs={filteredJobs} 
        searchTerm={searchTerm}
        onCancelJob={handleCancelJob} 
        onSearchChange={setSearchTerm}
        filtersComponent={filterComponents.filtersComponent}
        dateRangeComponent={filterComponents.dateRangeComponent}
        amountFilterComponent={filterComponents.amountFilterComponent}
        paymentMethodComponent={filterComponents.paymentMethodComponent}
      />
    </div>
  );
};

export default Jobs;
