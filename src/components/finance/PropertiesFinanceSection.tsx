
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { FinanceEntityType } from "@/types/finance";

interface PropertiesFinanceSectionProps {
  properties: any[];
  dateRange?: DateRange;
  setDateRange?: (range: DateRange) => void;
}

const PropertiesFinanceSection: React.FC<PropertiesFinanceSectionProps> = ({
  properties,
  dateRange,
  setDateRange
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for demonstration
  const propertyMetrics = [
    {
      address: "123 Main St",
      listPrice: 750000,
      status: "Listed",
      daysOnMarket: 15,
      viewings: 8
    },
    {
      address: "456 Oak Ave",
      listPrice: 525000,
      status: "Under Contract",
      daysOnMarket: 32,
      viewings: 12
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Property Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {propertyMetrics.map((property) => (
            <div key={property.address} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{property.address}</h3>
                <span className={`font-medium ${
                  property.status === "Listed" ? "text-blue-600" : "text-green-600"
                }`}>{property.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>List Price: {formatCurrency(property.listPrice)}</div>
                <div>Days on Market: {property.daysOnMarket}</div>
                <div>Total Viewings: {property.viewings}</div>
                <div>Potential Commission: {formatCurrency(property.listPrice * 0.03)}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertiesFinanceSection;
