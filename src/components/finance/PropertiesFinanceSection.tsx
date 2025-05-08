
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

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
  // Mock data for demonstration
  const propertyMetrics = [
    {
      name: "123 Main St",
      revenue: 250000,
      expenses: 50000,
      profit: 200000,
      status: "Listed",
      daysOnMarket: 45
    },
    {
      name: "456 Oak Ave",
      revenue: 180000,
      expenses: 30000,
      profit: 150000,
      status: "Under Contract",
      daysOnMarket: 30
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
            <div key={property.name} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{property.name}</h3>
                <span className="text-green-600 font-medium">{formatCurrency(property.profit)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>Revenue: {formatCurrency(property.revenue)}</div>
                <div>Expenses: {formatCurrency(property.expenses)}</div>
                <div>Status: {property.status}</div>
                <div>Days on market: {property.daysOnMarket}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertiesFinanceSection;
