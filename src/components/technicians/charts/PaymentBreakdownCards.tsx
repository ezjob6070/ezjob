
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";

interface PaymentBreakdownCardsProps {
  totalRevenue: number;
  technicianEarnings: number;
  totalExpenses: number;
  companyProfit: number;
  dateRangeText?: string;
}

const PaymentBreakdownCards: React.FC<PaymentBreakdownCardsProps> = ({
  totalRevenue,
  technicianEarnings,
  totalExpenses,
  companyProfit,
  dateRangeText
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Income</CardTitle>
          <CardDescription>
            Revenue from all technicians
            {dateRangeText && (
              <div className="text-xs mt-1 text-muted-foreground">{dateRangeText}</div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sky-600">{formatCurrency(totalRevenue)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
          <CardDescription>
            Technician payments and costs
            {dateRangeText && (
              <div className="text-xs mt-1 text-muted-foreground">{dateRangeText}</div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">-{formatCurrency(technicianEarnings + totalExpenses)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net Company Profit</CardTitle>
          <CardDescription>
            Revenue after all expenses
            {dateRangeText && (
              <div className="text-xs mt-1 text-muted-foreground">{dateRangeText}</div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(companyProfit)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentBreakdownCards;
