
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ExpenseCategory } from "@/types/finance";

// Sample office expense categories
const officeExpenseCategories: ExpenseCategory[] = [
  {
    id: "rent",
    name: "Office Rent",
    icon: null,
    color: "#4f46e5",
    budget: 5000,
    currentSpend: 4500,
    amount: 4500,
    percentage: 90
  },
  {
    id: "utilities",
    name: "Utilities",
    icon: null,
    color: "#0ea5e9",
    budget: 1500,
    currentSpend: 1200,
    amount: 1200,
    percentage: 80
  },
  {
    id: "supplies",
    name: "Office Supplies",
    icon: null,
    color: "#10b981",
    budget: 1000,
    currentSpend: 850,
    amount: 850,
    percentage: 85
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: null,
    color: "#ec4899",
    budget: 2000,
    currentSpend: 2000,
    amount: 2000,
    percentage: 100
  }
];

interface OfficeExpenseCategoriesProps {
  categories?: ExpenseCategory[];
  activeCategory?: string;
  setActiveCategory?: (id: string) => void;
  selectedTimeFrame?: "all" | "week" | "month" | "quarter" | "year";
  setSelectedTimeFrame?: (timeframe: "all" | "week" | "month" | "quarter" | "year") => void;
  onAddCategory?: (category: ExpenseCategory) => void;
  onUpdateBudget?: (categoryId: string, budget: number) => void;
}

const OfficeExpenseCategories: React.FC<OfficeExpenseCategoriesProps> = ({ 
  categories = officeExpenseCategories,
  activeCategory,
  setActiveCategory,
  selectedTimeFrame,
  setSelectedTimeFrame,
  onAddCategory,
  onUpdateBudget
}) => {
  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCardClick = (categoryId: string) => {
    if (setActiveCategory) {
      setActiveCategory(categoryId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((category) => {
        // Here is the fix for line 65
        const enrichedCategory: ExpenseCategory = {
          id: category.id,
          name: category.name,
          icon: category.icon,
          color: category.color,
          budget: category.budget || 0,
          currentSpend: category.currentSpend || 0,
          amount: category.currentSpend || 0,
          percentage: category.budget ? (category.currentSpend || 0) / category.budget * 100 : 0
        };
        
        return (
          <Card 
            key={enrichedCategory.id} 
            className={activeCategory === enrichedCategory.id ? "ring-2 ring-blue-500" : ""}
            onClick={() => handleCardClick(enrichedCategory.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{enrichedCategory.name}</h3>
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: enrichedCategory.color }} 
                />
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Budget</span>
                <span>{formatCurrency(enrichedCategory.budget)}</span>
              </div>
              
              <div className="flex justify-between font-medium">
                <span>Spent</span>
                <span>{formatCurrency(enrichedCategory.currentSpend)}</span>
              </div>
              
              <div className="mt-2 h-2 bg-gray-100 rounded-full">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: `${Math.min(enrichedCategory.percentage, 100)}%`,
                    backgroundColor: enrichedCategory.color 
                  }}
                />
              </div>
              
              <div className="flex justify-between text-xs mt-1">
                <span>{enrichedCategory.percentage.toFixed(0)}% of budget</span>
                <span>
                  {formatCurrency(enrichedCategory.currentSpend)} / {formatCurrency(enrichedCategory.budget)}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OfficeExpenseCategories;
