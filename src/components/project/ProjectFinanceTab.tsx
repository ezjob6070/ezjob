
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { DollarSign, FileText, Plus, PieChart, Receipt, SendHorizontal, TrendingUp, ArrowUpRight, ArrowDownRight, FileCheck } from "lucide-react";
import { Project, ProjectExpense, ProjectInvoice, ProjectQuote } from "@/types/project";
import { Separator } from "@/components/ui/separator";
import ProjectQuoteModal from "@/components/projects/ProjectQuoteModal";
import ProjectInvoiceModal from "@/components/projects/ProjectInvoiceModal";
import { toast } from "sonner";

interface ProjectFinanceTabProps {
  project: Project;
}

const ProjectFinanceTab: React.FC<ProjectFinanceTabProps> = ({ project }) => {
  const [activeFinanceTab, setActiveFinanceTab] = useState("overview");
  const [expenses, setExpenses] = useState(project.expenses || []);
  const [quotes, setQuotes] = useState<ProjectQuote[]>(project.quotes || []);
  const [invoices, setInvoices] = useState<ProjectInvoice[]>(project.invoices || []);
  const [expenseFilter, setExpenseFilter] = useState("all");
  const [expenseSearchQuery, setExpenseSearchQuery] = useState("");
  const [quoteFilter, setQuoteFilter] = useState("all");
  const [invoiceFilter, setInvoiceFilter] = useState("all");

  // Modal states
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<ProjectQuote | undefined>();
  const [editingInvoice, setEditingInvoice] = useState<ProjectInvoice | undefined>();

  // Calculate total project revenue (using the revenue property or sum of completed quotes)
  const totalRevenue = useMemo(() => {
    if (project.revenue) return project.revenue;
    
    const acceptedQuotes = quotes.filter(q => q.status === "accepted");
    return acceptedQuotes.reduce((sum, quote) => sum + quote.total, 0);
  }, [project.revenue, quotes]);

  // Calculate profit
  const totalProfit = useMemo(() => {
    return totalRevenue - project.actualSpent;
  }, [totalRevenue, project.actualSpent]);

  // Filter expenses based on current filter
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];
    
    // Filter by status
    if (expenseFilter !== "all") {
      filtered = filtered.filter(expense => expense.status === expenseFilter);
    }
    
    // Filter by search query
    if (expenseSearchQuery) {
      const query = expenseSearchQuery.toLowerCase();
      filtered = filtered.filter(expense => 
        expense.name.toLowerCase().includes(query) || 
        expense.category.toLowerCase().includes(query) ||
        expense.description?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [expenses, expenseFilter, expenseSearchQuery]);
  
  // Filter quotes based on current filter
  const filteredQuotes = useMemo(() => {
    if (quoteFilter === "all") return quotes;
    return quotes.filter(quote => quote.status === quoteFilter);
  }, [quotes, quoteFilter]);
  
  // Filter invoices based on current filter
  const filteredInvoices = useMemo(() => {
    if (invoiceFilter === "all") return invoices;
    return invoices.filter(invoice => invoice.status === invoiceFilter);
  }, [invoices, invoiceFilter]);

  // Calculate expense categories breakdown
  const expenseCategories = useMemo(() => {
    const categories: Record<string, number> = {};
    
    expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });
    
    return Object.entries(categories)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);
  
  // Calculate expense status breakdown
  const expenseStatuses = useMemo(() => {
    const paid = expenses.filter(e => e.status === "paid")
      .reduce((sum, e) => sum + e.amount, 0);
    const pending = expenses.filter(e => e.status === "pending")
      .reduce((sum, e) => sum + e.amount, 0);
    const cancelled = expenses.filter(e => e.status === "cancelled")
      .reduce((sum, e) => sum + e.amount, 0);
    
    return { paid, pending, cancelled };
  }, [expenses]);

  // Calculate metrics for quotes
  const quoteMetrics = useMemo(() => {
    const total = quotes.length;
    const accepted = quotes.filter(q => q.status === "accepted").length;
    const pending = quotes.filter(q => q.status === "sent").length;
    const rejected = quotes.filter(q => q.status === "rejected").length;
    const acceptanceRate = total > 0 ? (accepted / total * 100).toFixed(1) : "0";
    
    const totalValue = quotes.reduce((sum, q) => sum + q.total, 0);
    const acceptedValue = quotes.filter(q => q.status === "accepted")
      .reduce((sum, q) => sum + q.total, 0);
    
    return {
      total,
      accepted,
      pending,
      rejected,
      acceptanceRate,
      totalValue,
      acceptedValue
    };
  }, [quotes]);

  // Calculate metrics for invoices
  const invoiceMetrics = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter(i => i.status === "paid").length;
    const pending = invoices.filter(i => i.status === "sent").length;
    const overdue = invoices.filter(i => i.status === "overdue").length;
    const paymentRate = total > 0 ? (paid / total * 100).toFixed(1) : "0";
    
    const totalValue = invoices.reduce((sum, i) => sum + i.total, 0);
    const paidValue = invoices.filter(i => i.status === "paid")
      .reduce((sum, i) => sum + i.total, 0);
    
    return {
      total,
      paid,
      pending,
      overdue,
      paymentRate,
      totalValue,
      paidValue
    };
  }, [invoices]);

  // Handle adding a new expense (placeholder function)
  const handleAddExpense = () => {
    toast.info("Add expense functionality would be implemented here");
  };

  // Handle editing of quotes
  const handleEditQuote = (quote: ProjectQuote) => {
    setEditingQuote(quote);
    setShowQuoteModal(true);
  };

  // Handle creating or updating quotes
  const handleSaveQuote = (quote: ProjectQuote) => {
    if (editingQuote) {
      // Update existing quote
      setQuotes(prev => prev.map(q => q.id === quote.id ? quote : q));
    } else {
      // Add new quote
      setQuotes(prev => [...prev, quote]);
    }
    setEditingQuote(undefined);
  };

  // Handle editing of invoices
  const handleEditInvoice = (invoice: ProjectInvoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceModal(true);
  };

  // Handle creating or updating invoices
  const handleSaveInvoice = (invoice: ProjectInvoice) => {
    if (editingInvoice) {
      // Update existing invoice
      setInvoices(prev => prev.map(i => i.id === invoice.id ? invoice : i));
    } else {
      // Add new invoice
      setInvoices(prev => [...prev, invoice]);
    }
    setEditingInvoice(undefined);
  };

  // Handle sending quote/invoice (placeholder function)
  const handleSendDocument = (type: 'quote' | 'invoice', id: string) => {
    if (type === 'quote') {
      setQuotes(prev => 
        prev.map(q => q.id === id ? {...q, status: "sent", lastSent: format(new Date(), "yyyy-MM-dd")} : q)
      );
      toast.success("Quote marked as sent");
    } else {
      setInvoices(prev => 
        prev.map(i => i.id === id ? {...i, status: "sent", lastSent: format(new Date(), "yyyy-MM-dd")} : i)
      );
      toast.success("Invoice marked as sent");
    }
  };

  // This function would be needed but we don't have an import for it
  const format = (date: Date, format: string): string => {
    // Simple function to format date as YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  return (
    <>
      <Tabs defaultValue="overview" value={activeFinanceTab} onValueChange={setActiveFinanceTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="quotes">Client Quotes</TabsTrigger>
          <TabsTrigger value="invoices">Contractor Invoices</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <p className="text-muted-foreground text-sm flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  From {quoteMetrics.accepted} accepted quotes
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-red-500" />
                  Total Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(project.actualSpent)}</div>
                <p className="text-muted-foreground text-sm flex items-center mt-1">
                  {project.budget > project.actualSpent ? (
                    <>
                      <ArrowDownRight className="h-4 w-4 mr-1 text-green-500" />
                      {(project.actualSpent / project.budget * 100).toFixed(1)}% of budget
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-4 w-4 mr-1 text-red-500" />
                      {((project.actualSpent - project.budget) / project.budget * 100).toFixed(1)}% over budget
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-green-500" />
                  Total Profit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalProfit)}
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  {totalProfit >= 0 ? 'Profit margin: ' : 'Loss margin: '}
                  <span className={totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {totalRevenue > 0 
                      ? Math.abs((totalProfit / totalRevenue * 100)).toFixed(1) + '%' 
                      : '0%'
                    }
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expense Breakdown Card */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>How project expenses are distributed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {expenseCategories.length > 0 ? (
                  <>
                    {expenseCategories.map(({ category, amount }, index) => (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{category}</span>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'][index % 5]
                            }`} 
                            style={{ width: `${(amount / project.actualSpent) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No expense data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profit Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profit Summary</CardTitle>
                <CardDescription>Financial performance analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">{formatCurrency(project.budget)}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-sm text-muted-foreground">Actual</p>
                    <p className="font-medium">{formatCurrency(project.actualSpent)}</p>
                  </div>
                  <div className={`p-2 rounded-md ${project.budget >= project.actualSpent ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className="text-sm text-muted-foreground">Variance</p>
                    <p className={`font-medium ${project.budget >= project.actualSpent ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(project.budget - project.actualSpent)}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Status Breakdown */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Expense Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Paid</span>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency(expenseStatuses.paid)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency(expenseStatuses.pending)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm">Cancelled</span>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency(expenseStatuses.cancelled)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Quote/Invoice Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Quotes</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Quotes:</span>
                        <span className="font-medium">{quoteMetrics.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Acceptance Rate:</span>
                        <span className="font-medium">{quoteMetrics.acceptanceRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Value:</span>
                        <span className="font-medium">{formatCurrency(quoteMetrics.acceptedValue)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Invoices</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Invoices:</span>
                        <span className="font-medium">{invoiceMetrics.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Rate:</span>
                        <span className="font-medium">{invoiceMetrics.paymentRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Value:</span>
                        <span className="font-medium">{formatCurrency(invoiceMetrics.paidValue)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Expenses</h2>
              <p className="text-muted-foreground">
                Manage and track project expenses
              </p>
            </div>
            <Button onClick={handleAddExpense} className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Expense
            </Button>
          </div>
          
          {/* Filter and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-64">
              <Select value={expenseFilter} onValueChange={setExpenseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expenses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Input 
                placeholder="Search expenses by name, category, or description..." 
                value={expenseSearchQuery}
                onChange={(e) => setExpenseSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Expenses Table */}
          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b">
                    <th className="text-left whitespace-nowrap px-4 py-2 font-medium">Name</th>
                    <th className="text-left whitespace-nowrap px-4 py-2 font-medium">Category</th>
                    <th className="text-left whitespace-nowrap px-4 py-2 font-medium">Date</th>
                    <th className="text-right whitespace-nowrap px-4 py-2 font-medium">Amount</th>
                    <th className="text-center whitespace-nowrap px-4 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense: ProjectExpense) => (
                      <tr key={expense.id} className="border-b last:border-b-0 hover:bg-slate-50">
                        <td className="px-4 py-2">{expense.name}</td>
                        <td className="px-4 py-2">{expense.category}</td>
                        <td className="px-4 py-2">{expense.date}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(expense.amount)}</td>
                        <td className="px-4 py-2 text-center">
                          <Badge variant={
                            expense.status === "paid" ? "success" : 
                            expense.status === "pending" ? "warning" : "destructive"
                          }>
                            {expense.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No expenses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        {/* Quotes Tab */}
        <TabsContent value="quotes" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Client Quotes</h2>
              <p className="text-muted-foreground">
                Create and manage quotes for your clients
              </p>
            </div>
            <Button onClick={() => {
              setEditingQuote(undefined);
              setShowQuoteModal(true);
            }} className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> New Quote
            </Button>
          </div>
          
          {/* Filter */}
          <div className="w-full sm:w-64">
            <Select value={quoteFilter} onValueChange={setQuoteFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quotes</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Quotes List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map(quote => (
                <Card key={quote.id} className="overflow-hidden">
                  <div className="border-l-4 border-blue-500">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-3 sm:mb-0">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-blue-500" />
                            <h3 className="text-lg font-medium">{quote.quoteNumber}</h3>
                            <Badge variant={
                              quote.status === "accepted" ? "success" :
                              quote.status === "sent" ? "default" : 
                              quote.status === "draft" ? "outline" :
                              quote.status === "rejected" ? "destructive" : "secondary"
                            }>
                              {quote.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-1">{quote.clientName}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {quote.status === "draft" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSendDocument('quote', quote.id)}
                              className="flex items-center gap-1"
                            >
                              <SendHorizontal className="h-4 w-4" /> Send
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditQuote(quote)}
                            className="flex items-center gap-1"
                          >
                            <FileText className="h-4 w-4" /> View & Edit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Issue Date</p>
                          <p>{quote.issueDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Valid Until</p>
                          <p>{quote.validUntil}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Items</p>
                          <p>{quote.items.length} items</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-medium">{formatCurrency(quote.total)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 border rounded-md bg-slate-50">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No quotes created yet</h3>
                <p className="text-gray-500 mb-4">
                  Create a new quote for your client to get started
                </p>
                <Button onClick={() => {
                  setEditingQuote(undefined);
                  setShowQuoteModal(true);
                }} className="flex items-center gap-1 mx-auto">
                  <Plus className="h-4 w-4" /> Create Quote
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Contractor Invoices</h2>
              <p className="text-muted-foreground">
                Create and manage invoices for your contractors
              </p>
            </div>
            <Button onClick={() => {
              setEditingInvoice(undefined);
              setShowInvoiceModal(true);
            }} className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> New Invoice
            </Button>
          </div>
          
          {/* Filter */}
          <div className="w-full sm:w-64">
            <Select value={invoiceFilter} onValueChange={setInvoiceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Invoices</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Invoices List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map(invoice => (
                <Card key={invoice.id} className="overflow-hidden">
                  <div className="border-l-4 border-green-500">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-3 sm:mb-0">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-green-500" />
                            <h3 className="text-lg font-medium">{invoice.invoiceNumber}</h3>
                            <Badge variant={
                              invoice.status === "paid" ? "success" :
                              invoice.status === "sent" ? "default" : 
                              invoice.status === "draft" ? "outline" :
                              invoice.status === "overdue" ? "destructive" : "secondary"
                            }>
                              {invoice.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-1">{invoice.contractorName}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {invoice.status === "draft" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSendDocument('invoice', invoice.id)}
                              className="flex items-center gap-1"
                            >
                              <SendHorizontal className="h-4 w-4" /> Send
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditInvoice(invoice)}
                            className="flex items-center gap-1"
                          >
                            <FileText className="h-4 w-4" /> View & Edit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Issue Date</p>
                          <p>{invoice.issueDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Due Date</p>
                          <p>{invoice.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Items</p>
                          <p>{invoice.items.length} items</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-medium">{formatCurrency(invoice.total)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 border rounded-md bg-slate-50">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No invoices created yet</h3>
                <p className="text-gray-500 mb-4">
                  Create a new invoice for your contractor to get started
                </p>
                <Button onClick={() => {
                  setEditingInvoice(undefined);
                  setShowInvoiceModal(true);
                }} className="flex items-center gap-1 mx-auto">
                  <Plus className="h-4 w-4" /> Create Invoice
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      <ProjectQuoteModal
        open={showQuoteModal}
        onOpenChange={setShowQuoteModal}
        project={project}
        onSave={handleSaveQuote}
        editingQuote={editingQuote}
      />
      
      <ProjectInvoiceModal
        open={showInvoiceModal}
        onOpenChange={setShowInvoiceModal}
        project={project}
        onSave={handleSaveInvoice}
        editingInvoice={editingInvoice}
      />
    </>
  );
};

export default ProjectFinanceTab;
