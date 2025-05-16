
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FinancialTransaction } from "@/types/finance";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import TransactionsSection from "@/components/finance/TransactionsSection";
import { DateRange } from "react-day-picker";
import DateRangeFilter from "@/components/finance/technician-filters/DateRangeFilter";

interface TransactionsDashboardProps {
  filteredTransactions: FinancialTransaction[];
}

const TransactionsDashboard: React.FC<TransactionsDashboardProps> = ({
  filteredTransactions: initialTransactions = [] // Add default empty array
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // Filter transactions by date range if selected
  const filteredTransactions = React.useMemo(() => {
    if (!dateRange?.from) return initialTransactions;
    
    return initialTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      if (dateRange.to) {
        return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
      }
      return transactionDate.toDateString() === dateRange.from.toDateString();
    });
  }, [initialTransactions, dateRange]);
  
  // Calculate totals for the dashboard cards
  const totalTransactions = filteredTransactions.length;
  
  const totalRevenue = filteredTransactions
    .filter(t => t.category === "payment" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = filteredTransactions
    .filter(t => t.category === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardDescription>Track payment flow and analyze patterns</CardDescription>
            </div>
            <DateRangeFilter date={dateRange} setDate={setDateRange} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-blue-50 h-[110px]">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium">Total Transactions</h3>
                <p className="text-2xl font-bold mt-1">{totalTransactions}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {dateRange?.from ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to ? dateRange.to.toLocaleDateString() : dateRange.from.toLocaleDateString()}` : 'all time'}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 h-[110px]">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium">Total Revenue</h3>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {dateRange?.from ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to ? dateRange.to.toLocaleDateString() : dateRange.from.toLocaleDateString()}` : 'all time'}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-red-50 h-[110px]">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium">Total Expenses</h3>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(totalExpenses)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {dateRange?.from ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to ? dateRange.to.toLocaleDateString() : dateRange.from.toLocaleDateString()}` : 'all time'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <TransactionsSection filteredTransactions={filteredTransactions} dateRange={dateRange} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsDashboard;
