
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
  date: DateRange | undefined;
  amountRange: AmountRange | null;
  paymentMethod: PaymentMethod | null;
  appliedFilters: boolean;
  toggleTechnician: (techName: string) => void;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  setAmountRange: React.Dispatch<React.SetStateAction<AmountRange | null>>;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | null>>;
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
  // New contractor filter props
  contractorNames: string[];
  selectedContractors: string[];
  toggleContractor: (contractorName: string) => void;
  selectAllContractors: () => void;
  deselectAllContractors: () => void;
  selectAllTechnicians: () => void;
  deselectAllTechnicians: () => void;
}

const JobFiltersWrapper: React.FC<JobFiltersWrapperProps> = ({
  technicianNames,
  selectedTechnicians,
  date,
  amountRange,
  paymentMethod,
  appliedFilters,
  toggleTechnician,
  setDate,
  setAmountRange,
  setPaymentMethod,
  clearFilters,
  applyFilters,
  jobSourceNames,
  selectedJobSources,
  toggleJobSource,
  selectAllJobSources,
  deselectAllJobSources,
  hasActiveFilters,
  filteredJobsCount,
  totalJobsCount,
  // New contractor props
  contractorNames,
  selectedContractors,
  toggleContractor,
  selectAllContractors,
  deselectAllContractors,
  selectAllTechnicians,
  deselectAllTechnicians
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
        date={date}
        amountRange={amountRange}
        paymentMethod={paymentMethod}
        appliedFilters={appliedFilters}
        toggleTechnician={toggleTechnician}
        setDate={setDate}
        setAmountRange={setAmountRange}
        setPaymentMethod={setPaymentMethod}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
        jobSourceNames={jobSourceNames}
        selectedJobSources={selectedJobSources}
        toggleJobSource={toggleJobSource}
        selectAllJobSources={selectAllJobSources}
        deselectAllJobSources={deselectAllJobSources}
        contractorNames={contractorNames}
        selectedContractors={selectedContractors}
        toggleContractor={toggleContractor}
        selectAllContractors={selectAllContractors}
        deselectAllContractors={deselectAllContractors}
        selectAllTechnicians={selectAllTechnicians}
        deselectAllTechnicians={deselectAllTechnicians}
      />
    </>
  );
};

export default JobFiltersWrapper;
