
import React from "react";
import { DateRange } from "react-day-picker";
import { AmountRange } from "./AmountFilter";
import { PaymentMethod } from "./JobTypes";
import TechnicianFilter from "./filters/TechnicianFilter";
import JobSourceFilter from "./JobSourceFilter";
import FilterHeader from "./filters/FilterHeader";
import FilterActions from "./filters/FilterActions";
import JobContractorFilter from "./filters/JobContractorFilter";

interface JobFiltersSectionProps {
  technicianNames: string[];
  selectedTechnicians: string[];
  date?: DateRange | undefined;
  amountRange: AmountRange | null;
  paymentMethod: PaymentMethod | null;
  appliedFilters: boolean;
  toggleTechnician: (techName: string) => void;
  setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  setAmountRange: React.Dispatch<React.SetStateAction<AmountRange | null>>;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | null>>;
  selectAllTechnicians: () => void;
  deselectAllTechnicians: () => void;
  clearFilters: () => void;
  applyFilters: () => void;
  jobSourceNames: string[];
  selectedJobSources: string[];
  toggleJobSource: (sourceName: string) => void;
  selectAllJobSources: () => void;
  deselectAllJobSources: () => void;
  // New contractor filter props
  contractorNames: string[];
  selectedContractors: string[];
  toggleContractor: (contractorName: string) => void;
  selectAllContractors: () => void;
  deselectAllContractors: () => void;
}

const JobFiltersSection: React.FC<JobFiltersSectionProps> = ({
  technicianNames,
  selectedTechnicians,
  toggleTechnician,
  selectAllTechnicians,
  deselectAllTechnicians,
  clearFilters,
  applyFilters,
  jobSourceNames,
  selectedJobSources,
  toggleJobSource,
  selectAllJobSources,
  deselectAllJobSources,
  // New contractor props
  contractorNames,
  selectedContractors,
  toggleContractor,
  selectAllContractors,
  deselectAllContractors
}) => {
  
  return (
    <div className="space-y-6">
      <div className="space-y-6 p-6">
        <FilterHeader title="Filter Jobs" />
        
        <div className="space-y-4">
          <TechnicianFilter
            technicians={technicianNames}
            selectedNames={selectedTechnicians}
            onToggle={toggleTechnician}
            onSelectAll={selectAllTechnicians}
            onDeselectAll={deselectAllTechnicians}
          />
          
          <JobContractorFilter
            contractors={contractorNames}
            selectedContractors={selectedContractors}
            toggleContractor={toggleContractor}
            selectAllContractors={selectAllContractors}
            deselectAllContractors={deselectAllContractors}
          />
          
          <JobSourceFilter
            jobSourceNames={jobSourceNames}
            selectedJobSources={selectedJobSources}
            toggleJobSource={toggleJobSource}
            selectAllJobSources={selectAllJobSources}
            deselectAllJobSources={deselectAllJobSources}
          />
        </div>
        
        <FilterActions
          clearFilters={clearFilters}
          applyFilters={applyFilters}
        />
      </div>
    </div>
  );
};

export default JobFiltersSection;
