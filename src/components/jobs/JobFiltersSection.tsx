
import { DateRange } from "react-day-picker";
import { AmountRange } from "./AmountFilter";
import { PaymentMethod } from "./JobTypes";
import FilterContent from "@/components/finance/technician-filters/FilterContent";
import AmountFilter from "./AmountFilter";
import PaymentMethodFilter from "./PaymentMethodFilter";
import DateRangeFilter from "@/components/finance/technician-filters/DateRangeFilter";
import JobSourceFilter from "./JobSourceFilter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FilterIcon, DollarSign, Calendar, Users, TagIcon } from "lucide-react";

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
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          <span>Technicians</span>
          {selectedTechnicians.length > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
              {selectedTechnicians.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <FilterContent
          technicianNames={technicianNames}
          selectedTechnicians={selectedTechnicians}
          toggleTechnician={toggleTechnician}
          date={date}
          setDate={setDate}
          selectAllTechnicians={selectAllTechnicians}
          deselectAllTechnicians={deselectAllTechnicians}
        />
      </PopoverContent>
    </Popover>
  );

  const dateRangeComponent = (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>Date</span>
          {date && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
              ✓
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DateRangeFilter date={date} setDate={setDate} compact={true} />
      </PopoverContent>
    </Popover>
  );

  const amountFilterComponent = (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-1.5">
          <DollarSign className="h-4 w-4" />
          <span>Amount</span>
          {amountRange && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
              ✓
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <AmountFilter value={amountRange} onChange={setAmountRange} />
      </PopoverContent>
    </Popover>
  );

  const paymentMethodComponent = (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-1.5">
          <FilterIcon className="h-4 w-4" />
          <span>Payment</span>
          {paymentMethod && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
              ✓
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <PaymentMethodFilter value={paymentMethod} onChange={setPaymentMethod} />
      </PopoverContent>
    </Popover>
  );

  const jobSourceComponent = (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-1.5">
          <TagIcon className="h-4 w-4" />
          <span>Sources</span>
          {selectedJobSources.length > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
              {selectedJobSources.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <JobSourceFilter
          jobSourceNames={jobSourceNames}
          selectedJobSources={selectedJobSources}
          toggleJobSource={toggleJobSource}
          selectAllJobSources={selectAllJobSources}
          deselectAllJobSources={deselectAllJobSources}
        />
      </PopoverContent>
    </Popover>
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
