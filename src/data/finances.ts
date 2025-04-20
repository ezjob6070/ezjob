import { FinancialTransaction } from "@/types/finance";

// Start with empty transactions
export const sampleTransactions: FinancialTransaction[] = [];

// Keep the helper functions but remove mock data
export const filterTransactionsByDateRange = (
  transactions: FinancialTransaction[],
  startDate: Date,
  endDate: Date
): FinancialTransaction[] => {
  return transactions.filter(
    (transaction) => 
      transaction.date >= startDate && 
      transaction.date <= endDate
  );
};

export const generateFinancialReport = (
  transactions: FinancialTransaction[],
  startDate: Date,
  endDate: Date,
  timeFrame: "day" | "week" | "month" | "year" | "custom" = "month"
) => {
  const filteredTransactions = filterTransactionsByDateRange(
    transactions,
    startDate,
    endDate
  );
  
  // Calculate totals
  let totalRevenue = 0;
  let totalExpenses = 0;
  let technicianPayments = 0;
  
  filteredTransactions.forEach(transaction => {
    if (transaction.status === "completed") {
      if (transaction.category === "payment") {
        totalRevenue += transaction.amount;
        
        // Calculate technician's cut if applicable
        if (transaction.technicianName && transaction.technicianRate !== undefined) {
          const technicianProfit = calculateTechnicianProfit(
            transaction.amount,
            transaction.technicianRate,
            !!transaction.technicianRateIsPercentage
          );
          technicianPayments += technicianProfit;
        }
      } else if (transaction.category === "expense") {
        totalExpenses += transaction.amount;
      } else if (transaction.category === "refund") {
        totalRevenue -= transaction.amount;
      }
    }
  });
  
  const companyProfit = totalRevenue - totalExpenses - technicianPayments;
  
  return {
    timeFrame,
    startDate,
    endDate,
    totalRevenue,
    totalExpenses,
    companyProfit,
    technicianPayments,
    transactions: filteredTransactions
  };
};

export const getDateRangeForTimeFrame = (timeFrame: "day" | "week" | "month" | "year") => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  
  const startDate = new Date(endDate);
  
  switch (timeFrame) {
    case "day":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "week":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case "year":
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
  }
  
  return { startDate, endDate };
};
