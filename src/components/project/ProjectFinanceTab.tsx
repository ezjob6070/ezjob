
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, FileText, Image, MapPin, Users, Truck, DollarSign, ListTodo, Edit, User, Plus, Send, Download, Check, X, TrendingDown, TrendingUp, Wallet, Receipt } from "lucide-react";
import { Project, ProjectQuote, ProjectInvoice, ProjectExpense } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import ProjectQuoteModal from "@/components/projects/ProjectQuoteModal";
import ProjectInvoiceModal from "@/components/projects/ProjectInvoiceModal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface ProjectFinanceTabProps {
  project: Project;
}

const ProjectFinanceTab: React.FC<ProjectFinanceTabProps> = ({ project }) => {
  // State for modals
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<ProjectQuote | undefined>(undefined);
  const [selectedInvoice, setSelectedInvoice] = useState<ProjectInvoice | undefined>(undefined);
  const [financeTab, setFinanceTab] = useState("overview");
  const [expenseCategory, setExpenseCategory] = useState<string>("all");
  const [expensePeriod, setExpensePeriod] = useState<string>("all");
  
  // Project quotes & invoices
  const [quotes, setQuotes] = useState<ProjectQuote[]>(project.quotes || []);
  const [invoices, setInvoices] = useState<ProjectInvoice[]>(project.invoices || []);
  
  // Sample expenses
  const [expenses, setExpenses] = useState<ProjectExpense[]>(project.expenses || [
    {
      id: "exp-001",
      name: "Materials Purchase",
      amount: project.budget * 0.15,
      date: new Date().toISOString().split('T')[0],
      category: "materials",
      description: "Initial materials for project foundation",
      paymentMethod: "credit-card",
      status: "paid"
    },
    {
      id: "exp-002",
      name: "Equipment Rental",
      amount: project.budget * 0.08,
      date: new Date().toISOString().split('T')[0],
      category: "equipment",
      description: "Heavy machinery rental for excavation",
      paymentMethod: "bank-transfer",
      status: "paid"
    },
    {
      id: "exp-003",
      name: "Permit Fees",
      amount: project.budget * 0.03,
      date: new Date().toISOString().split('T')[0],
      category: "permits",
      description: "City permits and inspection fees",
      paymentMethod: "check",
      status: "paid"
    }
  ]);
  
  // Quote status color mapping
  const quoteStatusColors: Record<string, string> = {
    "draft": "bg-gray-100 text-gray-800",
    "sent": "bg-blue-100 text-blue-800",
    "accepted": "bg-green-100 text-green-800",
    "rejected": "bg-red-100 text-red-800",
    "expired": "bg-amber-100 text-amber-800",
  };
  
  // Invoice status color mapping
  const invoiceStatusColors: Record<string, string> = {
    "draft": "bg-gray-100 text-gray-800",
    "sent": "bg-blue-100 text-blue-800",
    "paid": "bg-green-100 text-green-800",
    "overdue": "bg-red-100 text-red-800",
    "cancelled": "bg-amber-100 text-amber-800",
  };
  
  // Expense category color mapping
  const expenseCategoryColors: Record<string, string> = {
    "materials": "#3b82f6",
    "equipment": "#f97316",
    "labor": "#10b981",
    "permits": "#8b5cf6",
    "subcontractors": "#ef4444",
    "overhead": "#64748b",
    "other": "#94a3b8"
  };
  
  // Calculate finances
  const totalIncome = quotes
    .filter(q => q.status === "accepted")
    .reduce((sum, q) => sum + q.totalAmount, 0);
    
  const totalContractorCosts = invoices
    .filter(i => i.status === "paid")
    .reduce((sum, i) => sum + (i.paidAmount || i.totalAmount), 0);
  
  const totalExpenses = expenses
    .filter(e => e.status === "paid")
    .reduce((sum, e) => sum + e.amount, 0);
  
  // Create financial summaries
  const financialSummary = [
    { 
      title: "Total Revenue", 
      value: totalIncome, 
      color: "text-blue-600",
      icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
      trend: "+8% from last month"
    },
    { 
      title: "Total Expenses", 
      value: totalExpenses + totalContractorCosts, 
      color: "text-red-600",
      icon: <TrendingDown className="h-5 w-5 text-red-600" />,
      trend: "-3% from last month" 
    },
    { 
      title: "Material Costs", 
      value: expenses.filter(e => e.category === "materials").reduce((sum, e) => sum + e.amount, 0), 
      color: "text-amber-600",
      icon: <DollarSign className="h-5 w-5 text-amber-600" />,
      trend: "32% of expenses"
    },
    { 
      title: "Labor Costs", 
      value: totalContractorCosts, 
      color: "text-purple-600",
      icon: <Users className="h-5 w-5 text-purple-600" />,
      trend: "45% of expenses" 
    },
  ];
  
  const projectedProfit = totalIncome - (totalExpenses + totalContractorCosts);
  const profitMargin = totalIncome > 0 ? (projectedProfit / totalIncome) * 100 : 0;
  
  // Get expense categories
  const expenseCategories = Array.from(new Set(expenses.map(e => e.category)));
  
  // Filter expenses based on category
  const filteredExpenses = expenses.filter(expense => {
    if (expenseCategory === "all") return true;
    return expense.category === expenseCategory;
  });
  
  // Expense breakdown for chart
  const expenseBreakdown = expenseCategories.map(category => {
    const categoryExpenses = expenses.filter(e => e.category === category);
    const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: total,
      color: expenseCategoryColors[category] || "#94a3b8"
    };
  });
  
  // Calculate expense distribution
  const totalExpensesSum = expenseBreakdown.reduce((sum, item) => sum + item.value, 0);
  
  // Quote handlers
  const handleCreateQuote = (quote: ProjectQuote) => {
    if (selectedQuote) {
      // Update existing quote
      setQuotes(prev => prev.map(q => q.id === quote.id ? quote : q));
      setSelectedQuote(undefined);
    } else {
      // Add new quote
      setQuotes(prev => [...prev, quote]);
    }
  };
  
  const handleEditQuote = (quote: ProjectQuote) => {
    setSelectedQuote(quote);
    setShowQuoteModal(true);
  };
  
  const handleQuoteAction = (quote: ProjectQuote, action: "send" | "accept" | "reject") => {
    const updatedQuotes = quotes.map(q => {
      if (q.id === quote.id) {
        let newStatus: ProjectQuote["status"] = q.status;
        
        switch(action) {
          case "send":
            newStatus = "sent";
            toast.success("Quote sent to client");
            break;
          case "accept":
            newStatus = "accepted";
            toast.success("Quote marked as accepted");
            break;
          case "reject":
            newStatus = "rejected";
            toast.error("Quote marked as rejected");
            break;
        }
        
        return {
          ...q,
          status: newStatus,
          sentAt: action === "send" ? new Date().toISOString().split('T')[0] : q.sentAt
        };
      }
      return q;
    });
    
    setQuotes(updatedQuotes);
  };
  
  // Invoice handlers
  const handleCreateInvoice = (invoice: ProjectInvoice) => {
    if (selectedInvoice) {
      // Update existing invoice
      setInvoices(prev => prev.map(i => i.id === invoice.id ? invoice : i));
      setSelectedInvoice(undefined);
    } else {
      // Add new invoice
      setInvoices(prev => [...prev, invoice]);
    }
  };
  
  const handleEditInvoice = (invoice: ProjectInvoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };
  
  const handleInvoiceAction = (invoice: ProjectInvoice, action: "send" | "mark-paid" | "cancel") => {
    const updatedInvoices = invoices.map(i => {
      if (i.id === invoice.id) {
        let newStatus: ProjectInvoice["status"] = i.status;
        
        switch(action) {
          case "send":
            newStatus = "sent";
            toast.success("Invoice sent to contractor");
            break;
          case "mark-paid":
            newStatus = "paid";
            toast.success("Invoice marked as paid");
            break;
          case "cancel":
            newStatus = "cancelled";
            toast.error("Invoice cancelled");
            break;
        }
        
        return {
          ...i,
          status: newStatus,
          sentAt: action === "send" ? new Date().toISOString().split('T')[0] : i.sentAt,
          paidDate: action === "mark-paid" && !i.paidDate ? new Date().toISOString().split('T')[0] : i.paidDate,
          paidAmount: action === "mark-paid" && !i.paidAmount ? i.totalAmount : i.paidAmount
        };
      }
      return i;
    });
    
    setInvoices(updatedInvoices);
  };
  
  // Add new expense
  const handleAddExpense = () => {
    // In a real app, this would open a modal
    toast.success("Expense added successfully");
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {financialSummary.map((item, index) => (
          <Card key={index} className="overflow-hidden bg-gradient-to-br from-white to-gray-50 border-t-4" style={{ borderTopColor: item.color.replace('text-', '') }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-500">{item.title}</h4>
                {item.icon}
              </div>
              <div className="space-y-1">
                <p className={`text-2xl font-bold ${item.color}`}>
                  {formatCurrency(item.value)}
                </p>
                <p className="text-xs text-muted-foreground">{item.trend}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Profit Summary */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-2">
          <CardTitle>Profit Summary</CardTitle>
          <CardDescription>Project financial health overview</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Profit metrics */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Projected Profit</h3>
                  <span className={`text-xl font-bold ${projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(projectedProfit)}
                  </span>
                </div>
                <Progress 
                  value={profitMargin > 0 ? profitMargin : 0} 
                  max={100}
                  className={`h-2 ${profitMargin >= 20 ? 'bg-green-600' : profitMargin >= 10 ? 'bg-amber-500' : 'bg-red-500'}`}
                />
                <div className="flex justify-between mt-1 text-sm">
                  <span className="text-muted-foreground">Profit Margin</span>
                  <span className={`font-medium ${profitMargin >= 20 ? 'text-green-600' : profitMargin >= 10 ? 'text-amber-600' : 'text-red-600'}`}>
                    {profitMargin.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Budget vs Actual</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget</span>
                      <span className="font-medium">{formatCurrency(project.budget)}</span>
                    </div>
                    <Progress value={100} max={100} className="h-2 bg-blue-600" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Actual Spent</span>
                      <span className="font-medium">{formatCurrency(totalExpenses + totalContractorCosts)}</span>
                    </div>
                    <Progress 
                      value={(totalExpenses + totalContractorCosts) / project.budget * 100} 
                      max={100} 
                      className={`h-2 ${(totalExpenses + totalContractorCosts) <= project.budget ? 'bg-green-600' : 'bg-red-600'}`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Revenue vs Expenses</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Revenue</span>
                      <span className="font-medium text-blue-600">{formatCurrency(totalIncome)}</span>
                    </div>
                    <Progress value={100} max={100} className="h-2 bg-blue-600" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Expenses</span>
                      <span className="font-medium text-red-600">{formatCurrency(totalExpenses + totalContractorCosts)}</span>
                    </div>
                    <Progress 
                      value={(totalExpenses + totalContractorCosts) / (totalIncome > 0 ? totalIncome : 1) * 100} 
                      max={100} 
                      className="h-2 bg-red-600"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Middle column: Expense breakdown */}
            <div className="space-y-4">
              <h3 className="font-medium">Expense Breakdown</h3>
              <div className="space-y-4">
                {expenseBreakdown.map((category) => (
                  <div key={category.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                        <span>{category.name}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(category.value)}</span>
                    </div>
                    <Progress 
                      value={totalExpensesSum > 0 ? (category.value / totalExpensesSum) * 100 : 0} 
                      max={100} 
                      className="h-1"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="text-right text-xs text-muted-foreground">
                      {totalExpensesSum > 0 ? ((category.value / totalExpensesSum) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right column: Cost Distribution */}
            <div className="space-y-4">
              <h3 className="font-medium">Cost Distribution</h3>
              <div className="h-52 flex items-center justify-center">
                <div className="relative h-40 w-40">
                  <div className="absolute inset-0 rounded-full bg-blue-100 border border-blue-200"></div>
                  {/* This would be replaced with a proper chart in a real app */}
                  <div className="absolute inset-5 rounded-full bg-white flex items-center justify-center border">
                    <div className="text-center">
                      <div className="text-xl font-bold">{formatCurrency(totalExpenses + totalContractorCosts)}</div>
                      <div className="text-xs text-muted-foreground">Total Cost</div>
                    </div>
                  </div>
                  
                  {/* Sample pie chart segments */}
                  <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }}>
                    <div className="absolute inset-0 rounded-full" style={{ backgroundColor: expenseCategoryColors.materials }}></div>
                  </div>
                  <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 50%)' }}>
                    <div className="absolute inset-0 rounded-full" style={{ backgroundColor: expenseCategoryColors.equipment }}></div>
                  </div>
                  <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(50% 50%, 0 0, 50% 0)' }}>
                    <div className="absolute inset-0 rounded-full" style={{ backgroundColor: expenseCategoryColors.labor }}></div>
                  </div>
                  <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 0)' }}>
                    <div className="absolute inset-0 rounded-full" style={{ backgroundColor: expenseCategoryColors.permits }}></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {expenseBreakdown.map((category) => (
                  <div key={category.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span>{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quotes and Invoices Section */}
      <Tabs value={financeTab} onValueChange={setFinanceTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Expenses</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Project Expenses</h3>
            <div className="flex items-center gap-2">
              <Select 
                value={expenseCategory} 
                onValueChange={setExpenseCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleAddExpense}>
                <Plus className="h-4 w-4 mr-1" /> Add Expense
              </Button>
            </div>
          </div>
          
          {filteredExpenses.length > 0 ? (
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <Card key={expense.id} className="overflow-hidden">
                  <div className="grid grid-cols-12 items-center p-4">
                    <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gray-100">
                        <Receipt className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{expense.name}</p>
                        <p className="text-sm text-gray-500">{expense.description}</p>
                      </div>
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <Badge className={`
                        ${expense.category === 'materials' ? 'bg-blue-100 text-blue-800' : 
                          expense.category === 'equipment' ? 'bg-amber-100 text-amber-800' : 
                          expense.category === 'labor' ? 'bg-green-100 text-green-800' : 
                          expense.category === 'permits' ? 'bg-purple-100 text-purple-800' : 
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                      </Badge>
                    </div>
                    <div className="col-span-3 md:col-span-2 text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">{expense.paymentMethod}</p>
                    </div>
                    <div className="hidden md:block md:col-span-2 text-right">
                      <Badge className={`
                        ${expense.status === 'paid' ? 'bg-green-100 text-green-800' : 
                          expense.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'}
                      `}>
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="col-span-3 md:col-span-1 text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                    </div>
                  </div>
                </Card>
              ))}
              
              <div className="flex justify-between items-center pt-2 px-2">
                <p className="text-sm text-muted-foreground">Showing {filteredExpenses.length} expenses</p>
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">
                    {formatCurrency(filteredExpenses.reduce((sum, e) => sum + e.amount, 0))}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md bg-gray-50">
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-lg font-medium text-gray-500">No expenses found</p>
              <p className="text-gray-400 max-w-md mx-auto mt-2 mb-4">
                {expenseCategory === "all" 
                  ? "Track expenses for materials, equipment, and other project costs" 
                  : `No expenses in the "${expenseCategory}" category`}
              </p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add First Expense
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="quotes" className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Client Quotes</h3>
            <Button onClick={() => {
              setSelectedQuote(undefined);
              setShowQuoteModal(true);
            }}>
              <Plus className="h-4 w-4 mr-1" /> Create Quote
            </Button>
          </div>
          
          {/* Quote content stays the same */}
          {quotes.length > 0 ? (
            <div className="grid gap-4">
              {quotes.map((quote) => (
                <Card key={quote.id} className="overflow-hidden">
                  <div className="bg-gray-50 border-b px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Quote for {quote.clientName}</p>
                        <p className="text-sm text-muted-foreground">
                          Created on {new Date(quote.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={quoteStatusColors[quote.status]}>
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-semibold">{formatCurrency(quote.totalAmount)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Valid Until</p>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <p>{new Date(quote.validUntil).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Items</p>
                        <p>{quote.items.length} item{quote.items.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditQuote(quote)}
                      >
                        Edit
                      </Button>
                      
                      {quote.status === "draft" && (
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleQuoteAction(quote, "send")}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send to Client
                        </Button>
                      )}
                      
                      {quote.status === "sent" && (
                        <>
                          <Button 
                            size="sm" 
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleQuoteAction(quote, "accept")}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark Accepted
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleQuoteAction(quote, "reject")}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Mark Rejected
                          </Button>
                        </>
                      )}
                      
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md bg-gray-50">
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-lg font-medium text-gray-500">No quotes created yet</p>
              <p className="text-gray-400 max-w-md mx-auto mt-2 mb-4">
                Create and send quotes to clients for this project
              </p>
              <Button onClick={() => setShowQuoteModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Quote
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Contractor Invoices</h3>
            <Button onClick={() => {
              setSelectedInvoice(undefined);
              setShowInvoiceModal(true);
            }}>
              <Plus className="h-4 w-4 mr-1" /> Create Invoice
            </Button>
          </div>
          
          {/* Invoice content stays the same */}
          {invoices.length > 0 ? (
            <div className="grid gap-4">
              {invoices.map((invoice) => (
                <Card key={invoice.id} className="overflow-hidden">
                  <div className="bg-gray-50 border-b px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="font-medium">Invoice for {invoice.contractorName}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.reference} • Created on {new Date(invoice.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={invoiceStatusColors[invoice.status]}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-semibold">{formatCurrency(invoice.totalAmount)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {invoice.status === "paid" && invoice.paidDate && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Paid On</p>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                            <p>{new Date(invoice.paidDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Items</p>
                        <p>{invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditInvoice(invoice)}
                      >
                        Edit
                      </Button>
                      
                      {invoice.status === "draft" && (
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleInvoiceAction(invoice, "send")}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send to Contractor
                        </Button>
                      )}
                      
                      {(invoice.status === "sent" || invoice.status === "overdue") && (
                        <>
                          <Button 
                            size="sm" 
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleInvoiceAction(invoice, "mark-paid")}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark as Paid
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleInvoiceAction(invoice, "cancel")}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel Invoice
                          </Button>
                        </>
                      )}
                      
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md bg-gray-50">
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-lg font-medium text-gray-500">No invoices created yet</p>
              <p className="text-gray-400 max-w-md mx-auto mt-2 mb-4">
                Create and manage invoices for contractors working on this project
              </p>
              <Button onClick={() => setShowInvoiceModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Invoice
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      <ProjectQuoteModal 
        open={showQuoteModal}
        onOpenChange={setShowQuoteModal}
        project={project}
        onCreateQuote={handleCreateQuote}
        existingQuote={selectedQuote}
      />
      
      <ProjectInvoiceModal
        open={showInvoiceModal}
        onOpenChange={setShowInvoiceModal}
        project={project}
        onCreateInvoice={handleCreateInvoice}
        existingInvoice={selectedInvoice}
      />
    </div>
  );
};

export default ProjectFinanceTab;
