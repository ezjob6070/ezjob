import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { TrendingUp, Users, Calculator, DollarSign } from "lucide-react";
import { Technician } from "@/types/technician";

interface PaymentBreakdownCardsProps {
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
      const totalRevenue = technicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);
      const totalEarnings = technicians.reduce((sum, tech) => 
        sum + tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1), 0
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
      value: formatCurrency(revenue),
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-50 text-blue-700",
      iconColor: "bg-blue-100"
    },
    {
      title: "Technician Earnings",
      value: formatCurrency(technicianEarnings),
      icon: <Users className="h-5 w-5 text-indigo-500" />,
      color: "bg-indigo-50 text-indigo-700",
      iconColor: "bg-indigo-100"
    },
    {
      title: "Expenses",
      value: formatCurrency(expenses),
      icon: <Calculator className="h-5 w-5 text-red-500" />,
      color: "bg-red-50 text-red-700",
      iconColor: "bg-red-100"
    },
    {
      title: "Company Profit",
      value: formatCurrency(profit),
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      color: "bg-green-50 text-green-700",
      iconColor: "bg-green-100"
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
          <Card key={index} className={`border-l-4 border-l-${card.color.split(' ')[0].replace('bg-', '')}-400`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`p-2 rounded-full ${card.iconColor}`}>
                  {card.icon}
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
