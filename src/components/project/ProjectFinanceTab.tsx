
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
  
  // Calculate quote statistics
  const quoteStats = {
    draft: quotes.filter(q => q.status === "draft").length,
    sent: quotes.filter(q => q.status === "sent").length,
    accepted: quotes.filter(q => q.status === "accepted").length,
    rejected: quotes.filter(q => q.status === "rejected").length,
    expired: quotes.filter(q => q.status === "expired").length,
    totalValue: quotes.reduce((sum, q) => sum + q.totalAmount, 0),
    acceptedValue: quotes.filter(q => q.status === "accepted").reduce((sum, q) => sum + q.totalAmount, 0)
  };
  
  // Calculate invoice statistics
  const invoiceStats = {
    draft: invoices.filter(i => i.status === "draft").length,
    sent: invoices.filter(i => i.status === "sent").length,
    paid: invoices.filter(i => i.status === "paid").length,
    overdue: invoices.filter(i => i.status === "overdue").length,
    cancelled: invoices.filter(i => i.status === "cancelled").length,
    totalValue: invoices.reduce((sum, i) => sum + i.totalAmount, 0),
    paidValue: invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.paidAmount || i.totalAmount, 0)
  };
  
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
      
      {/* Tabs for Finance Overview, Expenses, Quotes and Invoices */}
      <Tabs value={financeTab} onValueChange={setFinanceTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Finance Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        {/* Finance Overview Tab - NEW */}
        <TabsContent value="overview" className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quote Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quote Summary</CardTitle>
                <CardDescription>Status of client quotes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Quotes</p>
                    <p className="text-2xl font-bold">{quotes.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(quoteStats.totalValue)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className={quoteStatusColors.draft}>Draft</Badge>
                      <span className="text-sm">{quoteStats.draft} quotes</span>
                    </div>
                    <Progress className="w-1/3 h-2" value={quotes.length > 0 ? (quoteStats.draft / quotes.length) * 100 : 0} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className={quoteStatusColors.sent}>Sent</Badge>
                      <span className="text-sm">{quoteStats.sent} quotes</span>
                    </div>
                    <Progress className="w-1/3 h-2" value={quotes.length > 0 ? (quoteStats.sent / quotes.length) * 100 : 0} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className={quoteStatusColors.accepted}>Accepted</Badge>
                      <span className="text-sm">{quoteStats.accepted} quotes</span>
                    </div>
                    <Progress className="w-1/3 h-2" value={quotes.length > 0 ? (quoteStats.accepted / quotes.length) * 100 : 0} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className={quoteStatusColors.rejected}>Rejected</Badge>
                      <span className="text-sm">{quoteStats.rejected} quotes</span>
                    </div>
                    <Progress className="w-1/3 h-2" value={quotes.length > 0 ? (quoteStats.rejected / quotes.length) * 100 : 0} />
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Acceptance Rate</span>
                    <span className="font-bold">
                      {quotes.length > 0
                        ? `${Math.round((quoteStats.accepted / (quoteStats.accepted + quoteStats.rejected)) * 100)}%`
                        : "0%"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Invoice Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invoice Summary</CardTitle>
                <CardDescription>Status of contractor invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Invoices</p>
                    <p className="text-2xl font-bold">{invoices.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(invoiceStats.totalValue)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className={invoiceStatusColors.draft}>Draft</Badge>
                      <span className="text-sm">{invoiceStats.draft} invoices</span>
                    </div>
                    <Progress className="w-1/3 h-2" value={invoices.length > 0 ? (invoiceStats.draft / invoices.length) * 100 : 0} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className={invoiceStatusColors.sent}>Sent</Badge>
                      <span className="text-sm">{invoiceStats.sent} invoices</span>
                    </div>
                    <Progress className="w-1/3 h-2" value={invoices.length > 0 ? (invoiceStats.sent / invoices.length) * 100 : 0} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className={invoiceStatusColors.paid}>Paid</Badge>
                      <span className="text-sm">{invoiceStats.paid} invoices</span>
                    </div>
                    <Progress className="w-1/3 h-2" value={invoices.length > 0 ? (invoiceStats.paid / invoices.length) * 100 : 0} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className={invoiceStatusColors.overdue}>Overdue</Badge>
                      <span className="text-sm">{invoiceStats.overdue} invoices</span>
                    </div>
                    <Progress className="w-1/3 h-2" value={invoices.length > 0 ? (invoiceStats.overdue / invoices.length) * 100 : 0} />
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Payment Rate</span>
                    <span className="font-bold">
                      {invoices.length > 0
                        ? `${Math.round((invoiceStats.paid / invoices.length) * 100)}%`
                        : "0%"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Expense Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expense Breakdown</CardTitle>
              <CardDescription>Project expense distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses + totalContractorCosts)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Material Costs</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(expenses.filter(e => e.category === "materials").reduce((sum, e) => sum + e.amount, 0))}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Contractor Payments</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalContractorCosts)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  {expenseBreakdown.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                        <span>{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{formatCurrency(category.value)}</span>
                        <span className="text-sm text-muted-foreground">
                          ({totalExpensesSum > 0 ? Math.round((category.value / totalExpensesSum) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex items-center justify-between border-t pt-2 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                      <span>Contractor Payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{formatCurrency(totalContractorCosts)}</span>
                      <span className="text-sm text-muted-foreground">
                        ({(totalExpensesSum + totalContractorCosts) > 0 
                          ? Math.round((totalContractorCosts / (totalExpensesSum + totalContractorCosts)) * 100) 
                          : 0}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Financial Health Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Health</CardTitle>
              <CardDescription>Project budget utilization and revenue comparison</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold">{formatCurrency(project.budget)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Spent So Far</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(project.actualSpent)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Net Balance</p>
                  <p className={`text-2xl font-bold ${totalIncome - project.actualSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totalIncome - project.actualSpent)}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Budget Utilization</span>
                    <span className="text-sm font-medium">
                      {project.budget > 0 ? Math.round((project.actualSpent / project.budget) * 100) : 0}%
                    </span>
                  </div>
                  <Progress 
                    className="h-2" 
                    value={project.budget > 0 ? (project.actualSpent / project.budget) * 100 : 0} 
                    color="bg-blue-600"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Invoices vs Revenue</span>
                    <span className="text-sm font-medium">
                      {totalIncome > 0 ? Math.round((invoiceStats.totalValue / totalIncome) * 100) : 0}%
                    </span>
                  </div>
                  <Progress 
                    className="h-2" 
                    value={totalIncome > 0 ? (invoiceStats.totalValue / totalIncome) * 100 : 0} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4 py-4">
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

