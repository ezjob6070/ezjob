
import React from 'react';
import { DateRange } from "react-day-picker";
import { AmountRange } from "./AmountFilter";
import { PaymentMethod } from "./JobTypes";
import JobFiltersSection from "./JobFiltersSection";
import JobsDateFilter from "./filters/JobsDateFilter";
import JobFilterInfoBar from "./JobFilterInfoBar";

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
  return (
    <>
      <div className="flex justify-end mb-4">
        <JobsDateFilter date={date} setDate={setDate} />
      </div>
      
      <JobFilterInfoBar
        filteredCount={filteredJobsCount}
        totalCount={totalJobsCount}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
      />
      
      <JobFiltersSection 
        technicianNames={technicianNames}
        selectedTechnicians={selectedTechnicians}
        selectedCategories={selectedCategories}
        date={date}
        amountRange={amountRange}
        paymentMethod={paymentMethod}
        categories={categories}
        appliedFilters={appliedFilters}
        toggleTechnician={toggleTechnician}
        toggleCategory={toggleCategory}
        setDate={setDate}
        setAmountRange={setAmountRange}
        setPaymentMethod={setPaymentMethod}
        addCategory={addCategory}
        selectAllTechnicians={selectAllTechnicians}
        deselectAllTechnicians={deselectAllTechnicians}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
        jobSourceNames={jobSourceNames}
        selectedJobSources={selectedJobSources}
        toggleJobSource={toggleJobSource}
        selectAllJobSources={selectAllJobSources}
        deselectAllJobSources={deselectAllJobSources}
      />
    </>
  );
};

export default JobFiltersWrapper;
