
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OverallFinanceSectionProps {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
}

const OverallFinanceSection: React.FC<OverallFinanceSectionProps> = ({
  totalRevenue,
  totalExpenses,
  totalProfit,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">Overall Finance</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Revenue from all sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>Expenses across all categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
            <CardDescription>Revenue after expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalProfit)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverallFinanceSection;
