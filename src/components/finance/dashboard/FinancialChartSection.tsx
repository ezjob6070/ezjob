
import React from "react";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import TechnicianCircleCharts from "@/components/technicians/TechnicianCircleCharts";
import TechnicianInvoiceSection from "@/components/finance/TechnicianInvoiceSection";

interface FinancialChartSectionProps {
  filteredTechnicians: Technician[];
  date: DateRange | undefined;
}

const FinancialChartSection: React.FC<FinancialChartSectionProps> = ({
  filteredTechnicians,
  date
}) => {
  return (
    <>
      <TechnicianCircleCharts 
        filteredTechnicians={filteredTechnicians} 
        dateRange={date}
      />
      
      <TechnicianInvoiceSection 
        activeTechnicians={filteredTechnicians} 
      />
    </>
  );
};

export default FinancialChartSection;
