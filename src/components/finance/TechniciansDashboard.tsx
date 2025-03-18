
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TechnicianFilters from "./technician-filters/TechnicianFilters";
import { useTechnicianFinancials } from "@/hooks/technicians/useTechnicianFinancials";
import TechnicianFinancialTable from "@/components/technicians/charts/TechnicianFinancialTable";
import TechnicianPerformanceMetrics from "@/components/technicians/charts/TechnicianPerformanceMetrics";
import PaymentBreakdownCards from "@/components/technicians/charts/PaymentBreakdownCards";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { DollarSignIcon, UserIcon, CalendarDaysIcon, CheckIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [filteredTechnicians, setFilteredTechnicians] = useState(activeTechnicians);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>("");

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

  // Get the specific technician details
  const selectedTechDetails = activeTechnicians.find(tech => tech.id === selectedTechnicianId);
  
  // Calculate completion rate for selected technician
  const completionRate = selectedTechDetails ? 
    Math.round((selectedTechDetails.completedJobs / (selectedTechDetails.completedJobs + selectedTechDetails.cancelledJobs)) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technician Financial Performance</CardTitle>
          <CardDescription>Search, filter, and analyze technician earnings and profitability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <TechnicianFilters
              date={localDateRange}
              setDate={setLocalDateRange}
              selectedTechnicians={selectedTechnicianNames}
              setSelectedTechnicians={setSelectedTechnicianNames}
              technicianNames={technicianNames}
              paymentTypeFilter={paymentTypeFilter}
              setPaymentTypeFilter={setPaymentTypeFilter}
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
              clearFilters={clearFilters}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <DollarSignIcon className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalRevenue)}</p>
                    {dateRangeText && (
                      <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <DollarSignIcon className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Technician Earnings</p>
                    <p className="text-2xl font-bold text-red-600">-{formatCurrency(totalEarnings)}</p>
                    {dateRangeText && (
                      <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSignIcon className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company Profit</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(companyProfit)}</p>
                    {dateRangeText && (
                      <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Technician Quick Selector Section */}
          <div className="mb-6 border rounded-lg p-4 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-2">Select Technician for Quick View</h3>
                <Select value={selectedTechnicianId} onValueChange={handleTechnicianChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTechnicians.map(tech => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name} - {tech.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-2">Time Range</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarDaysIcon className="mr-2 h-4 w-4" />
                      {dateRangeText || "Select date range"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80">
                    <div className="p-2">
                      <TechnicianFilters
                        date={localDateRange}
                        setDate={setLocalDateRange}
                        selectedTechnicians={[]}
                        setSelectedTechnicians={() => {}}
                        technicianNames={[]}
                        paymentTypeFilter=""
                        setPaymentTypeFilter={() => {}}
                        appliedFilters={false}
                        setAppliedFilters={() => {}}
                        clearFilters={() => {}}
                      />
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {selectedTechDetails && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <UserIcon className="h-4 w-4 text-purple-700" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Technician</p>
                        <p className="text-sm font-medium">{selectedTechDetails.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <CalendarDaysIcon className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Jobs</p>
                        <p className="text-sm font-medium">{selectedTechDetails.completedJobs + selectedTechDetails.cancelledJobs}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckIcon className="h-4 w-4 text-green-700" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Completed Jobs</p>
                        <p className="text-sm font-medium">{selectedTechDetails.completedJobs} 
                          <span className="text-xs text-muted-foreground ml-1">
                            ({completionRate}%)
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <DollarSignIcon className="h-4 w-4 text-amber-700" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Payment Method</p>
                        <p className="text-sm font-medium capitalize">
                          {selectedTechDetails.paymentType} 
                          <span className="text-xs text-muted-foreground ml-1">
                            ({selectedTechDetails.paymentType === 'percentage' 
                              ? `${selectedTechDetails.paymentRate}%` 
                              : formatCurrency(selectedTechDetails.paymentRate)})
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
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
        <Card>
          <CardHeader>
            <CardTitle>Technician Details: {selectedTechnician.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentBreakdownCards 
              revenue={selectedTechnicianMetrics?.revenue || 0}
              technicianEarnings={selectedTechnicianMetrics?.earnings || 0}
              expenses={selectedTechnicianMetrics?.expenses || 0}
              profit={selectedTechnicianMetrics?.profit || 0}
              dateRangeText={dateRangeText}
            />
            
            <div className="mt-6">
              <TechnicianPerformanceMetrics 
                technician={selectedTechnician}
                metrics={selectedTechnicianMetrics}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TechniciansDashboard;
