
import React from "react";
import { FinancialTransaction } from "@/types/finance";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import TransactionHistory from "@/components/payments/TransactionHistory";

interface TransactionsSectionProps {
  filteredTransactions: FinancialTransaction[];
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  filteredTransactions,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
      <Card>
        <CardContent className="p-6">
          <TransactionHistory 
            transactions={filteredTransactions.slice(0, 5).map(t => ({
              id: t.id,
              date: t.date,
              amount: t.amount,
              client: t.clientName,
              job: t.jobTitle,
              status: t.status
            }))} 
            formatCurrency={formatCurrency} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsSection;
