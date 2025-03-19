
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { FinancialTransaction } from "@/types/finance";
import { format } from "date-fns";

interface TransactionsSectionProps {
  filteredTransactions: FinancialTransaction[];
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  filteredTransactions
}) => {
  // Function to get the badge variant based on transaction type
  const getTransactionBadgeVariant = (category: string): "default" | "outline" | "destructive" | "secondary" | "success" => {
    switch (category) {
      case "payment":
        return "success";
      case "expense":
        return "destructive";
      case "refund":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Function to get transaction icon based on category
  const getTransactionIcon = (category: string) => {
    switch (category) {
      case "payment":
        return "↑";
      case "expense":
        return "↓";
      case "refund":
        return "↩";
      default:
        return "•";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {format(new Date(transaction.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant={getTransactionBadgeVariant(transaction.category)}>
                      {getTransactionIcon(transaction.category)} {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right ${
                    transaction.category === "payment" ? "text-green-600" : 
                    transaction.category === "expense" ? "text-red-600" : 
                    transaction.category === "refund" ? "text-amber-600" : ""
                  }`}>
                    {transaction.category === "expense" ? "-" : ""}{formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No recent transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionsSection;
