
import { useState, useMemo } from "react";
import { 
  format, 
  isWithinInterval, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  isSameDay,
  isAfter,
  isBefore
} from "date-fns";
import { FinancialTransaction } from "@/types/finance";
import { FinanceFilters, DateFilterType, FilteredTransactionsResult } from "./FinanceFilterTypes";

export const useFinanceFilters = (transactions: FinancialTransaction[]) => {
  const [filters, setFilters] = useState<FinanceFilters>({
    searchTerm: "",
    jobSourceFilter: "",
    dateFilter: "all",
    customDateRange: {
      from: undefined,
      to: undefined
    }
  });

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      jobSourceFilter: "",
      dateFilter: "all",
      customDateRange: { from: undefined, to: undefined }
    });
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Search filter
      const matchesSearch = 
        transaction.clientName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        transaction.jobTitle.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (transaction.technicianName && transaction.technicianName.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      
      // Job source filter - assuming transactions have a jobSourceId property
      // If your transactions don't have this property, you'd need to adjust this logic
      const matchesJobSource = 
        filters.jobSourceFilter === "" || 
        (transaction.jobSourceId && transaction.jobSourceId === filters.jobSourceFilter);
      
      // Date filter
      let matchesDate = true;
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch(filters.dateFilter) {
        case "today":
          matchesDate = isSameDay(transactionDate, today);
          break;
        case "tomorrow":
          matchesDate = isSameDay(transactionDate, addDays(today, 1));
          break;
        case "yesterday":
          matchesDate = isSameDay(transactionDate, subDays(today, 1));
          break;
        case "thisWeek": {
          const weekStart = startOfWeek(today, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
          matchesDate = isWithinInterval(transactionDate, { start: weekStart, end: weekEnd });
          break;
        }
        case "nextWeek": {
          const nextWeekStart = startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
          const nextWeekEnd = endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
          matchesDate = isWithinInterval(transactionDate, { start: nextWeekStart, end: nextWeekEnd });
          break;
        }
        case "lastWeek": {
          const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
          const lastWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
          matchesDate = isWithinInterval(transactionDate, { start: lastWeekStart, end: lastWeekEnd });
          break;
        }
        case "thisMonth": {
          const monthStart = startOfMonth(today);
          const monthEnd = endOfMonth(today);
          matchesDate = isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
          break;
        }
        case "nextMonth": {
          const nextMonthStart = startOfMonth(addMonths(today, 1));
          const nextMonthEnd = endOfMonth(addMonths(today, 1));
          matchesDate = isWithinInterval(transactionDate, { start: nextMonthStart, end: nextMonthEnd });
          break;
        }
        case "lastMonth": {
          const lastMonthStart = startOfMonth(subMonths(today, 1));
          const lastMonthEnd = endOfMonth(subMonths(today, 1));
          matchesDate = isWithinInterval(transactionDate, { start: lastMonthStart, end: lastMonthEnd });
          break;
        }
        case "custom":
          if (filters.customDateRange.from && filters.customDateRange.to) {
            matchesDate = isWithinInterval(transactionDate, { 
              start: filters.customDateRange.from, 
              end: filters.customDateRange.to 
            });
          }
          break;
        default:
          matchesDate = true;
      }
      
      return matchesSearch && (matchesJobSource || true) && matchesDate;
    });
  }, [transactions, filters]);

  return {
    filters,
    setFilters,
    filteredTransactions,
    resetFilters
  };
};
