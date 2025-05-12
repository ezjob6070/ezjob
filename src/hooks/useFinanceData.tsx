
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
  
  // Initialize with empty data
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [activeTechnicians, setActiveTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>("all");
  const [selectedJobSource, setSelectedJobSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [selectedJobSources, setSelectedJobSources] = useState<string[]>([]);
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [activeQuoteTab, setActiveQuoteTab] = useState<string>("all");
  
  // Calculate total metrics from actual data
  const totalRevenue = jobSources.reduce((sum, source) => sum + (source.totalRevenue || 0), 0);
  const totalExpenses = jobSources.reduce((sum, source) => sum + (source.expenses || 0), 0);
  const totalProfit = jobSources.reduce((sum, source) => sum + (source.companyProfit || 0), 0);

  // Filter transactions based on actual data
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
  
  // Calculate expense categories from actual data
  const expenseCategories = [];

  // Get unique names from actual data
  const technicianNames = [...new Set(transactions
    .filter(t => t.technicianName)
    .map(t => t.technicianName as string))];

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
    activeTab,
    setActiveTab,
    activeQuoteTab,
    setActiveQuoteTab,
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
