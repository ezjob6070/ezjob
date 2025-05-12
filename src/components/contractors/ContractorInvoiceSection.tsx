
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContractorDetail, ContractorInvoice, ContractorQuote } from "@/types/contractor";
import { Plus, FileText, Send, Check, X, Clock, Receipt, Mail, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContractorInvoiceSectionProps {
  contractor: ContractorDetail;
}

const ContractorInvoiceSection = ({ contractor }: ContractorInvoiceSectionProps) => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<ContractorInvoice | null>(null);
  const [editingQuote, setEditingQuote] = useState<ContractorQuote | null>(null);

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setShowInvoiceModal(true);
  };

  const handleCreateQuote = () => {
    setEditingQuote(null);
    setShowQuoteModal(true);
  };

  const handleEditInvoice = (invoice: ContractorInvoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleEditQuote = (quote: ContractorQuote) => {
    setEditingQuote(quote);
    setShowQuoteModal(true);
  };

  const handleSaveInvoice = () => {
    // This would have actual form handling and validation
    toast.success(editingInvoice ? "Invoice updated" : "Invoice created");
    setShowInvoiceModal(false);
  };

  const handleSaveQuote = () => {
    // This would have actual form handling and validation
    toast.success(editingQuote ? "Quote updated" : "Quote created");
    setShowQuoteModal(false);
  };

  const handleSendInvoice = (invoiceId: string) => {
    toast.success("Invoice sent to contractor");
  };

  const handleSendQuote = (quoteId: string) => {
    toast.success("Quote sent to contractor");
  };

  return (
    <>
      <Tabs defaultValue="invoices" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
        </TabsList>
        
        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Contractor Invoices</h2>
            <Button onClick={handleCreateInvoice} className="flex items-center gap-2">
              <Plus size={16} />
              Create Invoice
            </Button>
          </div>
          
          {contractor.invoices && contractor.invoices.length > 0 ? (
            <div className="space-y-4">
              {contractor.invoices.map((invoice) => (
                <Card key={invoice.id} className="border-l-4 border-green-500">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Receipt size={18} className="text-green-500 mr-2" />
                          <h3 className="font-medium">{invoice.invoiceNumber}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {invoice.projectName ? `Project: ${invoice.projectName}` : "General Invoice"}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          invoice.status === "paid" ? "success" :
                          invoice.status === "sent" ? "default" :
                          invoice.status === "draft" ? "outline" :
                          invoice.status === "overdue" ? "destructive" : "secondary"
                        }>
                          {invoice.status}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditInvoice(invoice)}
                        >
                          <FileText size={14} className="mr-1" /> View & Edit
                        </Button>
                        {invoice.status === "draft" && (
                          <Button
                            size="sm"
                            onClick={() => handleSendInvoice(invoice.id)}
                          >
                            <Send size={14} className="mr-1" /> Send
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm">{invoice.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Due Date</p>
                        <p className="text-sm">{invoice.dueDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Description</p>
                        <p className="text-sm">{invoice.description || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-sm font-medium">${invoice.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Receipt size={48} className="text-muted-foreground mb-3" />
                <h3 className="font-medium mb-1">No invoices found</h3>
                <p className="text-muted-foreground mb-4">Create your first invoice for this contractor</p>
                <Button onClick={handleCreateInvoice}>
                  <Plus size={16} className="mr-2" />
                  Create Invoice
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Quotes Tab */}
        <TabsContent value="quotes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Contractor Quotes</h2>
            <Button onClick={handleCreateQuote} className="flex items-center gap-2">
              <Plus size={16} />
              Create Quote
            </Button>
          </div>
          
          {contractor.quotes && contractor.quotes.length > 0 ? (
            <div className="space-y-4">
              {contractor.quotes.map((quote) => (
                <Card key={quote.id} className="border-l-4 border-blue-500">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <FileText size={18} className="text-blue-500 mr-2" />
                          <h3 className="font-medium">{quote.quoteNumber}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {quote.projectName ? `Project: ${quote.projectName}` : "General Quote"}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          quote.status === "accepted" ? "success" :
                          quote.status === "sent" ? "default" :
                          quote.status === "draft" ? "outline" :
                          quote.status === "rejected" ? "destructive" : "secondary"
                        }>
                          {quote.status}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditQuote(quote)}
                        >
                          <FileText size={14} className="mr-1" /> View & Edit
                        </Button>
                        {quote.status === "draft" && (
                          <Button
                            size="sm"
                            onClick={() => handleSendQuote(quote.id)}
                          >
                            <Send size={14} className="mr-1" /> Send
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm">{quote.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Valid Until</p>
                        <p className="text-sm">{quote.validUntil}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Description</p>
                        <p className="text-sm">{quote.description || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-sm font-medium">${quote.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <FileText size={48} className="text-muted-foreground mb-3" />
                <h3 className="font-medium mb-1">No quotes found</h3>
                <p className="text-muted-foreground mb-4">Create your first quote for this contractor</p>
                <Button onClick={handleCreateQuote}>
                  <Plus size={16} className="mr-2" />
                  Create Quote
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create/Edit Invoice Modal */}
      <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingInvoice ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
            <DialogDescription>
              {editingInvoice 
                ? `Editing invoice ${editingInvoice.invoiceNumber}`
                : `Creating a new invoice for ${contractor.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input 
                  id="invoiceNumber" 
                  defaultValue={editingInvoice?.invoiceNumber || `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`} 
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  defaultValue={editingInvoice?.amount || ""} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  defaultValue={editingInvoice?.date || new Date().toISOString().split('T')[0]} 
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date" 
                  defaultValue={editingInvoice?.dueDate || ""} 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="project">Project (Optional)</Label>
              <select 
                id="project" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={editingInvoice?.projectId || ""}
              >
                <option value="">Select a project</option>
                {contractor.projects?.map((project) => (
                  <option key={project.id} value={project.projectId}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                defaultValue={editingInvoice?.description || ""} 
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <select 
                id="status" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={editingInvoice?.status || "draft"}
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowInvoiceModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveInvoice}>
                {editingInvoice ? "Update Invoice" : "Create Invoice"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Create/Edit Quote Modal */}
      <Dialog open={showQuoteModal} onOpenChange={setShowQuoteModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingQuote ? "Edit Quote" : "Create New Quote"}</DialogTitle>
            <DialogDescription>
              {editingQuote 
                ? `Editing quote ${editingQuote.quoteNumber}`
                : `Creating a new quote for ${contractor.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quoteNumber">Quote Number</Label>
                <Input 
                  id="quoteNumber" 
                  defaultValue={editingQuote?.quoteNumber || `Q-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`} 
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  defaultValue={editingQuote?.amount || ""} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  defaultValue={editingQuote?.date || new Date().toISOString().split('T')[0]} 
                />
              </div>
              <div>
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input 
                  id="validUntil" 
                  type="date" 
                  defaultValue={editingQuote?.validUntil || ""} 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="project">Project (Optional)</Label>
              <select 
                id="project" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={editingQuote?.projectId || ""}
              >
                <option value="">Select a project</option>
                {contractor.projects?.map((project) => (
                  <option key={project.id} value={project.projectId}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                defaultValue={editingQuote?.description || ""} 
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <select 
                id="status" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={editingQuote?.status || "draft"}
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowQuoteModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveQuote}>
                {editingQuote ? "Update Quote" : "Create Quote"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContractorInvoiceSection;
