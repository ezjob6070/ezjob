
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FinancialTransaction } from "@/types/finance";
import { sampleTransactions } from "@/data/finances";
import { initialTechnicians } from "@/data/technicians";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import TransactionsSection from "@/components/finance/TransactionsSection";

const FinanceTransactions = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(sampleTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<FinancialTransaction[]>([]);
  const [activeTechnicians, setActiveTechnicians] = useState(initialTechnicians.filter(tech => tech.status === "active"));
  const [selectedTechnician, setSelectedTechnician] = useState<string>("all");
  const [selectedJobSource, setSelectedJobSource] = useState<string>("all");
  const [jobSourceNames, setJobSourceNames] = useState<string[]>([
    "Website", "Referral", "Google Ads", "Social Media", "Direct Call"
  ]);

  useEffect(() => {
    if (date?.from && date?.to) {
      // First filter by date
      let filtered = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= date.from && transactionDate <= date.to;
      });

      // Then apply additional filters if selected
      if (selectedTechnician !== "all") {
        filtered = filtered.filter(transaction => 
          transaction.technicianName === selectedTechnician
        );
      }

      if (selectedJobSource !== "all") {
        filtered = filtered.filter(transaction => 
          transaction.jobSourceName === selectedJobSource
        );
      }

      setFilteredTransactions(filtered);
    }
  }, [date, transactions, selectedTechnician, selectedJobSource]);

  // Get technician names for filter
  const technicianNames = activeTechnicians.map(tech => tech.name);

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/finance">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
          </div>
          <p className="text-muted-foreground">
            View recent financial transactions and payment history.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <DateRangeSelector date={date} setDate={setDate} />
          
          <div className="flex flex-col gap-2 w-full md:w-64">
            <Label htmlFor="technician-filter">Technician</Label>
            <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
              <SelectTrigger id="technician-filter">
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technicians</SelectItem>
                {technicianNames.map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-2 w-full md:w-64">
            <Label htmlFor="jobsource-filter">Job Source</Label>
            <Select value={selectedJobSource} onValueChange={setSelectedJobSource}>
              <SelectTrigger id="jobsource-filter">
                <SelectValue placeholder="Select job source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Job Sources</SelectItem>
                {jobSourceNames.map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <TransactionsSection 
        filteredTransactions={filteredTransactions} 
      />
    </div>
  );
};

export default FinanceTransactions;
