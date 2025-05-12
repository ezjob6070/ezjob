
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Project, ProjectQuote, ProjectInvoice } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { CalendarIcon, FileText, Plus, Send, Download, Check, X, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import ProjectQuoteModal from "@/components/projects/ProjectQuoteModal";
import ProjectInvoiceModal from "@/components/projects/ProjectInvoiceModal";

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
  
  // Project quotes & invoices
  const [quotes, setQuotes] = useState<ProjectQuote[]>(project.quotes || []);
  const [invoices, setInvoices] = useState<ProjectInvoice[]>(project.invoices || []);
  
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
  
  // Calculate finances
  const totalIncome = quotes
    .filter(q => q.status === "accepted")
    .reduce((sum, q) => sum + q.totalAmount, 0);
    
  const totalContractorCosts = invoices
    .filter(i => i.status === "paid")
    .reduce((sum, i) => sum + (i.paidAmount || i.totalAmount), 0);
  
  // Create financial summaries
  const financialSummary = [
    { title: "Budget", value: project.budget, color: "text-blue-600" },
    { title: "Spent", value: project.actualSpent, color: "text-amber-600" },
    { title: "Quoted Revenue", value: totalIncome, color: "text-green-600" },
    { title: "Contractor Payments", value: totalContractorCosts, color: "text-red-600" },
  ];
  
  const projectedProfit = totalIncome - project.actualSpent;
  const profitMargin = totalIncome > 0 ? (projectedProfit / totalIncome) * 100 : 0;
  
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
          sentAt: action === "send" ? format(new Date(), 'yyyy-MM-dd') : q.sentAt
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
          sentAt: action === "send" ? format(new Date(), 'yyyy-MM-dd') : i.sentAt,
          paidDate: action === "mark-paid" && !i.paidDate ? format(new Date(), 'yyyy-MM-dd') : i.paidDate,
          paidAmount: action === "mark-paid" && !i.paidAmount ? i.totalAmount : i.paidAmount
        };
      }
      return i;
    });
    
    setInvoices(updatedInvoices);
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>Key financial metrics for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {financialSummary.map((item, index) => (
              <div key={index} className="space-y-2">
                <p className="text-sm text-muted-foreground">{item.title}</p>
                <p className={`text-2xl font-bold ${item.color}`}>
                  {formatCurrency(item.value)}
                </p>
              </div>
            ))}
          </div>
          
          {/* Profit Calculation */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Projected Profit:</span>
              <span className={`text-lg font-bold ${projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(projectedProfit)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-muted-foreground">Profit Margin:</span>
              <span className={`${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(1)}%
              </span>
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
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Expense
            </Button>
          </div>
          
          {/* This is a placeholder for expenses that could be implemented later */}
          <div className="text-center py-8 border rounded-md bg-gray-50">
            <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-500">No expenses recorded yet</p>
            <p className="text-gray-400 max-w-md mx-auto mt-2 mb-4">
              Track expenses for materials, equipment, and other project costs
            </p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add First Expense
            </Button>
          </div>
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
                          Created on {format(new Date(quote.createdAt), 'MMM d, yyyy')}
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
                          <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          <p>{format(new Date(quote.validUntil), 'MMM d, yyyy')}</p>
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
                          {invoice.reference} • Created on {format(new Date(invoice.createdAt), 'MMM d, yyyy')}
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
                          <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          <p>{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                      {invoice.status === "paid" && invoice.paidDate && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Paid On</p>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                            <p>{format(new Date(invoice.paidDate), 'MMM d, yyyy')}</p>
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
