
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { TrendingUp, Users, Calculator, DollarSign } from "lucide-react";
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

  const cards = [
    {
      title: "Total Revenue",
      value: revenue,
      icon: <TrendingUp className="h-5 w-5 text-blue-700" />,
      bgColor: "bg-blue-100",
    },
    {
      title: "Technician Earnings",
      value: technicianEarnings,
      icon: <Users className="h-5 w-5 text-indigo-700" />,
      bgColor: "bg-indigo-100",
    },
    {
      title: "Expenses",
      value: expenses,
      icon: <Calculator className="h-5 w-5 text-red-700" />,
      bgColor: "bg-red-100",
    },
    {
      title: "Company Profit",
      value: profit,
      icon: <DollarSign className="h-5 w-5 text-green-700" />,
      bgColor: "bg-green-100",
    }
  ];

  return (
    <div>
      {dateRangeText && (
        <div className="mb-3 text-sm font-medium text-muted-foreground">
          Financial breakdown: {dateRangeText}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-2 ${card.bgColor} rounded-full`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-black">{card.title}</p>
                  <p className="text-2xl font-bold">{formatCurrency(card.value)}</p>
                  {dateRangeText && (
                    <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentBreakdownCards;
