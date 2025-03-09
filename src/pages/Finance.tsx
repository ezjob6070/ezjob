import { useState, useEffect } from "react";
import { BarChart3, Users, FileText, CreditCard } from "lucide-react";
import { DateRange } from "react-day-picker";
import { JobSource, FinancialTransaction } from "@/types/finance";
import { initialTechnicians } from "@/data/technicians";
import { sampleTransactions } from "@/data/finances";

// Imported components
import FinanceHeader from "@/components/finance/FinanceHeader";
import FinanceFiltersPanel from "@/components/finance/FinanceFiltersPanel";
import OverviewDashboard from "@/components/finance/OverviewDashboard";
import JobSourcesDashboard from "@/components/finance/JobSourcesDashboard";
import TechniciansDashboard from "@/components/finance/TechniciansDashboard";
import TransactionsDashboard from "@/components/finance/TransactionsDashboard";

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

  // Apply filters
  const applyFilters = () => {
    setShowFilters(false);
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Finance</h2>
          <p className="text-muted-foreground">
            Track your company finances and generate reports.
          </p>
        </div>
      </div>

      {/* Top Navigation */}
      <FinanceHeader 
        tabOptions={tabOptions}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        date={date}
        setDate={setDate}
      />
      
      {/* Filters Panel */}
      <FinanceFiltersPanel 
        showFilters={showFilters}
        technicianNames={technicianNames}
        jobSourceNames={jobSourceNames}
        selectedTechnicians={selectedTechnicians}
        selectedJobSources={selectedJobSources}
        toggleTechnician={toggleTechnician}
        toggleJobSource={toggleJobSource}
        clearFilters={clearFilters}
        setShowFilters={setShowFilters}
        applyFilters={applyFilters}
      />

      {/* Active Tab Content */}
      {activeTab === "overview" && (
        <OverviewDashboard 
          totalRevenue={totalRevenue}
          totalExpenses={totalExpenses}
          totalProfit={totalProfit}
          jobSources={jobSources}
          filteredTransactions={filteredTransactions}
          expenseCategories={expenseCategories}
          date={date}
          setDate={setDate}
        />
      )}

      {activeTab === "jobSources" && (
        <JobSourcesDashboard 
          filteredJobSources={filteredJobSources}
          filteredTransactions={filteredTransactions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      {activeTab === "technicians" && (
        <TechniciansDashboard 
          activeTechnicians={activeTechnicians}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      {activeTab === "transactions" && (
        <TransactionsDashboard 
          filteredTransactions={filteredTransactions}
        />
      )}
    </div>
  );
};

export default Finance;
