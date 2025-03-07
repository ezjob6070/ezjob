
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BarChart3, 
  Users, 
  FileText, 
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { JobSource, FinancialTransaction } from "@/types/finance";
import { initialTechnicians } from "@/data/technicians";
import { sampleTransactions, filterTransactionsByDateRange } from "@/data/finances";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import OverallFinanceSection from "@/components/finance/OverallFinanceSection";
import JobSourceFinanceSection from "@/components/finance/JobSourceFinanceSection";
import TechnicianFinanceSection from "@/components/finance/TechnicianFinanceSection";
import TransactionsSection from "@/components/finance/TransactionsSection";
import { DonutChart } from "@/components/DonutChart";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tabOptions = [
  { id: "overview", label: "Overview", icon: <BarChart3 className="h-5 w-5" /> },
  { id: "jobSources", label: "Job Sources", icon: <FileText className="h-5 w-5" /> },
  { id: "technicians", label: "Technicians", icon: <Users className="h-5 w-5" /> },
  { id: "transactions", label: "Transactions", icon: <CreditCard className="h-5 w-5" /> },
];

const Finance = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  
  // Initialize data
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(sampleTransactions);
  const [activeTechnicians, setActiveTechnicians] = useState(initialTechnicians.filter(tech => tech.status === "active"));
  const [selectedTechnician, setSelectedTechnician] = useState<string>("all");
  const [selectedJobSource, setSelectedJobSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [selectedJobSources, setSelectedJobSources] = useState<string[]>([]);
  
  // Prepare job sources with financial data
  const [jobSources, setJobSources] = useState<JobSource[]>([
    {
      id: "js1",
      name: "Website",
      totalJobs: 120,
      totalRevenue: 55000,
      expenses: 12000,
      companyProfit: 23000,
      createdAt: new Date(),
    },
    {
      id: "js2", 
      name: "Referral",
      totalJobs: 80,
      totalRevenue: 40000,
      expenses: 8000,
      companyProfit: 18000,
      createdAt: new Date(),
    },
    {
      id: "js3",
      name: "Google Ads",
      totalJobs: 150,
      totalRevenue: 70000,
      expenses: 25000,
      companyProfit: 30000,
      createdAt: new Date(),
    },
    {
      id: "js4",
      name: "Social Media",
      totalJobs: 65,
      totalRevenue: 32000,
      expenses: 10000,
      companyProfit: 12000,
      createdAt: new Date(),
    },
    {
      id: "js5",
      name: "Direct Call",
      totalJobs: 95,
      totalRevenue: 48000,
      expenses: 9000,
      companyProfit: 22000,
      createdAt: new Date(),
    },
  ]);
  
  // Calculate total metrics
  const totalRevenue = jobSources.reduce((sum, source) => sum + (source.totalRevenue || 0), 0);
  const totalExpenses = jobSources.reduce((sum, source) => sum + (source.expenses || 0), 0);
  const totalProfit = jobSources.reduce((sum, source) => sum + (source.companyProfit || 0), 0);

  // Navigate between tabs
  const navigateTab = (direction: 'prev' | 'next') => {
    const currentIndex = tabOptions.findIndex(tab => tab.id === activeTab);
    if (direction === 'prev' && currentIndex > 0) {
      setActiveTab(tabOptions[currentIndex - 1].id);
    } else if (direction === 'next' && currentIndex < tabOptions.length - 1) {
      setActiveTab(tabOptions[currentIndex + 1].id);
    }
  };

  // Filter transactions based on date range
  const filteredTransactions = transactions.filter(
    (transaction) => 
      date?.from && date?.to && 
      transaction.date >= date.from && 
      transaction.date <= date.to &&
      (selectedTechnicians.length === 0 || 
        (transaction.technicianName && selectedTechnicians.includes(transaction.technicianName))) &&
      (selectedJobSources.length === 0 || 
        (transaction.jobSourceName && selectedJobSources.includes(transaction.jobSourceName))) &&
      (searchQuery === "" || 
        transaction.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (transaction.technicianName && 
         transaction.technicianName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (transaction.jobSourceName && 
         transaction.jobSourceName.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Filter job sources based on selection
  const filteredJobSources = jobSources.filter(source => 
    selectedJobSources.length === 0 || selectedJobSources.includes(source.name)
  );
  
  // Compile expense categories for the expense breakdown
  const expenseCategories = [
    { name: "Technician Payments", value: totalRevenue * 0.4, color: "#10b981" },
    { name: "Marketing", value: totalExpenses * 0.3, color: "#f97316" },
    { name: "Equipment", value: totalExpenses * 0.2, color: "#f43f5e" },
    { name: "Office", value: totalExpenses * 0.1, color: "#8b5cf6" },
    { name: "Other", value: totalExpenses * 0.1, color: "#64748b" },
  ];

  // Get unique technician names from transactions
  const technicianNames = [...new Set(transactions
    .filter(t => t.technicianName)
    .map(t => t.technicianName as string))];

  // Get unique job source names from transactions
  const jobSourceNames = [...new Set(transactions
    .filter(t => t.jobSourceName)
    .map(t => t.jobSourceName as string))];

  // Toggle technician selection
  const toggleTechnician = (techName: string) => {
    setSelectedTechnicians(prev => 
      prev.includes(techName) 
        ? prev.filter(t => t !== techName)
        : [...prev, techName]
    );
  };

  // Toggle job source selection
  const toggleJobSource = (sourceName: string) => {
    setSelectedJobSources(prev => 
      prev.includes(sourceName) 
        ? prev.filter(s => s !== sourceName)
        : [...prev, sourceName]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTechnicians([]);
    setSelectedJobSources([]);
    setSearchQuery("");
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Finance</h2>
          <p className="text-muted-foreground">
            Track your company finances and generate reports.
          </p>
        </div>
      </div>

      {/* Top Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigateTab('prev')}
              disabled={activeTab === tabOptions[0].id}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex rounded-md shadow-sm">
              {tabOptions.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  className={`flex gap-2 ${activeTab === tab.id ? "" : "hover:bg-gray-50"}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </Button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigateTab('next')}
              disabled={activeTab === tabOptions[tabOptions.length - 1].id}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-blue-50" : ""}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <DateRangeSelector date={date} setDate={setDate} />
          </div>
        </div>
        
        {/* Expanded Filters */}
        {showFilters && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Filter by Technician</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {technicianNames.map((techName) => (
                      <div key={techName} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`tech-${techName}`} 
                          checked={selectedTechnicians.includes(techName)}
                          onCheckedChange={() => toggleTechnician(techName)}
                        />
                        <label 
                          htmlFor={`tech-${techName}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {techName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Filter by Job Source</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {jobSourceNames.map((sourceName) => (
                      <div key={sourceName} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`source-${sourceName}`} 
                          checked={selectedJobSources.includes(sourceName)}
                          onCheckedChange={() => toggleJobSource(sourceName)}
                        />
                        <label 
                          htmlFor={`source-${sourceName}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {sourceName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Active Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <OverallFinanceSection 
            totalRevenue={totalRevenue} 
            totalExpenses={totalExpenses} 
            totalProfit={totalProfit} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profit Breakdown</CardTitle>
                <CardDescription>Distribution of revenue and costs</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <DonutChart
                  data={[
                    { name: "Company Profit", value: totalProfit, color: "#8b5cf6" },
                    { name: "Expenses", value: totalExpenses, color: "#f87171" },
                  ]}
                  title={formatCurrency(totalProfit)}
                  subtitle="Company Profit"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expenses Breakdown</CardTitle>
                <CardDescription>Distribution of expenses by type</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <DonutChart
                  data={expenseCategories}
                  title={formatCurrency(totalExpenses)}
                  subtitle="Total Expenses"
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Job Sources</CardTitle>
              <CardDescription>Best performing job sources by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Source Name</TableHead>
                    <TableHead className="text-right">Jobs</TableHead>
                    <TableHead className="text-right">Total Revenue</TableHead>
                    <TableHead className="text-right">Source Cost</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Company Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobSources
                    .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
                    .slice(0, 5)
                    .map((source) => (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span>{source.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{source.totalJobs}</TableCell>
                        <TableCell className="text-right">{formatCurrency(source.totalRevenue || 0)}</TableCell>
                        <TableCell className="text-right">{formatCurrency((source.expenses || 0) * 0.4)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(source.expenses || 0)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(source.companyProfit || 0)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <TransactionsSection filteredTransactions={filteredTransactions.slice(0, 5)} />
        </div>
      )}

      {activeTab === "jobSources" && (
        <div className="space-y-8">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Job Sources Performance</CardTitle>
              <CardDescription>Revenue and profit by job source</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-sm font-medium mb-4">Revenue Distribution</h3>
                  <DonutChart
                    data={filteredJobSources.map((source, index) => ({
                      name: source.name,
                      value: source.totalRevenue || 0,
                      color: [`#8b5cf6`, `#ec4899`, `#f97316`, `#22c55e`, `#3b82f6`][index % 5]
                    }))}
                    title={formatCurrency(filteredJobSources.reduce((sum, source) => sum + (source.totalRevenue || 0), 0))}
                    subtitle="Total Revenue"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-4">Profit Distribution</h3>
                  <DonutChart
                    data={filteredJobSources.map((source, index) => ({
                      name: source.name,
                      value: source.companyProfit || 0,
                      color: [`#8b5cf6`, `#ec4899`, `#f97316`, `#22c55e`, `#3b82f6`][index % 5]
                    }))}
                    title={formatCurrency(filteredJobSources.reduce((sum, source) => sum + (source.companyProfit || 0), 0))}
                    subtitle="Total Profit"
                  />
                </div>
              </div>
              
              <Input
                className="mb-4"
                placeholder="Search job sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <JobSourceFinanceSection 
                jobSources={filteredJobSources} 
                filteredTransactions={filteredTransactions} 
              />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "technicians" && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Technician Performance</CardTitle>
              <CardDescription>Financial metrics for technicians</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Input
                  className="mb-4"
                  placeholder="Search technicians..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                <TechnicianFinanceSection 
                  activeTechnicians={activeTechnicians.filter(tech => 
                    searchQuery === "" || 
                    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    tech.specialty.toLowerCase().includes(searchQuery.toLowerCase())
                  )} 
                />
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Technician Expense Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeTechnicians.slice(0, 3).map(tech => (
                    <Card key={tech.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{tech.name}</CardTitle>
                        <CardDescription>{tech.specialty}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Revenue:</span>
                          <span className="font-medium">{formatCurrency(tech.totalRevenue)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Expenses:</span>
                          <span className="font-medium">{formatCurrency(tech.totalRevenue * 0.35)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Profit:</span>
                          <span className="font-medium">{formatCurrency(tech.totalRevenue * 0.65)}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="ghost" size="sm" className="w-full">View Details</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "transactions" && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Analysis</CardTitle>
              <CardDescription>Track payment flow and analyze patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium">Total Transactions</h3>
                    <p className="text-3xl font-bold mt-2">{filteredTransactions.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">in selected period</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium">Total Revenue</h3>
                    <p className="text-3xl font-bold mt-2">
                      {formatCurrency(
                        filteredTransactions
                          .filter(t => t.category === "payment" && t.status === "completed")
                          .reduce((sum, t) => sum + t.amount, 0)
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">from completed payments</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium">Total Expenses</h3>
                    <p className="text-3xl font-bold mt-2">
                      {formatCurrency(
                        filteredTransactions
                          .filter(t => t.category === "expense" && t.status === "completed")
                          .reduce((sum, t) => sum + t.amount, 0)
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">from expense transactions</p>
                  </CardContent>
                </Card>
              </div>
              
              <TransactionsSection filteredTransactions={filteredTransactions} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Finance;
