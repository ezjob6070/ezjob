
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { JobSource, FinancialTransaction } from "@/types/finance";
import { initialTechnicians } from "@/data/technicians";
import { sampleTransactions } from "@/data/finances";

export const useFinanceData = () => {
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

  return {
    activeTab: "overview",
    setActiveTab: (tab: string) => {},
    date,
    setDate,
    transactions,
    activeTechnicians,
    selectedTechnician,
    selectedJobSource,
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    selectedTechnicians,
    selectedJobSources,
    jobSources,
    totalRevenue,
    totalExpenses,
    totalProfit,
    filteredTransactions,
    filteredJobSources,
    expenseCategories,
    technicianNames,
    jobSourceNames,
    toggleTechnician,
    toggleJobSource,
    clearFilters,
    applyFilters
  };
};
