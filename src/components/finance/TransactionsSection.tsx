
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search } from "lucide-react";
import { FinancialTransaction } from "@/types/finance";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

interface TransactionsSectionProps {
  filteredTransactions: FinancialTransaction[];
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({ filteredTransactions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Apply search filter
  const searchFilteredTransactions = filteredTransactions.filter(transaction => {
    const term = searchTerm.toLowerCase();
    return (
      transaction.clientName.toLowerCase().includes(term) ||
      transaction.jobTitle.toLowerCase().includes(term) ||
      transaction.id.toLowerCase().includes(term) ||
      (transaction.notes && transaction.notes.toLowerCase().includes(term)) ||
      (transaction.technicianName && transaction.technicianName.toLowerCase().includes(term)) ||
      transaction.category.toLowerCase().includes(term) ||
      transaction.status.toLowerCase().includes(term)
    );
  });

  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Recent Transactions</CardTitle>
        <CardDescription>Most recent financial activities</CardDescription>
        
        <div className="mt-2 relative">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by client, transaction ID, category..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="py-3">Date</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchFilteredTransactions.length > 0 ? (
                searchFilteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-gray-50">
                    <TableCell className="text-sm">
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
                    {searchTerm ? "No matching transactions found." : "No transactions found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {filteredTransactions.length > 0 && (
          <div className="flex justify-end mt-3">
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
