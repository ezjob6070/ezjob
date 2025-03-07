
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DonutChart } from "@/components/DonutChart";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";

interface TechnicianCircleChartsProps {
  filteredTechnicians: Technician[];
}

const TechnicianCircleCharts: React.FC<TechnicianCircleChartsProps> = ({ 
  filteredTechnicians 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Calculate total revenue from technicians
  const totalRevenue = filteredTechnicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);
  
  // Calculate total technician payments
  const technicianEarnings = filteredTechnicians.reduce((sum, tech) => 
    sum + tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1), 0
  );
  
  // Estimate expenses as 33% of revenue
  const totalExpenses = totalRevenue * 0.33;
  
  // Calculate net profit
  const companyProfit = totalRevenue - technicianEarnings - totalExpenses;
  
  // Revenue breakdown data
  const revenueBreakdown = [
    { name: "Service Revenue", value: totalRevenue * 0.75, color: "#0ea5e9" }, // sky blue
    { name: "Parts & Materials", value: totalRevenue * 0.20, color: "#ec4899" }, // pink
    { name: "Diagnostic Fees", value: totalRevenue * 0.05, color: "#6366f1" },  // indigo
  ];

  // Expense categories
  const expenseCategories = [
    { name: "Equipment", value: totalExpenses * 0.4, color: "#f87171" },    // red
    { name: "Travel", value: totalExpenses * 0.3, color: "#22c55e" },       // green
    { name: "Training", value: totalExpenses * 0.15, color: "#f97316" },    // orange
    { name: "Insurance", value: totalExpenses * 0.1, color: "#3b82f6" },    // blue
    { name: "Other", value: totalExpenses * 0.05, color: "#8b5cf6" },       // purple
  ];

  // Net profit breakdown data
  const profitBreakdown = [
    { name: "Operating Costs", value: companyProfit * 0.3, color: "#3b82f6" }, // blue
    { name: "Reinvestment", value: companyProfit * 0.25, color: "#10b981" },   // green
    { name: "Owner Dividends", value: companyProfit * 0.30, color: "#f59e0b" }, // amber
    { name: "Taxes", value: companyProfit * 0.15, color: "#ef4444" },          // red
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Revenue Breakdown Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>Source of revenue streams</CardDescription>
          <div className="mt-2">
            <Input
              placeholder="Search in revenue breakdown..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DonutChart
            data={revenueBreakdown}
            title={formatCurrency(totalRevenue)}
            subtitle="Total Income"
          />
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Distribution of expenses by type</CardDescription>
        </CardHeader>
        <CardContent>
          <DonutChart
            data={expenseCategories}
            title={formatCurrency(totalExpenses)}
            subtitle="Total Expenses"
          />
        </CardContent>
      </Card>

      {/* Net Profit Breakdown Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Net Company Profit</CardTitle>
          <CardDescription>How profit is distributed</CardDescription>
        </CardHeader>
        <CardContent>
          <DonutChart
            data={profitBreakdown}
            title={formatCurrency(companyProfit)}
            subtitle="Net Company Profit"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianCircleCharts;
