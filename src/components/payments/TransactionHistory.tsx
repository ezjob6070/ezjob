
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import DateRangeFilter from "@/components/finance/technician-filters/DateRangeFilter";
import CompactTechnicianFilter from "@/components/finance/technician-filters/CompactTechnicianFilter";

type Transaction = {
  id: string;
  date: Date;
  amount: number;
  client: string;
  job: string;
  status: string;
  technician?: string;
};

type TransactionHistoryProps = {
  transactions: Transaction[];
  formatCurrency: (amount: number) => string;
};

const TransactionHistory = ({ transactions, formatCurrency }: TransactionHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Extract unique technician names from transactions
  const technicianNames = Array.from(
    new Set(
      transactions
        .map(t => t.technician)
        .filter(Boolean) as string[]
    )
  );
  
  // Apply filters to transactions
  const filteredTransactions = transactions.filter(
    (transaction) => {
      // Text search filter
      const matchesSearch = 
        transaction.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.technician && 
          transaction.technician.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Date range filter
      const matchesDateRange = !dateRange || !dateRange.from 
        ? true 
        : dateRange.to
          ? transaction.date >= dateRange.from && transaction.date <= dateRange.to
          : transaction.date.toDateString() === dateRange.from.toDateString();
      
      // Technician filter
      const matchesTechnician = selectedTechnicians.length === 0 || 
        (transaction.technician && selectedTechnicians.includes(transaction.technician));
      
      return matchesSearch && matchesDateRange && matchesTechnician;
    }
  );

  const toggleTechnician = (techName: string) => {
    setSelectedTechnicians(prev => 
      prev.includes(techName)
        ? prev.filter(t => t !== techName)
        : [...prev, techName]
    );
  };

  const clearFilters = () => {
    setSelectedTechnicians([]);
    setDateRange(undefined);
  };

  const selectAllTechnicians = () => {
    setSelectedTechnicians([...technicianNames]);
  };

  const deselectAllTechnicians = () => {
    setSelectedTechnicians([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <FilterIcon className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline">Export</Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="bg-muted/20 p-4 rounded-md border space-y-4">
            <h3 className="text-sm font-medium mb-2">Filter Transactions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Date Range</h4>
                <DateRangeFilter date={dateRange} setDate={setDateRange} />
              </div>
              
              {technicianNames.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Technician</h4>
                  <CompactTechnicianFilter
                    technicianNames={technicianNames}
                    selectedTechnicians={selectedTechnicians}
                    toggleTechnician={toggleTechnician}
                    clearFilters={deselectAllTechnicians}
                    applyFilters={() => {}}
                    selectAllTechnicians={selectAllTechnicians}
                    deselectAllTechnicians={deselectAllTechnicians}
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Job</TableHead>
              {technicianNames.length > 0 && <TableHead>Technician</TableHead>}
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.client}</TableCell>
                  <TableCell>{transaction.job}</TableCell>
                  {technicianNames.length > 0 && (
                    <TableCell>{transaction.technician || "N/A"}</TableCell>
                  )}
                  <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === "completed" ? "default" : "outline"}>
                      {transaction.status === "completed" ? "Completed" : "Pending"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={technicianNames.length > 0 ? 6 : 5} className="text-center py-4 text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionHistory;
