
import React, { useMemo } from "react";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TechnicianInvoiceGenerator from "@/components/technicians/invoices/TechnicianInvoiceGenerator";
import TechnicianFinancialTable from "@/components/technicians/charts/TechnicianFinancialTable";
import TechnicianPerformanceMetrics from "@/components/technicians/charts/TechnicianPerformanceMetrics";
import TechnicianDetailCard from "@/components/technicians/charts/TechnicianDetailCard";
import PaymentBreakdownCards from "@/components/technicians/charts/PaymentBreakdownCards";
import { calculateTechnicianMetrics } from "@/hooks/technicians/financialUtils";

interface TechnicianFinancialTabProps {
  technician: Technician;
  filteredTechnicians: Technician[];
  displayedTechnicians: Technician[];
  selectedTechnicianNames: string[];
  toggleTechnician: (name: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  paymentTypeFilter: string;
  setPaymentTypeFilter: (filter: string) => void;
  localDateRange: DateRange | undefined;
  setLocalDateRange: (range: DateRange | undefined) => void;
  selectedTechnicianId?: string;
  onTechnicianSelect: (technician: Technician) => void;
}

const TechnicianFinancialTab = ({
  technician,
  filteredTechnicians,
  displayedTechnicians,
  selectedTechnicianNames,
  toggleTechnician,
  clearFilters,
  applyFilters,
  paymentTypeFilter,
  setPaymentTypeFilter,
  localDateRange,
  setLocalDateRange,
  selectedTechnicianId,
  onTechnicianSelect
}: TechnicianFinancialTabProps) => {
  // Calculate financial metrics for the technician
  const metrics = useMemo(() => {
    return calculateTechnicianMetrics(technician) || {
      revenue: technician.totalRevenue || 0,
      earnings: (technician.totalRevenue || 0) * (technician.paymentType === "percentage" ? technician.paymentRate / 100 : 1),
      expenses: (technician.totalRevenue || 0) * 0.33,
      profit: (technician.totalRevenue || 0) * 0.4,
      partsValue: (technician.totalRevenue || 0) * 0.2
    };
  }, [technician]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TechnicianDetailCard 
          technician={technician} 
          metrics={{
            completedJobs: technician.completedJobs || 0,
            cancelledJobs: technician.cancelledJobs || 0,
            totalRevenue: technician.totalRevenue || 0,
            ...metrics
          }}
        />
        <div className="md:col-span-2">
          <PaymentBreakdownCards 
            revenue={metrics.revenue}
            technicianEarnings={metrics.earnings}
            expenses={metrics.expenses}
            profit={metrics.profit}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md font-medium">
            Invoice Generation
          </CardTitle>
          <TechnicianInvoiceGenerator 
            technicians={[technician]} 
            selectedTechnician={technician}
          />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Generate invoices for this technician based on jobs completed within a selected time period.
          </p>
        </CardContent>
      </Card>
      
      <TechnicianPerformanceMetrics 
        technician={technician} 
        metrics={metrics}
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
        onTechnicianSelect={onTechnicianSelect}
        selectedTechnicianId={selectedTechnicianId}
      />
    </div>
  );
};

export default TechnicianFinancialTab;
