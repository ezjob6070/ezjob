import { useState, useCallback } from "react";
import { DateRange } from "react-day-picker";

import { JobFiltersSection } from "@/components/jobs/JobFiltersSection";
import { AmountRange } from "@/components/jobs/AmountFilter";
import { PaymentMethod } from "@/components/jobs/JobTypes";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { JobFiltersState } from "@/components/jobs/jobHookTypes";

interface JobFiltersWrapperProps {
  initialFilters: JobFiltersState;
  onApplyFilters: (filters: JobFiltersState) => void;
  onClearFilters: () => void;
}

const JobFiltersWrapper: React.FC<JobFiltersWrapperProps> = ({ initialFilters, onApplyFilters, onClearFilters }) => {
  const { technicians, jobSources } = useGlobalState();
  const technicianNames = technicians.map(technician => ({ id: technician.id, name: technician.name }));
  const jobSourceNames = jobSources.map(source => ({ id: source.id, name: source.name }));

  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>(initialFilters.selectedTechnicians);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.selectedCategories);
  const [selectedJobSources, setSelectedJobSources] = useState<string[]>(initialFilters.selectedJobSources);
  const [date, setDate] = useState<DateRange | undefined>(initialFilters.date);
  const [amountRange, setAmountRange] = useState<AmountRange | null>(initialFilters.amountRange);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(initialFilters.paymentMethod);
  const [appliedFilters, setAppliedFilters] = useState<boolean>(initialFilters.appliedFilters);

  const handleApplyFilters = useCallback(() => {
    const filters = {
      selectedTechnicians,
      selectedCategories,
      selectedJobSources,
      date,
      amountRange,
      paymentMethod,
      appliedFilters: true
    };
    onApplyFilters(filters);
    setAppliedFilters(true);
  }, [selectedTechnicians, selectedCategories, selectedJobSources, date, amountRange, paymentMethod, onApplyFilters]);

  const handleClearFilters = useCallback(() => {
    setSelectedTechnicians([]);
    setSelectedCategories([]);
    setSelectedJobSources([]);
    setDate(undefined);
    setAmountRange(null);
    setPaymentMethod(null);
    setAppliedFilters(false);
    onClearFilters();
  }, [onClearFilters]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(item => item !== category) : [...prev, category]
    );
  };

  const handleJobSourceSelect = (jobSource: string) => {
    setSelectedJobSources(prev =>
      prev.includes(jobSource) ? prev.filter(item => item !== jobSource) : [...prev, jobSource]
    );
  };

  const selectAllContractors = () => {
    const allJobSourceIds = jobSourceNames.map(j => j.id);
    setSelectedJobSources(allJobSourceIds);
  };

  const deselectAllContractors = () => {
    setSelectedJobSources([]);
  };

  const selectAllTechnicians = () => {
    const allTechnicianIds = technicianNames.map(t => t.id);
    setSelectedTechnicians(allTechnicianIds);
  };

  const deselectAllTechnicians = () => {
    setSelectedTechnicians([]);
  };

  return (
    <JobFiltersSection
      technicianNames={technicianNames}
      selectedTechnicians={selectedTechnicians}
      setSelectedTechnicians={setSelectedTechnicians}
      jobSourceNames={jobSourceNames}
      selectedJobSources={selectedJobSources}
      setSelectedJobSources={setSelectedJobSources}
      date={date}
      setDate={setDate}
      amountRange={amountRange}
      setAmountRange={setAmountRange}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      appliedFilters={appliedFilters}
      setAppliedFilters={setAppliedFilters}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
      handleCategorySelect={handleCategorySelect}
      handleJobSourceSelect={handleJobSourceSelect}
      selectAllContractors={selectAllContractors}
      deselectAllContractors={deselectAllContractors}
      selectAllTechnicians={selectAllTechnicians}
      deselectAllTechnicians={deselectAllTechnicians}
    />
  );
};

export default JobFiltersWrapper;
