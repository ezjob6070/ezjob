
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DonutChart } from "@/components/DonutChart";

interface TechnicianCircleChartsProps {
  filteredTechnicians: Technician[];
}

const TechnicianCircleCharts: React.FC<TechnicianCircleChartsProps> = ({ 
  filteredTechnicians 
}) => {
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
  const companyProfitPercentage = ((companyProfit / totalRevenue) * 100).toFixed(1);
  
  // Revenue breakdown data
  const revenueBreakdown = [
    { name: "Service Revenue", value: totalRevenue * 0.75, color: "#0ea5e9" }, // sky blue
    { name: "Parts & Materials", value: totalRevenue * 0.20, color: "#ec4899" }, // pink
    { name: "Diagnostic Fees", value: totalRevenue * 0.05, color: "#6366f1" },  // indigo
  ];

  // Technician earnings breakdown
  const technicianExpenseBreakdown = [
    { name: "Technician Payments", value: technicianEarnings, color: "#22c55e" },    // green
    { name: "Operating Expenses", value: totalExpenses, color: "#f87171" },    // red
    { name: "Company Profit", value: companyProfit, color: "#3b82f6" },       // blue
  ];

  // Net profit breakdown data
  const profitBreakdown = [
    { name: "Operating Costs", value: companyProfit * 0.3, color: "#3b82f6" }, // blue
    { name: "Reinvestment", value: companyProfit * 0.25, color: "#10b981" },   // green
    { name: "Owner Dividends", value: companyProfit * 0.30, color: "#f59e0b" }, // amber
    { name: "Taxes", value: companyProfit * 0.15, color: "#ef4444" },          // red
  ];
  
  return (
    <div className="space-y-6">
      {/* Payment Breakdown Circles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Breakdown Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Income Breakdown</CardTitle>
            <CardDescription>Source of income streams</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={revenueBreakdown}
              title={formatCurrency(totalRevenue)}
              subtitle="Total Income"
            />
          </CardContent>
        </Card>

        {/* Expense Distribution Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Payment and Expenses</CardTitle>
            <CardDescription>Distribution of earnings between technicians and company</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={technicianExpenseBreakdown}
              title={formatCurrency(companyProfit)}
              subtitle="Company Profit"
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
      
      {/* Technicians List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Technician Financial Performance</CardTitle>
          <CardDescription>Earnings and profit metrics for each technician</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technician</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Technician Earnings</TableHead>
                <TableHead>Company Earnings</TableHead>
                <TableHead>Profit Ratio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTechnicians.map((tech) => {
                const techEarnings = tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1);
                const companyEarnings = tech.totalRevenue - techEarnings - (tech.totalRevenue * 0.33);
                const profitRatio = ((companyEarnings / tech.totalRevenue) * 100).toFixed(1);
                
                return (
                  <TableRow key={tech.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-2 text-xs">
                          {tech.initials}
                        </div>
                        <span>{tech.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(tech.totalRevenue)}</TableCell>
                    <TableCell>{formatCurrency(techEarnings)}</TableCell>
                    <TableCell>{formatCurrency(companyEarnings)}</TableCell>
                    <TableCell>{profitRatio}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianCircleCharts;
