
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { FinancialTransaction } from "@/types/finance";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { format } from "date-fns";

interface TransactionsSectionProps {
  filteredTransactions: FinancialTransaction[];
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({ filteredTransactions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Most recent financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {transaction.date ? 
                      format(new Date(transaction.date), "MMM d, yyyy") : 
                      "N/A"
                    }
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.jobTitle}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.notes || "No details provided"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        transaction.status === "completed"
                          ? "bg-green-500"
                          : transaction.status === "pending"
                          ? "bg-yellow-500"
                          : transaction.status === "failed"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        transaction.amount >= 0
                          ? "text-emerald-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {transaction.amount >= 0 ? "+" : "-"}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {filteredTransactions.length > 0 && (
          <div className="flex justify-end mt-4">
            <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
              View All Transactions
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsSection;
