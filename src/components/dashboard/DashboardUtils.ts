
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// New utility functions for payment calculations
export const calculateTechnicianProfit = (
  jobTotal: number, 
  technicianRate: number, 
  isPercentage: boolean
): number => {
  if (isPercentage) {
    return jobTotal * (technicianRate / 100);
  } else {
    return technicianRate; // Flat rate in USD
  }
};

export const calculateCompanyProfit = (
  jobTotal: number, 
  technicianProfit: number
): number => {
  return jobTotal - technicianProfit;
};
