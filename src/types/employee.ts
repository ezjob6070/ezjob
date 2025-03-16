
export enum SalaryBasis {
  HOURLY = "HOURLY",
  SALARY = "SALARY",
  COMMISSION = "COMMISSION"
}

export enum IncentiveType {
  BONUS = "BONUS",
  COMMISSION = "COMMISSION",
  PROFIT_SHARING = "PROFIT_SHARING",
  NONE = "NONE"
}

export const SALARY_BASIS_OPTIONS = [
  { value: SalaryBasis.HOURLY, label: "Hourly" },
  { value: SalaryBasis.SALARY, label: "Salary" },
  { value: SalaryBasis.COMMISSION, label: "Commission" }
];

export const INCENTIVE_TYPE_OPTIONS = [
  { value: IncentiveType.BONUS, label: "Bonus" },
  { value: IncentiveType.COMMISSION, label: "Commission" },
  { value: IncentiveType.PROFIT_SHARING, label: "Profit Sharing" },
  { value: IncentiveType.NONE, label: "None" }
];
