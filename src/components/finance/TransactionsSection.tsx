
import React, { useState } from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { FinancialTransaction } from "@/types/finance";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Download, 
  Printer, 
  FileEdit, 
  Trash2, 
  ArrowDownUp,
  FilterX
} from "lucide-react";

interface TransactionsSectionProps {
  filteredTransactions: FinancialTransaction[];
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  filteredTransactions,
}) => {
  const [sortField, setSortField] = useState<keyof FinancialTransaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Function to format dates
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  
  // Status badge styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Category badge styles
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "payment":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Payment</Badge>;
      case "expense":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Expense</Badge>;
      case "refund":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Refund</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };
  
  // Sort function
  const sortTransactions = (a: FinancialTransaction, b: FinancialTransaction) => {
    if (sortField === "date") {
      return sortDirection === "asc" 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    if (sortField === "amount") {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
    
    if (sortField === "clientName") {
      return sortDirection === "asc"
        ? a.clientName.localeCompare(b.clientName)
        : b.clientName.localeCompare(a.clientName);
    }
    
    return 0;
  };
  
  // Toggle sort
  const toggleSort = (field: keyof FinancialTransaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  // Calculate totals
  const totalAmount = filteredTransactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => {
      if (t.category === "payment") return sum + t.amount;
      if (t.category === "expense") return sum - t.amount;
      if (t.category === "refund") return sum - t.amount;
      return sum;
    }, 0);
  
  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort(sortTransactions);
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Transactions</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowDownUp className="h-4 w-4" />
            <span>Sort</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FilterX className="h-4 w-4" />
            <span>Reset</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/30 p-3 rounded-lg mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Transactions</p>
            <p className="text-lg font-semibold">{filteredTransactions.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Net Amount</p>
            <p className={`text-lg font-semibold ${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date Range</p>
            <p className="text-lg font-semibold">
              {filteredTransactions.length > 0
                ? `${formatDate(
                    new Date(Math.min(...filteredTransactions.map(t => t.date.getTime())))
                  )} - ${formatDate(
                    new Date(Math.max(...filteredTransactions.map(t => t.date.getTime())))
                  )}`
                : "No transactions"}
            </p>
          </div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => toggleSort("date")}
              >
                Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => toggleSort("clientName")}
              >
                Client {sortField === "clientName" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Job Source</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 text-right"
                onClick={() => toggleSort("amount")}
              >
                Amount {sortField === "amount" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>{transaction.clientName}</TableCell>
                  <TableCell>{transaction.jobTitle}</TableCell>
                  <TableCell>
                    {transaction.technicianName || "N/A"}
                  </TableCell>
                  <TableCell>
                    {transaction.jobSourceName || "N/A"}
                  </TableCell>
                  <TableCell>
                    {getCategoryBadge(transaction.category)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(transaction.status)}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.category === "payment" 
                      ? "text-green-600" 
                      : "text-red-600"
                  }`}>
                    {transaction.category === "payment" 
                      ? formatCurrency(transaction.amount) 
                      : `-${formatCurrency(transaction.amount)}`}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <FileEdit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="h-4 w-4 mr-2" />
                          Print Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                  No transactions found for the selected filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionsSection;
