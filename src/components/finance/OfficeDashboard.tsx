
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import CompactDateRangePicker from "./CompactDateRangePicker";
import { 
  BarChart, 
  XAxis, 
  YAxis, 
  Bar, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Download, Home, User, Tool, Package, Boxes, Warehouse, FolderPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

// Define expense categories with icons and colors
const EXPENSE_CATEGORIES = [
  { id: "rent", label: "Office Rent & Utilities", icon: <Home className="h-4 w-4" />, color: "#8B5CF6" },
  { id: "secretary", label: "Secretary & Admin", icon: <User className="h-4 w-4" />, color: "#F97316" },
  { id: "equipment", label: "Office Equipment", icon: <Tool className="h-4 w-4" />, color: "#10B981" },
  { id: "inventory", label: "Equipment Inventory", icon: <Package className="h-4 w-4" />, color: "#0EA5E9" },
  { id: "warehouse", label: "Warehouse Expenses", icon: <Warehouse className="h-4 w-4" />, color: "#D946EF" },
  { id: "supplies", label: "Office Supplies", icon: <Boxes className="h-4 w-4" />, color: "#F43F5E" },
  { id: "software", label: "Software & Subscriptions", icon: <FolderPlus className="h-4 w-4" />, color: "#EAB308" },
  { id: "travel", label: "Travel & Transportation", icon: <FolderPlus className="h-4 w-4" />, color: "#6366F1" },
  { id: "meals", label: "Meals & Entertainment", icon: <FolderPlus className="h-4 w-4" />, color: "#14B8A6" },
  { id: "professional", label: "Professional Services", icon: <FolderPlus className="h-4 w-4" />, color: "#EC4899" },
  { id: "other", label: "Other Expenses", icon: <FolderPlus className="h-4 w-4" />, color: "#64748B" },
];

// Define colors for charts
const COLORS = [
  "#8B5CF6", "#F97316", "#10B981", "#0EA5E9", "#D946EF", 
  "#F43F5E", "#EAB308", "#6366F1", "#14B8A6", "#EC4899", "#64748B"
];

interface OfficeExpense {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
  paymentMethod: string;
  receipt?: string;
  notes?: string;
}

interface OfficeDashboardProps {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const OfficeDashboard: React.FC<OfficeDashboardProps> = ({ date, setDate }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [expenses, setExpenses] = useState<OfficeExpense[]>([
    {
      id: "exp1",
      date: new Date(2023, 8, 15),
      amount: 2500,
      description: "Office rent - September",
      category: "rent",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "exp2",
      date: new Date(2023, 8, 20),
      amount: 850,
      description: "Secretary salary",
      category: "secretary",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "exp3",
      date: new Date(2023, 8, 25),
      amount: 1200,
      description: "New office computers",
      category: "equipment",
      paymentMethod: "Credit Card"
    },
    {
      id: "exp4",
      date: new Date(2023, 9, 1),
      amount: 2000,
      description: "Inventory restock - tools",
      category: "inventory",
      paymentMethod: "Credit Card"
    },
    {
      id: "exp5",
      date: new Date(2023, 9, 5),
      amount: 1500,
      description: "Warehouse rent - October",
      category: "warehouse",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "exp6",
      date: new Date(2023, 9, 10),
      amount: 350,
      description: "Office supplies - paper, ink, etc.",
      category: "supplies",
      paymentMethod: "Credit Card"
    },
    {
      id: "exp7",
      date: new Date(2023, 9, 15),
      amount: 200,
      description: "Software subscriptions",
      category: "software",
      paymentMethod: "Credit Card"
    },
    {
      id: "exp8",
      date: new Date(2023, 9, 20),
      amount: 1100,
      description: "Business trip to conference",
      category: "travel",
      paymentMethod: "Credit Card"
    }
  ]);
  
  const [newExpenseOpen, setNewExpenseOpen] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<OfficeExpense>>({
    date: new Date(),
    amount: 0,
    description: "",
    category: "",
    paymentMethod: ""
  });
  
  const [editExpenseId, setEditExpenseId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter expenses based on date range and selected category
  const filteredExpenses = expenses.filter(
    (expense) => 
      date?.from && 
      date?.to && 
      expense.date >= date.from && 
      expense.date <= date.to &&
      (selectedCategory === null || expense.category === selectedCategory)
  );
  
  // Calculate totals by category for the pie chart
  const expensesByCategory = EXPENSE_CATEGORIES.map(category => {
    const total = filteredExpenses
      .filter(expense => expense.category === category.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
      
    return {
      name: category.label,
      value: total,
      id: category.id,
      color: category.color
    };
  }).filter(item => item.value > 0);
  
  // Calculate expenses by month for the bar chart
  const getMonthlyExpenses = () => {
    const monthlyData: { [key: string]: number } = {};
    
    filteredExpenses.forEach(expense => {
      const monthYear = `${expense.date.toLocaleString('default', { month: 'short' })} ${expense.date.getFullYear()}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear] += expense.amount;
    });
    
    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount
    }));
  };
  
  const monthlyExpenses = getMonthlyExpenses();
  
  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Handle new expense submission
  const handleSubmitExpense = () => {
    if (editExpenseId) {
      // Update existing expense
      setExpenses(prev => 
        prev.map(exp => 
          exp.id === editExpenseId 
            ? { ...newExpense, id: editExpenseId } as OfficeExpense 
            : exp
        )
      );
      toast({
        title: "Expense updated",
        description: "The expense has been updated successfully."
      });
    } else {
      // Add new expense
      if (!newExpense.description || !newExpense.amount || !newExpense.category || !newExpense.paymentMethod) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
      
      const expenseToAdd: OfficeExpense = {
        ...newExpense as any,
        id: `exp-${Date.now()}`,
        date: newExpense.date || new Date()
      };
      
      setExpenses(prev => [...prev, expenseToAdd]);
      toast({
        title: "Expense added",
        description: "The new expense has been added successfully."
      });
    }
    
    // Reset form and close dialog
    setNewExpense({
      date: new Date(),
      amount: 0,
      description: "",
      category: "",
      paymentMethod: ""
    });
    setEditExpenseId(null);
    setNewExpenseOpen(false);
  };
  
  // Handle edit expense
  const handleEditExpense = (id: string) => {
    const expenseToEdit = expenses.find(exp => exp.id === id);
    if (expenseToEdit) {
      setNewExpense(expenseToEdit);
      setEditExpenseId(id);
      setNewExpenseOpen(true);
    }
  };
  
  // Handle delete expense
  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    toast({
      title: "Expense deleted",
      description: "The expense has been deleted successfully."
    });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get category details
  const getCategoryDetails = (categoryId: string) => {
    return EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
  };
  
  return (
    <div className="space-y-8">
      {/* Date Range Picker and Category Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="h-9"
          >
            All Categories
          </Button>
          {EXPENSE_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="h-9 flex items-center gap-1"
              style={{ 
                backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                borderColor: category.color,
                color: selectedCategory === category.id ? 'white' : 'inherit'
              }}
            >
              {category.icon}
              <span className="hidden md:inline">{category.label}</span>
            </Button>
          ))}
        </div>
        <CompactDateRangePicker date={date} setDate={setDate} />
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Office Expenses</CardTitle>
            <CardDescription>Current period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Biggest Category</CardTitle>
            <CardDescription>Where most money goes</CardDescription>
          </CardHeader>
          <CardContent>
            {expensesByCategory.length > 0 ? (
              <div className="flex items-center gap-2">
                {expensesByCategory.sort((a, b) => b.value - a.value)[0] && (
                  <>
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: expensesByCategory.sort((a, b) => b.value - a.value)[0].color }}
                    ></div>
                    <div>
                      <div className="text-2xl font-bold">
                        {expensesByCategory.sort((a, b) => b.value - a.value)[0]?.name || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(expensesByCategory.sort((a, b) => b.value - a.value)[0]?.value || 0)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-2xl font-bold">N/A</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
            <CardDescription>Average monthly expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyExpenses.length > 0 
                ? totalExpenses / monthlyExpenses.length 
                : 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="expenses">Expense List</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Category Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {EXPENSE_CATEGORIES.slice(0, 6).map((category) => {
              const categoryExpenses = filteredExpenses.filter(exp => exp.category === category.id);
              const totalAmount = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
              
              return (
                <Card key={category.id} className="overflow-hidden border-t-4" style={{ borderTopColor: category.color }}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <div className="p-1.5 rounded-md" style={{ backgroundColor: `${category.color}20` }}>
                          {category.icon}
                        </div>
                        {category.label}
                      </CardTitle>
                      <Badge variant="outline" className="ml-2" style={{ color: category.color, borderColor: category.color }}>
                        {categoryExpenses.length} items
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{formatCurrency(totalAmount)}</div>
                    {categoryExpenses.length > 0 && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Latest: {categoryExpenses.sort((a, b) => b.date.getTime() - a.date.getTime())[0]?.description.substring(0, 20)}
                        {categoryExpenses[0]?.description.length > 20 ? '...' : ''}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Monthly Expenses Chart */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
                <CardDescription>
                  Office expenses by month
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyExpenses}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, "Amount"]}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Bar 
                        dataKey="amount" 
                        fill="#8B5CF6" 
                        name="Monthly Expenses" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Expenses by Category Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
                <CardDescription>
                  Distribution of office expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {expensesByCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expensesByCategory}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => 
                            `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {expensesByCategory.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value as number), "Amount"]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No data available for the selected period
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Expenses */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Expenses</CardTitle>
                  <CardDescription>
                    Latest office-related expenses
                  </CardDescription>
                </div>
                <Button variant="outline" className="h-8" onClick={() => setActiveTab("expenses")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredExpenses
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, 5)
                    .map((expense) => {
                      const category = getCategoryDetails(expense.category);
                      return (
                        <div key={expense.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                          <div 
                            className="p-2 rounded-md flex-shrink-0" 
                            style={{ backgroundColor: `${category?.color}20` }}
                          >
                            {category?.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{expense.description}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              {expense.date.toLocaleDateString()} - {category?.label}
                            </div>
                          </div>
                          <div className="font-medium">
                            {formatCurrency(expense.amount)}
                          </div>
                        </div>
                      );
                    })}
                  
                  {filteredExpenses.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No expenses in the selected period
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories Breakdown</CardTitle>
              <CardDescription>
                Detailed analysis of expense categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {/* Category Breakdown */}
                <div className="md:grid-cols-2">
                  <div className="h-[400px]">
                    {expensesByCategory.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={expensesByCategory}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={140}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip 
                            formatter={(value) => [formatCurrency(value as number), "Amount"]}
                          />
                          <Bar dataKey="value" name="Amount">
                            {expensesByCategory.map((entry) => (
                              <Cell 
                                key={`cell-${entry.id}`} 
                                fill={entry.color} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        No data available for the selected period
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Details */}
                <div className="space-y-6">
                  {EXPENSE_CATEGORIES.map((category) => {
                    const categoryExpenses = filteredExpenses.filter(exp => exp.category === category.id);
                    const totalAmount = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                    
                    if (totalAmount === 0) return null;
                    
                    return (
                      <div key={category.id} className="border rounded-lg overflow-hidden">
                        <div 
                          className="p-4 flex justify-between items-center" 
                          style={{ backgroundColor: `${category.color}10` }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md" style={{ backgroundColor: `${category.color}20` }}>
                              {category.icon}
                            </div>
                            <div>
                              <h3 className="font-medium">{category.label}</h3>
                              <p className="text-sm text-muted-foreground">
                                {categoryExpenses.length} expenses - {((totalAmount / totalExpenses) * 100).toFixed(1)}% of total
                              </p>
                            </div>
                          </div>
                          <div className="text-xl font-bold">{formatCurrency(totalAmount)}</div>
                        </div>
                        
                        {categoryExpenses.length > 0 && (
                          <div className="p-4">
                            <h4 className="text-sm font-medium mb-2">Recent Expenses</h4>
                            <div className="space-y-2">
                              {categoryExpenses
                                .sort((a, b) => b.date.getTime() - a.date.getTime())
                                .slice(0, 3)
                                .map(expense => (
                                  <div key={expense.id} className="flex justify-between items-center text-sm">
                                    <div className="flex-1">
                                      <div className="font-medium">{expense.description}</div>
                                      <div className="text-muted-foreground">{expense.date.toLocaleDateString()}</div>
                                    </div>
                                    <div>{formatCurrency(expense.amount)}</div>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Expenses List Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Office Expenses</CardTitle>
                <CardDescription>
                  Manage all your office expenses
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Dialog open={newExpenseOpen} onOpenChange={setNewExpenseOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editExpenseId ? "Edit Expense" : "Add New Expense"}
                      </DialogTitle>
                      <DialogDescription>
                        {editExpenseId 
                          ? "Update the expense details below." 
                          : "Enter the expense details below."}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newExpense.date ? new Date(newExpense.date).toISOString().split('T')[0] : ''}
                            onChange={(e) => setNewExpense({
                              ...newExpense, 
                              date: e.target.value ? new Date(e.target.value) : undefined
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount ($)</Label>
                          <Input
                            id="amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={newExpense.amount || ''}
                            onChange={(e) => setNewExpense({
                              ...newExpense, 
                              amount: parseFloat(e.target.value)
                            })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={newExpense.description || ''}
                          onChange={(e) => setNewExpense({
                            ...newExpense, 
                            description: e.target.value
                          })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newExpense.category || ''}
                            onValueChange={(value) => setNewExpense({
                              ...newExpense, 
                              category: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {EXPENSE_CATEGORIES.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  <div className="flex items-center gap-2">
                                    {category.icon}
                                    <span>{category.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="paymentMethod">Payment Method</Label>
                          <Select
                            value={newExpense.paymentMethod || ''}
                            onValueChange={(value) => setNewExpense({
                              ...newExpense, 
                              paymentMethod: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cash">Cash</SelectItem>
                              <SelectItem value="Credit Card">Credit Card</SelectItem>
                              <SelectItem value="Debit Card">Debit Card</SelectItem>
                              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                              <SelectItem value="Check">Check</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input
                          id="notes"
                          value={newExpense.notes || ''}
                          onChange={(e) => setNewExpense({
                            ...newExpense, 
                            notes: e.target.value
                          })}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setNewExpenseOpen(false);
                        setEditExpenseId(null);
                        setNewExpense({
                          date: new Date(),
                          amount: 0,
                          description: "",
                          category: "",
                          paymentMethod: ""
                        });
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitExpense}>
                        {editExpenseId ? "Update Expense" : "Add Expense"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .map((expense) => {
                          const category = getCategoryDetails(expense.category);
                          return (
                            <TableRow key={expense.id}>
                              <TableCell>{expense.date.toLocaleDateString()}</TableCell>
                              <TableCell>{expense.description}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="p-1 rounded-md"
                                    style={{ backgroundColor: `${category?.color}20` }}
                                  >
                                    {category?.icon}
                                  </div>
                                  <span>{category?.label}</span>
                                </div>
                              </TableCell>
                              <TableCell>{expense.paymentMethod}</TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(expense.amount)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleEditExpense(expense.id)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-600"
                                    onClick={() => handleDeleteExpense(expense.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No expenses found for the selected period
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OfficeDashboard;
