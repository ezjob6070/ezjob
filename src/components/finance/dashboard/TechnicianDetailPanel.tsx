
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Technician } from "@/types/technician";
import PaymentBreakdownCards from "@/components/technicians/charts/PaymentBreakdownCards";
import TechnicianPerformanceMetrics from "@/components/technicians/charts/TechnicianPerformanceMetrics";

interface TechnicianDetailPanelProps {
  selectedTechnician: Technician | null;
  selectedTechnicianMetrics: any;
  dateRangeText: string;
}

const TechnicianDetailPanel: React.FC<TechnicianDetailPanelProps> = ({
  selectedTechnician,
  selectedTechnicianMetrics,
  dateRangeText
}) => {
  if (!selectedTechnician) return null;

  return (
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
  );
};

export default TechnicianDetailPanel;
