import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import OfficeExpensesOverview from "@/components/finance/office/OfficeExpensesOverview";
import OfficeExpenseCategories from "@/components/finance/office/OfficeExpenseCategories";
import OfficeExpenseList from "@/components/finance/office/OfficeExpenseList";
import OfficeExpenseTrends from "@/components/finance/office/OfficeExpenseTrends";
import DateRangeFilter from "@/components/finance/technician-filters/DateRangeFilter";
import { Building, Briefcase, Printer, Package, Warehouse, 
         Coffee, FileText, Users, PenTool, Download, Filter, ArrowDownUp, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpenseCategory, OfficeExpense } from "@/types/finance";
import { toast } from "sonner";

type OfficeDashboardProps = {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
};

const OfficeDashboard = ({ date, setDate }: OfficeDashboardProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<"day" | "week" | "month" | "quarter" | "year" | "all">("month");
  const [isExporting, setIsExporting] = useState(false);
  
  // Initialize expense categories with the additional required properties
  const [categories, setCategories] = useState<ExpenseCategory[]>([
    { id: "rent", name: "Rent", icon: <Building className="h-4 w-4" />, color: "#3b82f6", budget: 34200, currentSpend: 30600, amount: 30600, percentage: 32 },
    { id: "secretary", name: "Secretary", icon: <Briefcase className="h-4 w-4" />, color: "#ec4899", budget: 21600, currentSpend: 18400, amount: 18400, percentage: 19 },
    { id: "equipment", name: "Equipment", icon: <Printer className="h-4 w-4" />, color: "#f59e0b", budget: 6000, currentSpend: 5500, amount: 5500, percentage: 6 },
    { id: "inventory", name: "Inventory", icon: <Package className="h-4 w-4" />, color: "#10b981", budget: 5000, currentSpend: 4200, amount: 4200, percentage: 4 },
    { id: "warehouse", name: "Warehouse", icon: <Warehouse className="h-4 w-4" />, color: "#6366f1", budget: 14400, currentSpend: 14400, amount: 14400, percentage: 15 },
    { id: "utilities", name: "Utilities", icon: <Coffee className="h-4 w-4" />, color: "#ef4444", budget: 3600, currentSpend: 3400, amount: 3400, percentage: 4 },
    { id: "insurance", name: "Insurance", icon: <FileText className="h-4 w-4" />, color: "#a855f7", budget: 9000, currentSpend: 7500, amount: 7500, percentage: 8 },
    { id: "staff", name: "Staff", icon: <Users className="h-4 w-4" />, color: "#06b6d4", budget: 10200, currentSpend: 8700, amount: 8700, percentage: 9 },
    { id: "other", name: "Other", icon: <PenTool className="h-4 w-4" />, color: "#6b7280", budget: 2400, currentSpend: 1800, amount: 1800, percentage: 2 },
  ]);

  // Initialize expenses data
  const [expenses, setExpenses] = useState<OfficeExpense[]>([
    { id: "1", date: new Date("2023-10-01"), category: "rent", description: "Office Rent - October", amount: 2850, vendor: "Metro Property Management", paymentMethod: "bank", status: "paid" },
    { id: "2", date: new Date("2023-10-05"), category: "equipment", description: "New Printer", amount: 549.99, vendor: "Office Supplies Co.", paymentMethod: "credit", status: "paid" },
    { id: "3", date: new Date("2023-10-08"), category: "secretary", description: "Secretary Salary", amount: 1800, vendor: "Payroll", paymentMethod: "bank", status: "paid" },
    { id: "4", date: new Date("2023-10-10"), category: "utilities", description: "Electricity Bill", amount: 320.5, vendor: "City Power Co.", paymentMethod: "credit", status: "paid" },
    { id: "5", date: new Date("2023-10-15"), category: "inventory", description: "Office Supplies", amount: 420.5, vendor: "Staples", paymentMethod: "credit", status: "paid" },
    { id: "6", date: new Date("2023-10-20"), category: "insurance", description: "Business Insurance", amount: 750, vendor: "SafeGuard Insurance", paymentMethod: "bank", status: "paid" },
    { id: "7", date: new Date("2023-10-25"), category: "warehouse", description: "Warehouse Rent", amount: 1200, vendor: "Industrial Space Inc.", paymentMethod: "bank", status: "pending" },
    { id: "8", date: new Date("2023-10-28"), category: "staff", description: "Staff Training", amount: 850, vendor: "Professional Training Ltd.", paymentMethod: "credit", status: "paid" },
    { id: "9", date: new Date("2023-11-01"), category: "rent", description: "Office Rent - November", amount: 2850, vendor: "Metro Property Management", paymentMethod: "bank", status: "pending" },
    { id: "10", date: new Date("2023-11-05"), category: "equipment", description: "Computer Repairs", amount: 320, vendor: "Tech Support Inc.", paymentMethod: "credit", status: "paid" },
    { id: "11", date: new Date("2023-11-08"), category: "secretary", description: "Secretary Salary", amount: 1800, vendor: "Payroll", paymentMethod: "bank", status: "paid" },
    { id: "12", date: new Date("2023-11-12"), category: "utilities", description: "Water Bill", amount: 180, vendor: "City Utilities", paymentMethod: "bank", status: "paid" },
    { id: "13", date: new Date("2023-11-15"), category: "inventory", description: "Cleaning Supplies", amount: 210, vendor: "Janitorial Depot", paymentMethod: "credit", status: "paid" },
    { id: "14", date: new Date("2023-11-18"), category: "other", description: "Client Lunch Meeting", amount: 135, vendor: "Downtown Cafe", paymentMethod: "credit", status: "paid" },
    { id: "15", date: new Date("2023-11-20"), category: "insurance", description: "Liability Insurance", amount: 450, vendor: "SafeGuard Insurance", paymentMethod: "bank", status: "paid" },
    { id: "16", date: new Date("2023-11-25"), category: "warehouse", description: "Warehouse Rent", amount: 1200, vendor: "Industrial Space Inc.", paymentMethod: "bank", status: "pending" },
    { id: "17", date: new Date("2023-11-28"), category: "staff", description: "Holiday Bonuses", amount: 1500, vendor: "Payroll", paymentMethod: "bank", status: "paid" },
    { id: "18", date: new Date("2023-12-01"), category: "rent", description: "Office Rent - December", amount: 2850, vendor: "Metro Property Management", paymentMethod: "bank", status: "pending" },
    { id: "19", date: new Date("2023-12-05"), category: "equipment", description: "New Office Chairs", amount: 780, vendor: "Modern Office Furniture", paymentMethod: "credit", status: "paid" },
    { id: "20", date: new Date("2023-12-08"), category: "secretary", description: "Secretary Salary", amount: 1800, vendor: "Payroll", paymentMethod: "bank", status: "paid" }
  ]);

  // Filter expenses based on selected date range and category
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
    const matchesDateRange = !date?.from || !date?.to || 
      (expenseDate >= date.from && expenseDate <= date.to);
    
    const matchesCategory = !activeCategory || expense.category === activeCategory;
    
    return matchesDateRange && matchesCategory;
  });

  // Calculate totals for dashboard metrics
  const totalExpenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  const averageMonthlyExpense = calculateMonthlyAverage();
  const largestExpense = filteredExpenses.length > 0 
    ? filteredExpenses.reduce((max, exp) => exp.amount > max.amount ? exp : max, filteredExpenses[0])
    : null;
  const mostRecentExpense = filteredExpenses.length > 0 
    ? filteredExpenses.reduce((latest, exp) => {
        const expDate = exp.date instanceof Date ? exp.date : new Date(exp.date);
        const latestDate = latest.date instanceof Date ? latest.date : new Date(latest.date);
        return expDate > latestDate ? exp : latest;
      }, filteredExpenses[0])
    : null;

  function calculateMonthlyAverage() {
    if (filteredExpenses.length === 0) return 0;
    
    // Group expenses by month
    const expensesByMonth: {[key: string]: number} = {};
    
    filteredExpenses.forEach(expense => {
      const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
      const month = expenseDate.toISOString().substring(0, 7); // YYYY-MM format
      if (!expensesByMonth[month]) {
        expensesByMonth[month] = 0;
      }
      expensesByMonth[month] += expense.amount;
    });
    
    // Calculate average
    const months = Object.keys(expensesByMonth);
    if (months.length === 0) return 0;
    
    const total = months.reduce((sum, month) => sum + expensesByMonth[month], 0);
    return total / months.length;
  }

  // Handle adding a new category
  const handleAddCategory = (category: ExpenseCategory) => {
    setCategories(prev => [...prev, category]);
  };

  // Handle updating budget for a category
  const handleUpdateBudget = (categoryId: string, budget: number) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId ? { ...cat, budget } : cat
      )
    );
  };

  // Handle adding a new expense
  const handleAddExpense = (expense: OfficeExpense) => {
    setExpenses(prev => [...prev, expense]);
    
    // Update current spend for the category
    setCategories(prev => 
      prev.map(cat => 
        cat.id === expense.category 
          ? { ...cat, currentSpend: (cat.currentSpend || 0) + expense.amount } 
          : cat
      )
    );
    
    toast.success("Expense added successfully");
  };

  // Handle editing an expense
  const handleEditExpense = (updatedExpense: OfficeExpense) => {
    const oldExpense = expenses.find(e => e.id === updatedExpense.id);
    
    setExpenses(prev => 
      prev.map(exp => 
        exp.id === updatedExpense.id ? updatedExpense : exp
      )
    );
    
    // Update category spend amounts
    if (oldExpense) {
      // If category changed, update both categories
      if (oldExpense.category !== updatedExpense.category) {
        setCategories(prev => 
          prev.map(cat => {
            if (cat.id === oldExpense.category) {
              return { ...cat, currentSpend: (cat.currentSpend || 0) - oldExpense.amount };
            }
            if (cat.id === updatedExpense.category) {
              return { ...cat, currentSpend: (cat.currentSpend || 0) + updatedExpense.amount };
            }
            return cat;
          })
        );
      } 
      // If only amount changed, update just the one category
      else if (oldExpense.amount !== updatedExpense.amount) {
        setCategories(prev => 
          prev.map(cat => {
            if (cat.id === updatedExpense.category) {
              const difference = updatedExpense.amount - oldExpense.amount;
              return { ...cat, currentSpend: (cat.currentSpend || 0) + difference };
            }
            return cat;
          })
        );
      }
    }
    
    toast.success("Expense updated successfully");
  };

  // Handle deleting an expense
  const handleDeleteExpense = (expenseId: string) => {
    const expenseToDelete = expenses.find(e => e.id === expenseId);
    
    if (expenseToDelete) {
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
      
      // Update category spend amount
      setCategories(prev => 
        prev.map(cat => {
          if (cat.id === expenseToDelete.category) {
            return { ...cat, currentSpend: (cat.currentSpend || 0) - expenseToDelete.amount };
          }
          return cat;
        })
      );
      
      toast.success("Expense deleted successfully");
    }
  };

  // Handle exporting data
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Expense data exported successfully");
    }, 1500);
  };

  return (
    <div className="space-y-8 mt-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-3xl font-bold">Office & Other Expenses</h2>
        
        <div className="flex gap-3">
          <DateRangeFilter date={date} setDate={setDate} />
          
          <Button variant="outline" disabled={isExporting} onClick={handleExport}>
            {isExporting ? "Exporting..." : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <OfficeExpensesOverview 
        totalExpenses={totalExpenses} 
        monthlyAverage={averageMonthlyExpense} 
        largestExpense={largestExpense}
        mostRecentExpense={mostRecentExpense}
        activeCategory={activeCategory ? categories.find(cat => cat.id === activeCategory)?.name || null : null}
        date={date} 
      />
      
      {/* Categories Section */}
      <OfficeExpenseCategories 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory}
        categories={categories}
        onAddCategory={handleAddCategory}
        onUpdateBudget={handleUpdateBudget}
        selectedTimeFrame={timeFrame}
        setSelectedTimeFrame={setTimeFrame}
      />
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Expense List */}
        <Card>
          <CardContent className="pt-6">
            <OfficeExpenseList 
              date={date} 
              activeCategory={activeCategory} 
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          </CardContent>
        </Card>
        
        {/* Expense Trends */}
        <Card>
          <CardContent className="pt-6">
            <OfficeExpenseTrends 
              date={date} 
              activeCategory={activeCategory}
              expenses={filteredExpenses}
              categories={categories}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfficeDashboard;
