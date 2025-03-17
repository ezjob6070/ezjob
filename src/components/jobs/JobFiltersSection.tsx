
import React from "react";
import { DateRange } from "react-day-picker";
import { AmountRange } from "./AmountFilter";
import { PaymentMethod } from "./JobTypes";
import TechnicianFilter from "./filters/TechnicianFilter";
import CategoryFilter from "./filters/CategoryFilter";
import AmountFilter from "./AmountFilter";
import PaymentMethodFilter from "./PaymentMethodFilter";
import JobSourceFilter from "./JobSourceFilter";
import FilterHeader from "./filters/FilterHeader";
import FilterActions from "./filters/FilterActions";

interface JobFiltersSectionProps {
  technicianNames: string[];
  selectedTechnicians: string[];
  selectedCategories: string[];
  date?: DateRange | undefined;
  amountRange: AmountRange | null;
  paymentMethod: PaymentMethod | null;
  categories: string[];
  appliedFilters: boolean;
  toggleTechnician: (techName: string) => void;
  toggleCategory: (category: string) => void;
  setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
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
}

const JobFiltersSection: React.FC<JobFiltersSectionProps> = ({
  technicianNames,
  selectedTechnicians,
  selectedCategories,
  amountRange,
  paymentMethod,
  categories,
  toggleTechnician,
  toggleCategory,
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
  appliedFilters
}: JobFiltersSectionProps) => {
  
  // Return the components directly as React elements
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
          
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategories}
            toggleCategory={toggleCategory}
            addCategory={addCategory}
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
