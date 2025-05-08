
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface AgentsFinanceSectionProps {
  activeAgents: any[];
  dateRange?: DateRange;
  setDateRange?: (range: DateRange) => void;
}

const AgentsFinanceSection: React.FC<AgentsFinanceSectionProps> = ({
  activeAgents,
  dateRange,
  setDateRange
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for demonstration
  const agentMetrics = [
    {
      name: "John Doe",
      totalSales: 2500000,
      commission: 75000,
      properties: 5,
      pendingDeals: 3
    },
    {
      name: "Jane Smith",
      totalSales: 1800000,
      commission: 54000,
      properties: 4,
      pendingDeals: 2
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Agent Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agentMetrics.map((agent) => (
            <div key={agent.name} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{agent.name}</h3>
                <span className="text-green-600 font-medium">{formatCurrency(agent.commission)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>Total Sales: {formatCurrency(agent.totalSales)}</div>
                <div>Active Properties: {agent.properties}</div>
                <div>Pending Deals: {agent.pendingDeals}</div>
                <div>Commission Rate: 3%</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentsFinanceSection;
