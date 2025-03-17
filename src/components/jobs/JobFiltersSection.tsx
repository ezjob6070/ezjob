
import React from "react";
import { DateRange } from "react-day-picker";
import { AmountRange } from "./AmountFilter";
import { PaymentMethod } from "./JobTypes";
import TechnicianFilter from "./filters/TechnicianFilter";
import CategoryFilter from "./filters/CategoryFilter";
import AmountFilter from "./AmountFilter";
import PaymentMethodFilter from "./PaymentMethodFilter";
import JobSourceFilter from "./JobSourceFilter";

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

const JobFiltersSection = ({
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
}: JobFiltersSectionProps) => {
  
  const filtersComponent = (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Filter Jobs</h3>
        <div className="space-y-4">
          <TechnicianFilter
            technicians={technicianNames}
            selectedNames={selectedTechnicians}
            onToggle={toggleTechnician}
            onSelectAll={selectAllTechnicians}
            onDeselectAll={deselectAllTechnicians}
            appliedFilters={appliedFilters}
          />
          
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategories}
            toggleCategory={toggleCategory}
            addCategory={addCategory}
          />
          
          <JobSourceFilter
            sources={jobSourceNames}
            selectedSources={selectedJobSources}
            onToggleSource={toggleJobSource}
            onSelectAll={selectAllJobSources}
            onDeselectAll={deselectAllJobSources}
            appliedFilters={appliedFilters}
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <button 
          className="text-sm text-muted-foreground hover:text-primary"
          onClick={clearFilters}
        >
          Clear filters
        </button>
        <button 
          className="text-sm font-medium text-primary hover:underline"
          onClick={applyFilters}
        >
          Apply filters
        </button>
      </div>
    </div>
  );
  
  const amountFilterComponent = (
    <AmountFilter 
      value={amountRange}
      onChange={setAmountRange}
    />
  );
  
  const paymentMethodComponent = (
    <PaymentMethodFilter 
      value={paymentMethod}
      onChange={setPaymentMethod}
    />
  );
  
  const jobSourceComponent = (
    <JobSourceFilter
      sources={jobSourceNames}
      selectedSources={selectedJobSources}
      onToggleSource={toggleJobSource}
      onSelectAll={selectAllJobSources}
      onDeselectAll={deselectAllJobSources}
      appliedFilters={appliedFilters}
    />
  );
  
  return {
    filtersComponent,
    dateRangeComponent: null,
    amountFilterComponent,
    paymentMethodComponent,
    jobSourceComponent
  };
};

export default JobFiltersSection;
