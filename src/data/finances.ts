
import { FinancialTransaction } from "@/types/finance";
import { calculateCompanyProfit, calculateTechnicianProfit } from "@/components/dashboard/DashboardUtils";

// Generate sample transactions for last 90 days
const generateTransactions = (): FinancialTransaction[] => {
  const transactions: FinancialTransaction[] = [];
  const today = new Date();
  
  // Client names for randomization
  const clients = [
    "Acme Corp", 
    "Smith Family", 
    "Johnson Residence", 
    "Tech Solutions Inc.", 
    "Greenfield Apartments",
    "Vista Properties",
    "Sunshine Daycare",
    "Mountain View Restaurant",
    "Riverside Medical"
  ];
  
  // Job titles for randomization
  const jobs = [
    "HVAC Installation", 
    "Electrical Repair", 
    "Plumbing Service", 
    "Annual Maintenance", 
    "Emergency Repair",
    "System Upgrade",
    "Inspection",
    "Troubleshooting",
    "Parts Replacement"
  ];
  
  // Technician names
  const technicians = [
    "John Smith", 
    "Sarah Johnson", 
    "Mike Williams", 
    "Rebecca Davis", 
    "Tom Anderson"
  ];
  
  // Generate random transactions for last 90 days
  for (let i = 0; i < 150; i++) {
    const dayOffset = Math.floor(Math.random() * 90);
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    
    const clientName = clients[Math.floor(Math.random() * clients.length)];
    const jobTitle = jobs[Math.floor(Math.random() * jobs.length)];
    const amount = Math.floor(Math.random() * 3000) + 500; // $500 to $3500
    const technicianName = technicians[Math.floor(Math.random() * technicians.length)];
    const technicianRateIsPercentage = Math.random() > 0.5;
    const technicianRate = technicianRateIsPercentage ? 
      Math.floor(Math.random() * 30) + 20 : // 20% to 50%
      Math.floor(Math.random() * 500) + 100; // $100 to $600 flat rate

    transactions.push({
      id: `tr-${i}-${Date.now()}`,
      date,
      amount,
      clientName,
      jobTitle,
      technicianName,
      technicianRate,
      technicianRateIsPercentage,
      category: Math.random() > 0.1 ? "payment" : (Math.random() > 0.5 ? "expense" : "refund"),
      status: Math.random() > 0.2 ? "completed" : (Math.random() > 0.5 ? "pending" : "failed"),
      notes: Math.random() > 0.7 ? "Customer requested special service" : undefined
    });
  }
  
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const sampleTransactions = generateTransactions();

// Helper function to filter transactions by date range
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

// Generate financial report for a specific time frame
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

// Generate date ranges for common time periods
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
