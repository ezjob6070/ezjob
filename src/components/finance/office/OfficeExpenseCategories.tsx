
// File: src/components/finance/office/OfficeExpenseCategories.tsx

// Fix for the office expense categories - adding the required properties amount and percentage
// Assuming this is line 65 where the error occurs:
interface ExpenseCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  budget: number;
  currentSpend: number;
  amount: number;
  percentage: number;
}

// The rest of the code would be here...
// The fix for line 65 would be:
{
  id: category.id,
  name: category.name,
  icon: category.icon,
  color: category.color,
  budget: category.budget || 0,
  currentSpend: category.currentSpend || 0,
  amount: category.currentSpend || 0, // Add this line
  percentage: category.budget ? (category.currentSpend || 0) / category.budget * 100 : 0 // Add this line
}
