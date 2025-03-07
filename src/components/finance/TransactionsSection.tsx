
import React from "react";
import { FinancialTransaction } from "@/types/finance";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import TransactionHistory from "@/components/payments/TransactionHistory";
import PaymentForm from "@/components/payments/PaymentForm";

interface TransactionsSectionProps {
  filteredTransactions: FinancialTransaction[];
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  filteredTransactions,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div>
        <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
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
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4">Process Payment</h3>
        <Card>
          <CardContent className="p-6">
            <PaymentForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsSection;
