
import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OfficeExpense, ExpenseCategory } from "@/types/finance";

type ChartType = "bar" | "line" | "pie" | "stacked";
type ViewType = "monthly" | "category" | "trend";

type OfficeExpenseTrendsProps = {
  date: DateRange | undefined;
  activeCategory: string | null;
  expenses: OfficeExpense[];
  categories: ExpenseCategory[];
};

const OfficeExpenseTrends = ({ date, activeCategory, expenses, categories }: OfficeExpenseTrendsProps) => {
  const [viewType, setViewType] = useState<ViewType>("monthly");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [comparisonPeriod, setComparisonPeriod] = useState<"previous" | "year">("previous");
  
  // Prepare chart data based on view type
  const chartData = useMemo(() => {
    // Monthly data for bar chart
    if (viewType === "monthly") {
      const monthlyData: any[] = [];
      // Create a map of all months
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      // Initialize month data
      months.forEach((month, index) => {
        const monthObj: any = { name: month };
        
        // Initialize each category with 0
        categories.forEach(cat => {
          monthObj[cat.name] = 0;
        });
        
        monthObj.Total = 0;
        monthlyData.push(monthObj);
      });
      
      // Populate with actual expense data
      expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        const monthIndex = expenseDate.getMonth();
        const categoryName = categories.find(cat => cat.id === expense.category)?.name || expense.category;
        
        if (monthlyData[monthIndex][categoryName] !== undefined) {
          monthlyData[monthIndex][categoryName] += expense.amount;
          monthlyData[monthIndex].Total += expense.amount;
        }
      });
      
      return monthlyData;
    }
    
    // Category data for pie chart
    if (viewType === "category") {
      const categoryTotals = categories.map(category => {
        const total = expenses
          .filter(exp => exp.category === category.id)
          .reduce((sum, exp) => sum + exp.amount, 0);
        
        return {
          name: category.name,
          value: total,
          color: category.color || "#6b7280"
        };
      }).filter(cat => cat.value > 0);
      
      return categoryTotals;
    }
    
    // Trend data for line chart
    if (viewType === "trend") {
      // Group expenses by month and calculate total
      const expensesByMonth: {[key: string]: number} = {};
      
      expenses.forEach(expense => {
        const monthYear = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (!expensesByMonth[monthYear]) {
          expensesByMonth[monthYear] = 0;
        }
        expensesByMonth[monthYear] += expense.amount;
      });
      
      // Convert to chart data format
      const trendData = Object.keys(expensesByMonth).map(monthYear => ({
        name: monthYear,
        Total: expensesByMonth[monthYear]
      }));
      
      // Sort by date
      return trendData.sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA.getTime() - dateB.getTime();
      });
    }
    
    return [];
  }, [viewType, expenses, categories, activeCategory]);
  
  // Helper function to get chart colors
  const getCategoryColor = (category: string): string => {
    const cat = categories.find(c => c.name === category);
    if (cat && cat.color) return cat.color;
    
    const colors: { [key: string]: string } = {
      "Rent": "#3b82f6", // blue
      "Secretary": "#ec4899", // pink
      "Equipment": "#f59e0b", // amber
      "Inventory": "#10b981", // emerald
      "Warehouse": "#6366f1", // indigo
      "Utilities": "#ef4444", // red
      "Insurance": "#a855f7", // purple
      "Staff": "#06b6d4", // cyan
      "Other": "#6b7280", // gray
      "Total": "#000000" // black
    };
    
    return colors[category] || "#6b7280";
  };

  // Get appropriate chart type component based on selection
  const getChartComponent = () => {
    if (viewType === "category") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || getCategoryColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    
    if (viewType === "trend" || chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Total" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
    
    // Default: bar chart (monthly or stacked)
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
          <Legend />
          
          {chartType === "stacked" ? (
            // For stacked view, add all categories as stacked bars
            categories.map((category) => (
              <Bar 
                key={category.id} 
                dataKey={category.name} 
                stackId="a" 
                fill={category.color || getCategoryColor(category.name)} 
              />
            ))
          ) : (
            // For regular bar chart, show one bar per category or just total
            viewType === "monthly" ? (
              activeCategory ? (
                <Bar 
                  dataKey={categories.find(c => c.id === activeCategory)?.name || activeCategory} 
                  fill={getCategoryColor(categories.find(c => c.id === activeCategory)?.name || activeCategory)} 
                />
              ) : (
                <Bar dataKey="Total" fill="#3b82f6" />
              )
            ) : (
              <Bar dataKey="value" fill="#3b82f6" />
            )
          )}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Calculate some summary metrics
  const totalExpenseAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpenseAmount / expenses.length : 0;
  const maxExpense = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h3 className="text-xl font-bold">Expense Trends</h3>
        
        <div className="flex flex-wrap gap-4 items-center">
          <RadioGroup
            defaultValue="monthly"
            value={viewType}
            className="flex space-x-4"
            onValueChange={(value) => setViewType(value as ViewType)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Monthly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="category" id="category" />
              <Label htmlFor="category">By Category</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="trend" id="trend" />
              <Label htmlFor="trend">Trend</Label>
            </div>
          </RadioGroup>
          
          {viewType !== "category" && viewType !== "trend" && (
            <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="stacked">Stacked Bar</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          {viewType === "trend" && (
            <Select value={comparisonPeriod} onValueChange={(value: any) => setComparisonPeriod(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Comparison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous">Previous Period</SelectItem>
                <SelectItem value="year">Year-over-Year</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenseAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Average Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageExpense.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Largest Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${maxExpense.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="h-80">
        {getChartComponent()}
      </div>
      
      <div className="text-sm text-muted-foreground">
        {viewType === 'monthly' && 'Monthly breakdown of expenses by category'}
        {viewType === 'category' && 'Proportion of expenses by category'}
        {viewType === 'trend' && 'Expense trends over time'}
      </div>
    </div>
  );
};

export default OfficeExpenseTrends;
