
import React from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Technician } from "@/types/technician";
import TechnicianFinancialTableContent from "./TechnicianFinancialTableContent";

interface TechnicianFinancialTableProps {
  displayedTechnicians: Technician[];
  selectedTechnicianId: string | undefined;
  onTechnicianSelect: (technician: Technician) => void;
  dateRange?: DateRange;
}

const TechnicianFinancialTable: React.FC<TechnicianFinancialTableProps> = ({
  displayedTechnicians,
  selectedTechnicianId,
  onTechnicianSelect,
  dateRange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Financial Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Technicians</TabsTrigger>
            <TabsTrigger value="percentage">Percentage Based</TabsTrigger>
            <TabsTrigger value="fixed">Fixed Rate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <TechnicianFinancialTableContent 
              displayedTechnicians={displayedTechnicians}
              onTechnicianSelect={onTechnicianSelect}
              selectedTechnicianId={selectedTechnicianId}
              dateRange={dateRange}
            />
          </TabsContent>
          
          <TabsContent value="percentage" className="mt-0">
            <TechnicianFinancialTableContent 
              displayedTechnicians={displayedTechnicians.filter(tech => tech.paymentType === "percentage")}
              onTechnicianSelect={onTechnicianSelect}
              selectedTechnicianId={selectedTechnicianId}
              dateRange={dateRange}
            />
          </TabsContent>
          
          <TabsContent value="fixed" className="mt-0">
            <TechnicianFinancialTableContent 
              displayedTechnicians={displayedTechnicians.filter(tech => tech.paymentType === "fixed")}
              onTechnicianSelect={onTechnicianSelect}
              selectedTechnicianId={selectedTechnicianId}
              dateRange={dateRange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TechnicianFinancialTable;
