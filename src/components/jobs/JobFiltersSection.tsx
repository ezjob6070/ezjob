
import { useState } from "react";
import { DateRange } from "react-day-picker";
import CategoryFilter from "@/components/finance/technician-filters/CategoryFilter";
import CompactTechnicianFilter from "@/components/finance/technician-filters/CompactTechnicianFilter";
import DateRangeFilter from "@/components/finance/technician-filters/DateRangeFilter";
import AmountFilter, { AmountRange } from "@/components/jobs/AmountFilter";
import PaymentMethodFilter from "@/components/jobs/PaymentMethodFilter";
import { PaymentMethod } from "@/components/jobs/JobTypes";

interface JobFiltersSectionProps {
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
  applyFilters
}: JobFiltersSectionProps) => {
  
  const renderFiltersComponent = () => {
    return (
      <>
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
      </>
    );
  };

  return {
    filtersComponent: renderFiltersComponent(),
    dateRangeComponent: <DateRangeFilter date={date} setDate={setDate} compact />,
    amountFilterComponent: <AmountFilter selectedRange={amountRange} onRangeChange={setAmountRange} />,
    paymentMethodComponent: <PaymentMethodFilter selectedMethod={paymentMethod} onMethodChange={setPaymentMethod} />
  };
};

export default JobFiltersSection;
