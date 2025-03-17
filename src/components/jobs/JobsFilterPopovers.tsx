
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar, Users, LayoutList, Banknote, CreditCard } from "lucide-react";
import { useJobsContext } from "./context/JobsContext";
import TechnicianFilter from "@/components/jobs/filters/TechnicianFilter";
import JobsDateFilter from "@/components/jobs/filters/JobsDateFilter";
import JobSourceFilter from "@/components/jobs/JobSourceFilter";
import AmountFilter from "@/components/jobs/AmountFilter";
import PaymentMethodFilter from "@/components/jobs/PaymentMethodFilter";

export const JobsFilterPopovers = () => {
  const {
    datePopoverOpen, setDatePopoverOpen,
    techPopoverOpen, setTechPopoverOpen,
    sourcePopoverOpen, setSourcePopoverOpen,
    amountPopoverOpen, setAmountPopoverOpen,
    paymentPopoverOpen, setPaymentPopoverOpen,
    
    // Filter data
    date, setDate,
    selectedTechnicians, toggleTechnician,
    selectedJobSources, toggleJobSource,
    amountRange, setAmountRange,
    paymentMethod, setPaymentMethod,
    selectAllTechnicians, deselectAllTechnicians,
    selectAllJobSources, deselectAllJobSources
  } = useJobsContext();

  // Determine if we should show "Today" on the date button
  const getDateButtonLabel = () => {
    if (!date?.from) return "Today";
    
    if (date.to) {
      if (date.from.toDateString() === date.to.toDateString()) {
        if (date.from.toDateString() === new Date().toDateString()) {
          return "Today";
        }
      }
    }
    
    return "Date Range";
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setDatePopoverOpen(true)}
            >
              <Calendar className="h-4 w-4" />
              <span>{getDateButtonLabel()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-4" 
            align="start" 
            side="bottom" 
            sideOffset={5}
            avoidCollisions={false}
          >
            <JobsDateFilter date={date} setDate={setDate} />
          </PopoverContent>
        </Popover>
        
        <Popover open={techPopoverOpen} onOpenChange={setTechPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setTechPopoverOpen(true)}
            >
              <Users className="h-4 w-4" />
              <span>Technicians</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-4" 
            align="start" 
            side="bottom" 
            sideOffset={5}
            avoidCollisions={false}
          >
            <TechnicianFilter
              technicians={[]} // This will be populated from props
              selectedNames={selectedTechnicians}
              onToggle={toggleTechnician}
              onSelectAll={selectAllTechnicians}
              onDeselectAll={deselectAllTechnicians}
            />
          </PopoverContent>
        </Popover>
        
        <Popover open={sourcePopoverOpen} onOpenChange={setSourcePopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setSourcePopoverOpen(true)}
            >
              <LayoutList className="h-4 w-4" />
              <span>Sources</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-4" 
            align="start" 
            side="bottom" 
            sideOffset={5}
            avoidCollisions={false}
          >
            <JobSourceFilter
              jobSourceNames={[]} // This will be populated from props
              selectedJobSources={selectedJobSources}
              toggleJobSource={toggleJobSource}
              selectAllJobSources={selectAllJobSources}
              deselectAllJobSources={deselectAllJobSources}
            />
          </PopoverContent>
        </Popover>
        
        <Popover open={amountPopoverOpen} onOpenChange={setAmountPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setAmountPopoverOpen(true)}
            >
              <Banknote className="h-4 w-4" />
              <span>Amount</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-4" 
            align="start" 
            side="bottom" 
            sideOffset={5}
            avoidCollisions={false}
          >
            <AmountFilter value={amountRange} onChange={setAmountRange} />
          </PopoverContent>
        </Popover>
        
        <Popover open={paymentPopoverOpen} onOpenChange={setPaymentPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setPaymentPopoverOpen(true)}
            >
              <CreditCard className="h-4 w-4" />
              <span>Payment</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-4" 
            align="start" 
            side="bottom" 
            sideOffset={5}
            avoidCollisions={false}
          >
            <PaymentMethodFilter value={paymentMethod} onChange={setPaymentMethod} />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
