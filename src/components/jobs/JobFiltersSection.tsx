
import { DateRange } from "react-day-picker";
import { AmountRange } from "./AmountFilter";
import { PaymentMethod } from "./JobTypes";
import FilterContent from "@/components/finance/technician-filters/FilterContent";
import AmountFilter from "./AmountFilter";
import PaymentMethodFilter from "./PaymentMethodFilter";
import DateRangeFilter from "@/components/finance/technician-filters/DateRangeFilter";
import JobSourceFilter from "./JobSourceFilter";

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
  jobSourceNames?: string[];
  selectedJobSources?: string[];
  toggleJobSource?: (sourceName: string) => void;
  selectAllJobSources?: () => void;
  deselectAllJobSources?: () => void;
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
  jobSourceNames = [],
  selectedJobSources = [],
  toggleJobSource = () => {},
  selectAllJobSources = () => {},
  deselectAllJobSources = () => {}
}: JobFiltersSectionProps) => {
  // Create components
  const filtersComponent = (
    <FilterContent
      technicianNames={technicianNames}
      selectedTechnicians={selectedTechnicians}
      toggleTechnician={toggleTechnician}
      date={date}
      setDate={setDate}
      selectAllTechnicians={selectAllTechnicians}
      deselectAllTechnicians={deselectAllTechnicians}
    />
  );

  const dateRangeComponent = (
    <DateRangeFilter date={date} setDate={setDate} compact={true} />
  );

  const amountFilterComponent = (
    <AmountFilter value={amountRange} onChange={setAmountRange} />
  );

  const paymentMethodComponent = (
    <PaymentMethodFilter value={paymentMethod} onChange={setPaymentMethod} />
  );

  const jobSourceComponent = (
    <JobSourceFilter
      jobSourceNames={jobSourceNames}
      selectedJobSources={selectedJobSources}
      toggleJobSource={toggleJobSource}
      selectAllJobSources={selectAllJobSources}
      deselectAllJobSources={deselectAllJobSources}
    />
  );

  return {
    filtersComponent,
    dateRangeComponent,
    amountFilterComponent,
    paymentMethodComponent,
    jobSourceComponent
  };
};

export default JobFiltersSection;
