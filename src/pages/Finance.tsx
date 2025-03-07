
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  FileText, 
  CreditCard,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { JobSource, FinancialTransaction } from "@/types/finance";
import { initialTechnicians } from "@/data/technicians";
import { sampleTransactions } from "@/data/finances";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import OverallFinanceSection from "@/components/finance/OverallFinanceSection";
import JobSourceFinanceSection from "@/components/finance/JobSourceFinanceSection";
import TechnicianFinanceSection from "@/components/finance/TechnicianFinanceSection";
import TransactionsSection from "@/components/finance/TransactionsSection";
import { DonutChart } from "@/components/DonutChart";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

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
      transaction.date <= date.to
  );

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
          
          <DateRangeSelector date={date} setDate={setDate} />
        </div>
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
                <CardTitle>Top Job Sources</CardTitle>
                <CardDescription>Best performing job sources by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobSources
                    .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
                    .slice(0, 5)
                    .map((source, index) => (
                      <div key={source.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span>{source.name}</span>
                        </div>
                        <div className="text-sm font-medium">
                          {formatCurrency(source.totalRevenue || 0)}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <TransactionsSection filteredTransactions={filteredTransactions.slice(0, 5)} />
        </div>
      )}

      {activeTab === "jobSources" && (
        <JobSourceFinanceSection 
          jobSources={jobSources} 
          filteredTransactions={filteredTransactions} 
        />
      )}

      {activeTab === "technicians" && (
        <TechnicianFinanceSection 
          activeTechnicians={activeTechnicians} 
        />
      )}

      {activeTab === "transactions" && (
        <TransactionsSection 
          filteredTransactions={filteredTransactions} 
        />
      )}
    </div>
  );
};

export default Finance;
