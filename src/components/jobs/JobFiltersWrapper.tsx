
import React from 'react';
import { DateRange } from "react-day-picker";
import { AmountRange } from "./AmountFilter";
import { PaymentMethod } from "./JobTypes";
import JobFiltersSection from "./JobFiltersSection";
import JobsDateFilter from "./filters/JobsDateFilter";

interface JobFiltersWrapperProps {
  technicianNames: string[];
  selectedTechnicians: string[];
  selectedCategories: string[];
  date: DateRange | undefined;
  amountRange: AmountRange | null;
  paymentMethod: PaymentMethod | null;
  categories: string[];
  appliedFilters: boolean;
  toggleTechnician: (techName: string) => void;
  toggleCategory: (category: string) => void;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  setAmountRange: React.Dispatch<React.SetStateAction<AmountRange | null>>;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | null>>;
  addCategory: (category: string) => void;
  selectAllTechnicians: () => void;
  deselectAllTechnicians: () => void;
  clearFilters: () => void;
  applyFilters: () => void;
  jobSourceNames: string[];
  selectedJobSources: string[];
  toggleJobSource: (sourceName: string) => void;
  selectAllJobSources: () => void;
  deselectAllJobSources: () => void;
  hasActiveFilters: boolean;
  filteredJobsCount: number;
  totalJobsCount: number;
}

const JobFiltersWrapper: React.FC<JobFiltersWrapperProps> = ({
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
  applyFilters,
  jobSourceNames,
  selectedJobSources,
  toggleJobSource,
  selectAllJobSources,
  deselectAllJobSources,
  hasActiveFilters,
  filteredJobsCount,
  totalJobsCount
}) => {
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
    applyFilters,
    jobSourceNames,
    selectedJobSources,
    toggleJobSource,
    selectAllJobSources,
    deselectAllJobSources
  });

  return (
    <>
      <div className="flex justify-end mb-4">
        <JobsDateFilter date={date} setDate={setDate} />
      </div>
      
      {hasActiveFilters && (
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredJobsCount} of {totalJobsCount} jobs
          </p>
          <button 
            onClick={clearFilters}
            className="text-sm text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
      
      {filterComponents}
    </>
  );
};

export default JobFiltersWrapper;
