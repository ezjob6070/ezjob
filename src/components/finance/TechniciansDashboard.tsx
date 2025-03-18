
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTechnicianFinancials } from "@/hooks/technicians/useTechnicianFinancials";
import TechnicianFinancialTable from "@/components/technicians/charts/TechnicianFinancialTable";
import { DateRange } from "react-day-picker";
import DashboardMetrics from "./dashboard/MetricsCards";
import TechnicianDetailPanel from "./dashboard/TechnicianDetailPanel";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface TechniciansDashboardProps {
  activeTechnicians: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TechniciansDashboard: React.FC<TechniciansDashboardProps> = ({
  activeTechnicians,
  searchQuery,
  setSearchQuery
}) => {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: today,
    to: today,
  });
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [filteredTechnicians, setFilteredTechnicians] = useState(activeTechnicians);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  const technicianNames = activeTechnicians.map(tech => tech.name);

  const {
    paymentTypeFilter,
    setPaymentTypeFilter,
    selectedTechnicianNames,
    setSelectedTechnicianNames,
    selectedTechnician,
    localDateRange,
    setLocalDateRange,
    displayedTechnicians,
    financialMetrics,
    selectedTechnicianMetrics,
    dateRangeText,
    toggleTechnician,
    clearFilters,
    applyFilters,
    handleTechnicianSelect
  } = useTechnicianFinancials(filteredTechnicians, dateRange);

  useEffect(() => {
    const filtered = activeTechnicians;
    setFilteredTechnicians(filtered);
  }, [activeTechnicians]);

  const totalRevenue = financialMetrics?.totalRevenue || 0;
  const totalEarnings = financialMetrics?.technicianEarnings || 0;
  const companyProfit = financialMetrics?.companyProfit || 0;

  const handleTechnicianChange = (techId: string) => {
    setSelectedTechnicianId(techId);
    const tech = activeTechnicians.find(t => t.id === techId);
    if (tech) {
      handleTechnicianSelect(tech);
    }
  };

  // Prepare mock metrics data for the selected technician
  const prepareMetricsData = () => {
    if (!selectedTechnician) return null;
    
    return {
      revenue: selectedTechnician.totalRevenue || 0,
      earnings: selectedTechnician.totalRevenue * 0.40, // Mock 40% of revenue
      expenses: selectedTechnician.totalRevenue * 0.20, // Mock 20% of revenue
      profit: selectedTechnician.totalRevenue * 0.40, // Mock 40% of revenue
      totalJobs: 42, // Mock value
      completedJobs: 38, // Mock value
      cancelledJobs: 4, // Mock value
    };
  };

  const mockMetrics = prepareMetricsData();

  const handleDatePreset = (preset: string) => {
    const today = new Date();
    let from: Date;
    let to: Date = today;

    switch (preset) {
      case "today":
        from = today;
        break;
      case "yesterday":
        from = new Date(today);
        from.setDate(today.getDate() - 1);
        to = new Date(from);
        break;
      case "thisWeek":
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
        from = startOfWeek;
        break;
      case "lastWeek":
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 6);
        from = lastWeekStart;
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        to = lastWeekEnd;
        break;
      case "thisMonth":
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "lastMonth":
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        to = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        from = today;
    }
    
    setLocalDateRange({ from, to });
    setAppliedFilters(true);
    setShowDateFilter(false);
  };

  const getDateDisplayText = () => {
    if (!localDateRange?.from) return "Today";
    
    // If from and to are the same date and it's today
    if (localDateRange.to && 
        isSameDay(localDateRange.from, localDateRange.to) && 
        isSameDay(localDateRange.from, today)) {
      return "Today";
    }
    
    // If from and to are the same date but not today
    if (localDateRange.to && isSameDay(localDateRange.from, localDateRange.to)) {
      return format(localDateRange.from, "MMM d, yyyy");
    }
    
    // If from and to are different dates
    if (localDateRange.to) {
      return `${format(localDateRange.from, "MMM d")} - ${format(localDateRange.to, "MMM d, yyyy")}`;
    }
    
    // If only from date is set
    return format(localDateRange.from, "MMM d, yyyy");
  };

  const getTodayFormattedDate = () => {
    return format(today, "MMM d, yyyy");
  };
  
  // Helper function to check if two dates are the same day
  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technician Financial Performance</CardTitle>
          <CardDescription>Search, filter, and analyze technician earnings and profitability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-6">
              <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex flex-col items-start px-4 py-2 h-auto min-h-[3rem] relative">
                    <div className="flex items-center gap-2 font-medium">
                      <Calendar className="h-4 w-4" />
                      {getDateDisplayText()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {isSameDay(localDateRange?.from || today, today) ? 
                        getTodayFormattedDate() : 
                        "Click to select custom range"}
                    </div>
                    <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3 border-b">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <Button size="sm" variant="outline" onClick={() => handleDatePreset("today")}>Today</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDatePreset("yesterday")}>Yesterday</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDatePreset("thisWeek")}>This Week</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDatePreset("lastWeek")}>Last Week</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDatePreset("thisMonth")}>This Month</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDatePreset("lastMonth")}>Last Month</Button>
                    </div>
                    <div className="text-sm font-medium mb-2">Custom Range</div>
                    <CalendarComponent
                      mode="range"
                      selected={localDateRange}
                      onSelect={setLocalDateRange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </div>
                  <div className="p-3 flex justify-between">
                    <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
                    <Button variant="default" size="sm" onClick={() => {
                      applyFilters();
                      setShowDateFilter(false);
                    }}>Apply</Button>
                  </div>
                </PopoverContent>
              </Popover>

              {appliedFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>

          <DashboardMetrics 
            totalRevenue={totalRevenue}
            totalEarnings={totalEarnings}
            companyProfit={companyProfit}
            dateRangeText={dateRangeText}
          />
          
          <TechnicianFinancialTable
            filteredTechnicians={filteredTechnicians}
            displayedTechnicians={displayedTechnicians}
            selectedTechnicianNames={selectedTechnicianNames}
            toggleTechnician={toggleTechnician}
            clearFilters={clearFilters}
            applyFilters={applyFilters}
            paymentTypeFilter={paymentTypeFilter}
            setPaymentTypeFilter={setPaymentTypeFilter}
            localDateRange={localDateRange}
            setLocalDateRange={setLocalDateRange}
            onTechnicianSelect={handleTechnicianSelect}
            selectedTechnicianId={selectedTechnician?.id}
          />
        </CardContent>
      </Card>

      {selectedTechnician && (
        <TechnicianDetailPanel 
          selectedTechnician={selectedTechnician}
          selectedTechnicianMetrics={mockMetrics}
          dateRangeText={dateRangeText}
        />
      )}
    </div>
  );
};

export default TechniciansDashboard;
