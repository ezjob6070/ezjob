
import { useState } from "react";
import { SearchIcon, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import { FinancialTransaction } from "@/types/finance";
import { calculateTechnicianProfit } from "@/components/dashboard/DashboardUtils";

type TechnicianFinanceRecord = {
  technician: Technician;
  totalJobs: number;
  totalRevenue: number;
  technicianPayment: number;
  companyProfit: number;
};

type TechniciansFinanceProps = {
  technicians: Technician[];
  transactions: FinancialTransaction[];
};

const TechniciansFinance = ({ technicians, transactions }: TechniciansFinanceProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof TechnicianFinanceRecord>("totalRevenue");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Calculate financial metrics for each technician
  const technicianFinances: TechnicianFinanceRecord[] = technicians.map(technician => {
    // Filter transactions for this technician
    const technicianTransactions = transactions.filter(
      t => t.technicianName === technician.name && t.status === "completed" && t.category === "payment"
    );
    
    const totalJobs = technicianTransactions.length;
    const totalRevenue = technicianTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate technician payment based on their payment structure
    const technicianPayment = technicianTransactions.reduce((sum, t) => {
      if (t.technicianRate !== undefined) {
        return sum + calculateTechnicianProfit(
          t.amount, 
          t.technicianRate, 
          !!t.technicianRateIsPercentage
        );
      }
      return sum;
    }, 0);
    
    const companyProfit = totalRevenue - technicianPayment;
    
    return {
      technician,
      totalJobs,
      totalRevenue,
      technicianPayment,
      companyProfit
    };
  });

  // Filter by search term
  const filteredRecords = technicianFinances.filter(record => 
    record.technician.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }
    
    // Handle technician object differently
    if (sortColumn === "technician") {
      return sortDirection === "asc" 
        ? a.technician.name.localeCompare(b.technician.name)
        : b.technician.name.localeCompare(a.technician.name);
    }
    
    return 0;
  });

  const handleSort = (column: keyof TechnicianFinanceRecord) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc"); // Default to descending for new columns
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search technicians..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("technician")} className="cursor-pointer hover:bg-muted">
                <div className="flex items-center">
                  Technician Name
                  {sortColumn === "technician" && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("totalJobs")} className="cursor-pointer hover:bg-muted">
                <div className="flex items-center">
                  Jobs
                  {sortColumn === "totalJobs" && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("totalRevenue")} className="cursor-pointer hover:bg-muted">
                <div className="flex items-center">
                  Total Revenue
                  {sortColumn === "totalRevenue" && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("technicianPayment")} className="cursor-pointer hover:bg-muted">
                <div className="flex items-center">
                  Technician Payment
                  {sortColumn === "technicianPayment" && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("companyProfit")} className="cursor-pointer hover:bg-muted">
                <div className="flex items-center">
                  Company Profit
                  {sortColumn === "companyProfit" && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRecords.length > 0 ? (
              sortedRecords.map((record) => (
                <TableRow key={record.technician.id}>
                  <TableCell className="font-medium">{record.technician.name}</TableCell>
                  <TableCell>{record.totalJobs}</TableCell>
                  <TableCell>{formatCurrency(record.totalRevenue)}</TableCell>
                  <TableCell>{formatCurrency(record.technicianPayment)}</TableCell>
                  <TableCell>{formatCurrency(record.companyProfit)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No technician financial data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TechniciansFinance;
