
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { FinancialTransaction } from "@/types/finance";
import { Badge } from "@/components/ui/badge";

interface TransactionsSectionProps {
  filteredTransactions: FinancialTransaction[];
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  filteredTransactions
}) => {
  const getBadgeVariant = (category: string, status: string) => {
    if (status === "failed") return "destructive";
    if (status === "pending") return "outline";
    
    switch (category) {
      case "payment":
        return "success";
      case "expense":
        return "destructive";
      case "refund":
        return "warning";
      default:
        return "secondary";
    }
  };
  
  const getBadgeText = (category: string, status: string) => {
    if (status !== "completed") return status.charAt(0).toUpperCase() + status.slice(1);
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <CardDescription>Latest financial activity across all accounts</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1">
            View All
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {transaction.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell>{transaction.clientName}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{transaction.jobTitle}</TableCell>
                    <TableCell>{transaction.technicianName || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(transaction.category, transaction.status)}>
                        {getBadgeText(transaction.category, transaction.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className={
                      transaction.category === "expense" ? "text-right text-red-600" :
                      transaction.category === "refund" ? "text-right text-amber-600" :
                      "text-right text-green-600"
                    }>
                      {transaction.category === "expense" ? "-" : ""}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsSection;
