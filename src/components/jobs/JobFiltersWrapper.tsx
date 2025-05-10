import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { AmountRange, PaymentMethod } from '@/components/jobs/JobTypes';
import JobFiltersSection from '@/components/jobs/JobFiltersSection'; 

interface JobFiltersWrapperProps {
  technicianNames: string[];
  jobSourceNames: string[];
  contractorNames: string[];
  onApplyFilters: () => void;
  onClearFilters: () => void;
  selectAllTechnicians: () => void;
  deselectAllTechnicians: () => void;
  selectAllContractors: () => void;
  deselectAllContractors: () => void;
}

const JobFiltersWrapper: React.FC<JobFiltersWrapperProps> = ({
  technicianNames,
  jobSourceNames,
  contractorNames,
  onApplyFilters,
  onClearFilters,
  selectAllTechnicians,
  deselectAllTechnicians,
  selectAllContractors,
  deselectAllContractors
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [selectedJobSources, setSelectedJobSources] = useState<string[]>([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [amountRange, setAmountRange] = useState<AmountRange | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  useEffect(() => {
    setHasActiveFilters(
      searchTerm !== '' ||
      selectedTechnicians.length > 0 ||
      selectedContractors.length > 0 ||
      selectedJobSources.length > 0 ||
      selectedServiceTypes.length > 0 ||
      date !== undefined ||
      amountRange !== null ||
      paymentMethod !== null
    );
  }, [searchTerm, selectedTechnicians, selectedContractors, selectedJobSources, selectedServiceTypes, date, amountRange, paymentMethod]);

  const toggleTechnician = (technicianName: string) => {
    setSelectedTechnicians(prev =>
      prev.includes(technicianName)
        ? prev.filter(name => name !== technicianName)
        : [...prev, technicianName]
    );
  };

  const toggleContractor = (contractorName: string) => {
    setSelectedContractors(prev =>
      prev.includes(contractorName)
        ? prev.filter(name => name !== contractorName)
        : [...prev, contractorName]
    );
  };

  const toggleJobSource = (jobSourceName: string) => {
    setSelectedJobSources(prev =>
      prev.includes(jobSourceName)
        ? prev.filter(name => name !== jobSourceName)
        : [...prev, jobSourceName]
    );
  };

  const toggleServiceType = (serviceType: string) => {
    setSelectedServiceTypes(prev =>
      prev.includes(serviceType)
        ? prev.filter(type => type !== serviceType)
        : [...prev, serviceType]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTechnicians([]);
    setSelectedContractors([]);
    setSelectedJobSources([]);
    setSelectedServiceTypes([]);
    setDate(undefined);
    setAmountRange(null);
    setPaymentMethod(null);
    setAppliedFilters(false);
    onClearFilters();
  };

  const applyFilters = () => {
    setAppliedFilters(true);
    onApplyFilters();
  };

  return (
    <JobFiltersSection
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      technicianNames={technicianNames}
      selectedTechnicians={selectedTechnicians}
      toggleTechnician={toggleTechnician}
      contractorNames={contractorNames}
      selectedContractors={selectedContractors}
      toggleContractor={toggleContractor}
      jobSourceNames={jobSourceNames}
      selectedJobSources={selectedJobSources}
      toggleJobSource={toggleJobSource}
      selectedServiceTypes={selectedServiceTypes}
      toggleServiceType={toggleServiceType}
      date={date}
      setDate={setDate}
      amountRange={amountRange}
      setAmountRange={setAmountRange}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      hasActiveFilters={hasActiveFilters}
      clearFilters={clearFilters}
      applyFilters={applyFilters}
      selectAllTechnicians={selectAllTechnicians}
      deselectAllTechnicians={deselectAllTechnicians}
      selectAllContractors={selectAllContractors}
      deselectAllContractors={deselectAllContractors}
    />
  );
};

export default JobFiltersWrapper;
