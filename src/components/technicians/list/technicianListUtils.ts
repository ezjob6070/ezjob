
import { SalaryBasis, IncentiveType } from "@/types/employee";

// Helper function to determine badge variant
export const getBadgeVariantFromStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "success" as const;
    case "inactive":
      return "secondary" as const;
    case "onleave":
      return "warning" as const;
    case "suspended":
      return "destructive" as const;
    case "terminated":
      return "outline" as const;
    default:
      return "default" as const;
  }
};

// Format hourly rate
export const formatHourlyRate = (amount?: number) => {
  if (amount === undefined) return "N/A";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Get salary basis display text
export const getSalaryBasisText = (basis?: SalaryBasis) => {
  if (!basis) return "N/A";
  switch (basis) {
    case SalaryBasis.HOURLY:
      return "Hourly";
    case SalaryBasis.WEEKLY:
      return "Weekly";
    case SalaryBasis.MONTHLY:
      return "Monthly";
    case SalaryBasis.YEARLY:
      return "Yearly";
    default:
      return "N/A";
  }
};

// Get incentive type display text
export const getIncentiveTypeText = (type?: IncentiveType) => {
  if (!type) return "N/A";
  switch (type) {
    case IncentiveType.HOURLY:
      return "Per Hour";
    case IncentiveType.WEEKLY:
      return "Per Week";
    case IncentiveType.MONTHLY:
      return "Per Month";
    default:
      return "N/A";
  }
};
