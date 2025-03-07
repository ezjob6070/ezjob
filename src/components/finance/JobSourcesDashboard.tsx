import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { JobSource, FinancialTransaction } from "@/types/finance";
import { DonutChart } from "@/components/DonutChart";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import JobSourceFinanceSection from "@/components/finance/JobSourceFinanceSection";
import FinanceFiltersPanel from "@/components/finance/FinanceFiltersPanel";
import { DateRange } from "react-day-picker";

interface JobSourcesDashboardProps {
  filteredJobSources: JobSource[];
  filteredTransactions: FinancialTransaction[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const JobSourcesDashboard: React.FC<JobSourcesDashboardProps> = ({
  filteredJobSources,
  filteredTransactions,
  searchQuery,
  setSearchQuery
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobSources, setSelectedJobSources] = useState<string[]>([]);
  const [profitSearchQuery, setProfitSearchQuery] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [appliedFilters, setAppliedFilters] = useState(false);

  const jobSourceNames = filteredJobSources.map(source => source.name);

  const visibleJobSources = filteredJobSources.filter(source => {
    const matchesSelected = 
      !appliedFilters || 
      selectedJobSources.length === 0 || 
      selectedJobSources.includes(source.name);
    
    return matchesSelected;
  });

  const totalRevenue = visibleJobSources.reduce((sum, source) => sum + (source.totalRevenue || 0), 0);
  const totalProfit = visibleJobSources.reduce((sum, source) => sum + (source.companyProfit || 0), 0);
  const totalExpenses = visibleJobSources.reduce((sum, source) => sum + (source.expenses || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  const expenseCategories = [
    { name: "Marketing", value: totalExpenses * 0.4, color: "#f87171" },
    { name: "Platform Fees", value: totalExpenses * 0.3, color: "#22c55e" },
    { name: "Referral Costs", value: totalExpenses * 0.15, color: "#f97316" },
    { name: "Advertising", value: totalExpenses * 0.1, color: "#3b82f6" },
    { name: "Other", value: totalExpenses * 0.05, color: "#8b5cf6" },
  ];

  const revenueBreakdown = [
    { name: "Service Revenue", value: totalRevenue * 0.75, color: "#0ea5e9" },
    { name: "Parts & Materials", value: totalRevenue * 0.20, color: "#ec4899" },
    { name: "Diagnostic Fees", value: totalRevenue * 0.05, color: "#6366f1" },
  ];

  const profitBreakdown = [
    { name: "Operating Costs", value: totalProfit * 0.3, color: "#3b82f6" },
    { name: "Reinvestment", value: totalProfit * 0.25, color: "#10b981" },
    { name: "Owner Dividends", value: totalProfit * 0.30, color: "#f59e0b" },
    { name: "Taxes", value: totalProfit * 0.15, color: "#ef4444" },
  ];

  const topJobSources = [...visibleJobSources]
    .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
    .slice(0, 5);

  const filteredTopJobSources = topJobSources.filter(source =>
    profitSearchQuery === "" ||
    source.name.toLowerCase().includes(profitSearchQuery.toLowerCase())
  );

  const toggleJobSource = (sourceName: string) => {
    setSelectedJobSources(prev => 
      prev.includes(sourceName) 
        ? prev.filter(s => s !== sourceName)
        : [...prev, sourceName]
    );
  };

  const clearFilters = () => {
    setSelectedJobSources([]);
    setDate({
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
      to: new Date(),
    });
    setAppliedFilters(false);
  };

  const applyFilters = () => {
    setAppliedFilters(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search job sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-muted" : ""}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <FinanceFiltersPanel 
        showFilters={showFilters}
        technicianNames={[]}
        jobSourceNames={jobSourceNames}
        selectedTechnicians={[]}
        selectedJobSources={selectedJobSources}
        toggleTechnician={() => {}}
        toggleJobSource={toggleJobSource}
        clearFilters={clearFilters}
        date={date}
        setDate={setDate}
        applyFilters={applyFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Source of revenue streams</CardDescription>
            <div className="mt-2">
              <Input
                placeholder="Search in revenue breakdown..."
                value={profitSearchQuery}
                onChange={(e) => setProfitSearchQuery(e.target.value)}
                className="text-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={revenueBreakdown}
              title={formatCurrency(totalRevenue)}
              subtitle="Total Revenue"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Distribution of expenses by type</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={expenseCategories}
              title={formatCurrency(totalExpenses)}
              subtitle="Total Expenses"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Net Profit Breakdown</CardTitle>
            <CardDescription>How profit is distributed</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={profitBreakdown}
              title={formatCurrency(totalProfit)}
              subtitle="Net Profit"
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Total Net Profit</p>
              <p className="text-xl font-bold">{formatCurrency(netProfit)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Sources Performance</CardTitle>
          <CardDescription>Revenue and profit by job source</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source Name</TableHead>
                <TableHead className="text-right">Total Jobs</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">Profit Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleJobSources.map((source) => {
                const profit = source.companyProfit || 0;
                const revenue = source.totalRevenue || 0;
                const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
                
                return (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>{source.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{source.totalJobs}</TableCell>
                    <TableCell className="text-right">{formatCurrency(revenue)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(source.expenses || 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(profit)}</TableCell>
                    <TableCell className="text-right">{profitMargin.toFixed(1)}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <JobSourceFinanceSection 
        jobSources={visibleJobSources} 
        filteredTransactions={filteredTransactions} 
      />
    </div>
  );
};

export default JobSourcesDashboard;
