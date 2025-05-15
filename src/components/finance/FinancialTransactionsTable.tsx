import { useState } from "react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FinancialTransaction } from "@/types/finance";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";

interface FinancialTransactionsTableProps {
  transactions: FinancialTransaction[];
  searchTerm: string;
}

type SortField = "date" | "amount" | "clientName" | "jobTitle" | "category" | "status";
type SortDirection = "asc" | "desc";

const FinancialTransactionsTable = ({ 
  transactions, 
  searchTerm 
}: FinancialTransactionsTableProps) => {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (transaction.clientName && transaction.clientName.toLowerCase().includes(searchTermLower)) ||
      (transaction.jobTitle && transaction.jobTitle.toLowerCase().includes(searchTermLower)) ||
      (transaction.technicianName && transaction.technicianName.toLowerCase().includes(searchTermLower)) ||
      transaction.category.toLowerCase().includes(searchTermLower) ||
      transaction.status.toLowerCase().includes(searchTermLower)
    );
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const factor = sortDirection === "asc" ? 1 : -1;
    
    switch (sortField) {
      case "date":
        return factor * (new Date(a.date).getTime() - new Date(b.date).getTime());
      case "amount":
        return factor * (a.amount - b.amount);
      case "clientName":
        return factor * ((a.clientName || "").localeCompare(b.clientName || ""));
      case "jobTitle":
        return factor * ((a.jobTitle || "").localeCompare(b.jobTitle || ""));
      case "category":
        return factor * a.category.localeCompare(b.category);
      case "status":
        return factor * a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? 
      <ChevronUpIcon className="ml-2 h-4 w-4" /> : 
      <ChevronDownIcon className="ml-2 h-4 w-4" />;
  };

  const getCategoryColor = (category: FinancialTransaction["category"]) => {
    switch (category) {
      case "payment":
        return "bg-green-100 text-green-800";
      case "expense":
        return "bg-red-100 text-red-800";
      case "refund":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: FinancialTransaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
              <div className="flex items-center">
                Date {getSortIcon("date")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("clientName")}>
              <div className="flex items-center">
                Client {getSortIcon("clientName")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("jobTitle")}>
              <div className="flex items-center">
                Job {getSortIcon("jobTitle")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => handleSort("amount")}>
              <div className="flex items-center justify-end">
                Amount {getSortIcon("amount")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
              <div className="flex items-center">
                Category {getSortIcon("category")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
              <div className="flex items-center">
                Status {getSortIcon("status")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {format(transaction.date, "MMM d, yyyy")}
                </TableCell>
                <TableCell>{transaction.clientName || "—"}</TableCell>
                <TableCell>{transaction.jobTitle || "—"}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getCategoryColor(transaction.category)}>
                    {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(transaction.status)}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FinancialTransactionsTable;
