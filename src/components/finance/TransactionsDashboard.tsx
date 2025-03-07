
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FinancialTransaction } from "@/types/finance";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import TransactionsSection from "@/components/finance/TransactionsSection";

interface TransactionsDashboardProps {
  filteredTransactions: FinancialTransaction[];
}

const TransactionsDashboard: React.FC<TransactionsDashboardProps> = ({
  filteredTransactions
}) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Analysis</CardTitle>
          <CardDescription>Track payment flow and analyze patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium">Total Transactions</h3>
                <p className="text-3xl font-bold mt-2">{filteredTransactions.length}</p>
                <p className="text-sm text-muted-foreground mt-1">in selected period</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium">Total Revenue</h3>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(
                    filteredTransactions
                      .filter(t => t.category === "payment" && t.status === "completed")
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-1">from completed payments</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium">Total Expenses</h3>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(
                    filteredTransactions
                      .filter(t => t.category === "expense" && t.status === "completed")
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-1">from expense transactions</p>
              </CardContent>
            </Card>
          </div>
          
          <TransactionsSection filteredTransactions={filteredTransactions} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsDashboard;
