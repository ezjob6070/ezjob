import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";

export interface PaymentBreakdownCardsProps {
  revenue?: number;
  technicianEarnings?: number;
  expenses?: number;
  profit?: number;
  dateRangeText?: string;
  technicians?: Technician[];
}

const PaymentBreakdownCards: React.FC<PaymentBreakdownCardsProps> = ({
  revenue: externalRevenue,
  technicianEarnings: externalEarnings,
  expenses: externalExpenses,
  profit: externalProfit,
  dateRangeText = "",
  technicians = []
}) => {
  const calculatedMetrics = useMemo(() => {
    if (technicians.length > 0 && externalRevenue === undefined) {
      const totalRevenue = technicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
      const totalEarnings = technicians.reduce((sum, tech) => 
        sum + (tech.totalRevenue || 0) * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1), 0
      );
      const totalExpenses = totalRevenue * 0.33;
      const totalProfit = totalRevenue - totalEarnings - totalExpenses;
      
      return {
        revenue: totalRevenue,
        technicianEarnings: totalEarnings,
        expenses: totalExpenses,
        profit: totalProfit
      };
    }
    
    return {
      revenue: externalRevenue || 0,
      technicianEarnings: externalEarnings || 0,
      expenses: externalExpenses || 0,
      profit: externalProfit || 0
    };
  }, [technicians, externalRevenue, externalEarnings, externalExpenses, externalProfit]);
  
  const { revenue, technicianEarnings, expenses, profit } = calculatedMetrics;

  return (
    <div>
      {dateRangeText && (
        <div className="mb-3 text-sm font-medium text-muted-foreground">
          Financial breakdown: {dateRangeText}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-black">Total Revenue</p>
              <p className="text-2xl font-bold text-sky-600">
                {formatCurrency(revenue)}
              </p>
              {dateRangeText && (
                <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-black">Technician Earnings</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(technicianEarnings)}
              </p>
              {dateRangeText && (
                <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-black">Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(expenses)}
              </p>
              {dateRangeText && (
                <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-black">Company Profit</p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(profit)}
              </p>
              {dateRangeText && (
                <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentBreakdownCards;
