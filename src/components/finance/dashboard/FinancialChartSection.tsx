
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Technician } from "@/types/technician";
import TechnicianCircleCharts from "@/components/technicians/TechnicianCircleCharts";
import { DateRange } from "react-day-picker";

interface FinancialChartSectionProps {
  filteredTechnicians: Technician[];
  dateRange: DateRange;
}

const FinancialChartSection: React.FC<FinancialChartSectionProps> = ({
  filteredTechnicians,
  dateRange
}) => {
  const [selectedTechnicianId, setSelectedTechnicianId] = React.useState<string | undefined>(undefined);
  const [localDateRange, setLocalDateRange] = React.useState<DateRange | undefined>({
    from: dateRange.from,
    to: dateRange.to
  });

  const handleTechnicianSelect = (technician: Technician) => {
    setSelectedTechnicianId(technician.id);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Financial Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <TechnicianCircleCharts 
          filteredTechnicians={filteredTechnicians}
          selectedTechnicianId={selectedTechnicianId}
          onTechnicianSelect={handleTechnicianSelect}
          localDateRange={localDateRange}
          setLocalDateRange={setLocalDateRange}
        />
      </CardContent>
    </Card>
  );
};

export default FinancialChartSection;
