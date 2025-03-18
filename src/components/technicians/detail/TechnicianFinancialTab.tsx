
import React, { useMemo } from "react";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TechnicianInvoiceGenerator from "@/components/technicians/invoices/TechnicianInvoiceGenerator";
import TechnicianFinancialTable from "@/components/technicians/charts/TechnicianFinancialTable";
import TechnicianPerformanceMetrics from "@/components/technicians/charts/TechnicianPerformanceMetrics";
import TechnicianDetailCard from "@/components/technicians/charts/TechnicianDetailCard";
import PaymentBreakdownCards from "@/components/technicians/charts/PaymentBreakdownCards";

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
  const technicianMetrics = useMemo(() => {
    return {
      completedJobs: technician.completedJobs || 0,
      cancelledJobs: technician.cancelledJobs || 0,
      totalRevenue: technician.totalRevenue || 0,
      revenue: technician.totalRevenue || 0,
      earnings: technician.totalRevenue ? technician.totalRevenue * (technician.paymentType === "percentage" ? technician.paymentRate / 100 : 1) : 0,
      expenses: technician.totalRevenue ? technician.totalRevenue * 0.2 : 0,
      profit: technician.totalRevenue ? technician.totalRevenue * 0.4 : 0,
      partsValue: technician.totalRevenue ? technician.totalRevenue * 0.1 : 0
    };
  }, [technician]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TechnicianDetailCard 
          technician={technician}
          metrics={technicianMetrics}
        />
        <div className="md:col-span-2">
          <PaymentBreakdownCards 
            technicians={[technician]}
            revenue={technicianMetrics.revenue}
            technicianEarnings={technicianMetrics.earnings}
            expenses={technicianMetrics.expenses}
            profit={technicianMetrics.profit}
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
        metrics={technicianMetrics}
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
