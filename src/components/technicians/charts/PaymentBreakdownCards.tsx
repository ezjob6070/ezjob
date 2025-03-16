
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export interface PaymentBreakdownCardsProps {
  technicians: Technician[];
}

const PaymentBreakdownCards: React.FC<PaymentBreakdownCardsProps> = ({ technicians }) => {
  // Combine data from all technicians
  const totalRevenue = technicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);
  
  // Calculate technician earnings based on payment type
  const technicianEarnings = technicians.reduce((sum, tech) => {
    const earnings = tech.paymentType === "percentage" 
      ? tech.totalRevenue * (tech.paymentRate / 100)
      : tech.paymentType === "hourly"
      ? tech.paymentRate * 160 // Assuming 160 hours per month
      : tech.paymentRate; // Flat rate
    return sum + earnings;
  }, 0);
  
  // Expenses (usually parts, materials, etc.)
  const expenses = totalRevenue * 0.33; // Assuming 33% goes to expenses
  
  // Company profit
  const companyProfit = totalRevenue - technicianEarnings - expenses;
  
  // Data for pie chart
  const pieData = [
    { name: "Technician Earnings", value: technicianEarnings },
    { name: "Expenses", value: expenses },
    { name: "Company Profit", value: companyProfit },
  ];
  
  // Colors for pie chart
  const COLORS = ["#f43f5e", "#fbbf24", "#10b981"];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Revenue</CardTitle>
          <CardDescription>All jobs combined</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {technicians.reduce((sum, tech) => sum + tech.completedJobs, 0)} completed jobs
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Technician Earnings</CardTitle>
          <CardDescription>Payments to technicians</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-500">{formatCurrency(technicianEarnings)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {((technicianEarnings / totalRevenue) * 100).toFixed(1)}% of total revenue
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Company Profit</CardTitle>
          <CardDescription>After expenses and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-500">{formatCurrency(companyProfit)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {((companyProfit / totalRevenue) * 100).toFixed(1)}% profit margin
          </p>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>Distribution of revenue across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentBreakdownCards;
