
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { FinancialTransaction } from "@/types/finance";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { 
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  RotateCcwIcon,
  CalendarIcon,
  ClockIcon, 
  CircleAlertIcon,
  CheckCircle2Icon
} from "lucide-react";

interface TransactionsSectionProps {
  transactions: FinancialTransaction[];
  dateRange?: DateRange;
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({ 
  transactions,
  dateRange
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "payments" | "expenses" | "refunds">("all");
  
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === "payments") return transaction.category === "payment";
    if (activeTab === "expenses") return transaction.category === "expense";
    if (activeTab === "refunds") return transaction.category === "refund";
    return true;
  });
  
  // Most recent transactions
  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Calculate summary stats
  const totalPayments = transactions
    .filter(t => t.category === "payment")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.category === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalRefunds = transactions
    .filter(t => t.category === "refund")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netAmount = totalPayments - totalExpenses - totalRefunds;
  
  // Category icon mapping
  const getCategoryIcon = (transaction: FinancialTransaction) => {
    if (transaction.category === "payment") return <ArrowUpRightIcon className="h-4 w-4 text-green-500" />;
    if (transaction.category === "expense") return <ArrowDownLeftIcon className="h-4 w-4 text-red-500" />;
    return <RotateCcwIcon className="h-4 w-4 text-amber-500" />;
  };
  
  // Status icon mapping
  const getStatusIcon = (transaction: FinancialTransaction) => {
    if (transaction.status === "completed") return <CheckCircle2Icon className="h-4 w-4 text-green-500" />;
    if (transaction.status === "pending") return <ClockIcon className="h-4 w-4 text-amber-500" />;
    if (transaction.status === "cancelled") return <CircleAlertIcon className="h-4 w-4 text-red-500" />;
    return <ClockIcon className="h-4 w-4 text-gray-500" />;
  };
  
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          {dateRange?.from && dateRange?.to 
            ? `Showing transactions from ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`
            : 'Showing all transactions'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">Total Payments</div>
              <div className="text-xl font-bold text-green-600">{formatCurrency(totalPayments)}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">Total Expenses</div>
              <div className="text-xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">Total Refunds</div>
              <div className="text-xl font-bold text-amber-600">{formatCurrency(totalRefunds)}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">Net Amount</div>
              <div className="text-xl font-bold text-blue-600">{formatCurrency(netAmount)}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-slate-600">Recent transactions</h4>
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                        {getCategoryIcon(transaction)}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" /> 
                          {new Date(transaction.date).toLocaleDateString()}
                          <span className="mx-1">•</span>
                          {getStatusIcon(transaction)} {transaction.status}
                        </div>
                      </div>
                    </div>
                    <div className={`font-medium ${
                      transaction.category === "payment" 
                        ? "text-green-600" 
                        : transaction.category === "expense" 
                        ? "text-red-600" 
                        : "text-amber-600"
                    }`}>
                      {transaction.category === "payment" && "+"}
                      {transaction.category === "expense" && "-"}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No recent transactions found
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsSection;
