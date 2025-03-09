
import { useState } from "react";
import { initialJobs } from "@/data/jobs";
import { initialTechnicians } from "@/data/technicians";
import { useJobsData } from "@/hooks/useJobsData";
import JobTabs from "@/components/jobs/JobTabs";
import JobStats from "@/components/jobs/JobStats";
import JobFiltersSection from "@/components/jobs/JobFiltersSection";
import JobFilterInfoBar from "@/components/jobs/JobFilterInfoBar";
import JobsPageHeader from "@/components/jobs/JobsPageHeader";

const JOB_CATEGORIES = [
  "Plumbing",
  "HVAC",
  "Electrical", 
  "General Maintenance",
];

const Jobs = () => {
  const {
    filteredJobs,
    searchTerm,
    setSearchTerm,
    selectedTechnicians,
    selectedCategories,
    date,
    amountRange,
    paymentMethod,
    appliedFilters,
    hasActiveFilters,
    toggleTechnician,
    toggleCategory,
    setDate,
    setAmountRange,
    setPaymentMethod,
    selectAllTechnicians,
    deselectAllTechnicians,
    clearFilters,
    applyFilters,
    handleCancelJob
  } = useJobsData(initialJobs);

  const [categories, setCategories] = useState<string[]>(JOB_CATEGORIES);
  const technicianNames = initialTechnicians.map(tech => tech.name);

  const addCategory = (category: string) => {
    setCategories(prev => [...prev, category]);
  };

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
        totalCount={initialJobs.length}
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
