
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TechnicianSearchFilter from "./technician-filters/TechnicianSearchFilter";
import TechnicianFilters from "./technician-filters/TechnicianFilters";
import { searchTechnician } from "./technician-filters/TechnicianUtils";
import { useTechnicianFinancials } from "@/hooks/technicians/useTechnicianFinancials";
import TechnicianFinancialTable from "@/components/technicians/charts/TechnicianFinancialTable";
import TechnicianPerformanceMetrics from "@/components/technicians/charts/TechnicianPerformanceMetrics";
import PaymentBreakdownCards from "@/components/technicians/charts/PaymentBreakdownCards";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { DollarSignIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

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
  // Fix type error by setting the full DateRange object
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [filteredTechnicians, setFilteredTechnicians] = useState(activeTechnicians);

  // Get technician names for filters
  const technicianNames = activeTechnicians.map(tech => tech.name);

  // Use the hook for technician financials
  const {
    paymentTypeFilter,
    setPaymentTypeFilter,
    selectedTechnicianNames,
    setSelectedTechnicianNames,  // Fixed: Get this function from the hook
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

  // Filter technicians by search query
  useEffect(() => {
    const filtered = activeTechnicians.filter(tech => 
      searchTechnician(tech, searchQuery)
    );
    setFilteredTechnicians(filtered);
  }, [activeTechnicians, searchQuery]);

  // Calculate totals for stat cards
  const totalRevenue = financialMetrics?.totalRevenue || 0;
  const totalEarnings = financialMetrics?.technicianEarnings || 0;
  const companyProfit = financialMetrics?.companyProfit || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technician Financial Performance</CardTitle>
          <CardDescription>Search, filter, and analyze technician earnings and profitability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <TechnicianSearchFilter 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            
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

          {/* Financial Stat Cards - Showing only revenue, earnings and profit with date */}
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
