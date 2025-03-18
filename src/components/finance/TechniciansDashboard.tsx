
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
import StatCard from "@/components/StatCard";
import { BriefcaseIcon, DollarSignIcon, PercentIcon, Users } from "lucide-react";

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
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
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
  const totalActiveTechnicians = activeTechnicians.filter(tech => tech.status === 'active').length;
  const totalRevenue = financialMetrics?.totalRevenue || 0;
  const totalEarnings = financialMetrics?.technicianEarnings || 0;
  const companyProfit = financialMetrics?.companyProfit || 0;
  const profitMargin = totalRevenue > 0 ? (companyProfit / totalRevenue) * 100 : 0;

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
              toggleTechnician={toggleTechnician}
              technicianNames={technicianNames}
              paymentTypeFilter={paymentTypeFilter}
              setPaymentTypeFilter={setPaymentTypeFilter}
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
              clearFilters={clearFilters}
            />
          </div>

          {/* Financial Stat Cards - Added to match JobSourcesDashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Active Technicians"
              value={totalActiveTechnicians.toString()}
              icon={<Users size={20} />}
              description="Currently employed technicians"
              className="bg-blue-50"
            />
            
            <StatCard
              title="Total Revenue"
              value={formatCurrency(totalRevenue)}
              icon={<DollarSignIcon size={20} />}
              description="Revenue from all jobs"
              className="bg-green-50"
            />
            
            <StatCard
              title="Technician Earnings"
              value={formatCurrency(totalEarnings)}
              icon={<BriefcaseIcon size={20} />}
              description="Payments to technicians"
              className="bg-purple-50"
            />
            
            <StatCard
              title="Profit Margin"
              value={`${profitMargin.toFixed(1)}%`}
              icon={<PercentIcon size={20} />}
              description={`Company Profit: ${formatCurrency(companyProfit)}`}
              className="bg-yellow-50"
            />
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
