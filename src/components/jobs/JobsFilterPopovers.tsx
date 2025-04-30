
import React from "react";
import { useJobsContext } from "./context/JobsContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import TechnicianFilter from "./filters/TechnicianFilter";
import JobSourceFilter from "./JobSourceFilter";
import AmountFilter from "./AmountFilter";
import PaymentMethodFilter from "./PaymentMethodFilter";
import ServiceCategoryFilter from "./filters/ServiceCategoryFilter";
import ServiceTypeFilter from "./filters/ServiceTypeFilter";

export const JobsFilterPopovers = () => {
  const {
    datePopoverOpen,
    setDatePopoverOpen,
    techPopoverOpen,
    setTechPopoverOpen,
    sourcePopoverOpen,
    setSourcePopoverOpen,
    amountPopoverOpen,
    setAmountPopoverOpen,
    paymentPopoverOpen,
    setPaymentPopoverOpen,
    date,
    setDate,
    selectedTechnicians,
    toggleTechnician,
    selectAllTechnicians,
    deselectAllTechnicians,
    toggleJobSource,
    selectedJobSources,
    selectAllJobSources,
    deselectAllJobSources,
    amountRange,
    setAmountRange,
    paymentMethod,
    setPaymentMethod,
    selectedCategories,
    toggleCategory,
    selectedServiceTypes,
    toggleServiceType,
    clearFilters
  } = useJobsContext();

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* Date Popover */}
      <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            Date
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      {/* Technician Popover */}
      <Popover open={techPopoverOpen} onOpenChange={setTechPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            Technician
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px]" align="start">
          <TechnicianFilter 
            technicians={[]} // This should be populated from provider
            selectedNames={selectedTechnicians}
            onToggle={toggleTechnician}
            onSelectAll={selectAllTechnicians}
            onDeselectAll={deselectAllTechnicians}
          />
        </PopoverContent>
      </Popover>
      
      {/* Category Filter */}
      <ServiceCategoryFilter 
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        clearCategories={() => {
          const newFilters = {...selectedCategories};
          clearFilters();
        }}
      />

      {/* Service Type Filter */}
      <ServiceTypeFilter 
        selectedServiceTypes={selectedServiceTypes}
        toggleServiceType={toggleServiceType}
        clearServiceTypes={() => {
          const newFilters = {...selectedServiceTypes};
          clearFilters();
        }}
      />
      
      {/* Source Popover */}
      <Popover open={sourcePopoverOpen} onOpenChange={setSourcePopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            Source
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px]" align="start">
          <JobSourceFilter 
            sources={[]} // This should be populated from provider
            selectedSources={selectedJobSources}
            onToggle={toggleJobSource}
            onSelectAll={selectAllJobSources}
            onDeselectAll={deselectAllJobSources}
          />
        </PopoverContent>
      </Popover>
      
      {/* Amount Popover */}
      <Popover open={amountPopoverOpen} onOpenChange={setAmountPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            Amount
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px]" align="start">
          <AmountFilter 
            value={amountRange}
            onChange={setAmountRange}
          />
        </PopoverContent>
      </Popover>
      
      {/* Payment Method Popover */}
      <Popover open={paymentPopoverOpen} onOpenChange={setPaymentPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            Payment
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px]" align="start">
          <PaymentMethodFilter 
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
