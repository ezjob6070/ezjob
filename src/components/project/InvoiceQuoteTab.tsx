
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Plus, FileText, Send, Receipt, Check, X, DollarSign } from "lucide-react";
import { Project, ProjectInvoice, ProjectQuote, InvoiceItem } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface InvoiceQuoteTabProps {
  project: Project;
  onUpdate?: (updatedProject: Project) => void;
}

const InvoiceQuoteTab: React.FC<InvoiceQuoteTabProps> = ({ project, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<ProjectInvoice | null>(null);
  const [editingQuote, setEditingQuote] = useState<ProjectQuote | null>(null);
  
  const invoices = project.invoices || [];
  const quotes = project.quotes || [];
  
  const handleCreateInvoice = (invoice: ProjectInvoice) => {
    const updatedInvoices = [...(project.invoices || []), invoice];
    if (onUpdate) {
      onUpdate({
        ...project,
        invoices: updatedInvoices
      });
    }
    toast.success(`Invoice #${invoice.number} created successfully`);
    setShowInvoiceDialog(false);
  };
  
  const handleCreateQuote = (quote: ProjectQuote) => {
    const updatedQuotes = [...(project.quotes || []), quote];
    if (onUpdate) {
      onUpdate({
        ...project,
        quotes: updatedQuotes
      });
    }
    toast.success(`Quote #${quote.number} created successfully`);
    setShowQuoteDialog(false);
  };
  
  const handleUpdateInvoiceStatus = (invoiceId: string, status: ProjectInvoice['status']) => {
    if (!project.invoices) return;
    
    const updatedInvoices = project.invoices.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, status } : invoice
    );
    
    if (onUpdate) {
      onUpdate({
        ...project,
        invoices: updatedInvoices
      });
    }
    
    const statusMessages = {
      draft: "saved as draft",
      sent: "marked as sent",
      paid: "marked as paid",
      overdue: "marked as overdue",
      cancelled: "cancelled"
    };
    
    toast.success(`Invoice ${statusMessages[status]}`);
  };
  
  const handleUpdateQuoteStatus = (quoteId: string, status: ProjectQuote['status']) => {
    if (!project.quotes) return;
    
    const updatedQuotes = project.quotes.map(quote => 
      quote.id === quoteId ? { ...quote, status } : quote
    );
    
    if (onUpdate) {
      onUpdate({
        ...project,
        quotes: updatedQuotes
      });
    }
    
    const statusMessages = {
      draft: "saved as draft",
      sent: "marked as sent",
      accepted: "marked as accepted",
      rejected: "marked as rejected",
      expired: "marked as expired"
    };
    
    toast.success(`Quote ${statusMessages[status]}`);
  };
  
  const handleEditInvoice = (invoice: ProjectInvoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceDialog(true);
  };
  
  const handleEditQuote = (quote: ProjectQuote) => {
    setEditingQuote(quote);
    setShowQuoteDialog(true);
  };
  
  const handleSaveEditedInvoice = (updatedInvoice: ProjectInvoice) => {
    if (!project.invoices) return;
    
    const updatedInvoices = project.invoices.map(invoice => 
      invoice.id === updatedInvoice.id ? updatedInvoice : invoice
    );
    
    if (onUpdate) {
      onUpdate({
        ...project,
        invoices: updatedInvoices
      });
    }
    
    toast.success(`Invoice #${updatedInvoice.number} updated successfully`);
    setShowInvoiceDialog(false);
    setEditingInvoice(null);
  };
  
  const handleSaveEditedQuote = (updatedQuote: ProjectQuote) => {
    if (!project.quotes) return;
    
    const updatedQuotes = project.quotes.map(quote => 
      quote.id === updatedQuote.id ? updatedQuote : quote
    );
    
    if (onUpdate) {
      onUpdate({
        ...project,
        quotes: updatedQuotes
      });
    }
    
    toast.success(`Quote #${updatedQuote.number} updated successfully`);
    setShowQuoteDialog(false);
    setEditingQuote(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Invoices & Quotes</h2>
        <div className="flex gap-2">
          <Button onClick={() => {
            setEditingInvoice(null);
            setShowInvoiceDialog(true);
          }} className="flex items-center gap-2">
            <Plus size={16} />
            Create Invoice
          </Button>
          <Button onClick={() => {
            setEditingQuote(null);
            setShowQuoteDialog(true);
          }} variant="outline" className="flex items-center gap-2">
            <Plus size={16} />
            Create Quote
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="invoices" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="invoices" className="flex items-center gap-1">
            <Receipt size={16} />
            Invoices {invoices.length > 0 && `(${invoices.length})`}
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex items-center gap-1">
            <FileText size={16} />
            Quotes {quotes.length > 0 && `(${quotes.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices" className="space-y-4">
          {invoices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {invoices.map(invoice => (
                <InvoiceCard 
                  key={invoice.id} 
                  invoice={invoice}
                  onUpdateStatus={handleUpdateInvoiceStatus}
                  onEdit={handleEditInvoice}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No Invoices Yet" 
              description="Create your first invoice to bill clients or contractors"
              onAction={() => {
                setEditingInvoice(null);
                setShowInvoiceDialog(true);
              }}
              actionText="Create Invoice"
              icon={<Receipt size={48} className="text-gray-400" />}
            />
          )}
        </TabsContent>
        
        <TabsContent value="quotes" className="space-y-4">
          {quotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quotes.map(quote => (
                <QuoteCard 
                  key={quote.id} 
                  quote={quote}
                  onUpdateStatus={handleUpdateQuoteStatus}
                  onEdit={handleEditQuote}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No Quotes Yet" 
              description="Create your first quote for potential clients"
              onAction={() => {
                setEditingQuote(null);
                setShowQuoteDialog(true);
              }}
              actionText="Create Quote"
              icon={<FileText size={48} className="text-gray-400" />}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Invoice Dialog */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingInvoice ? `Edit Invoice #${editingInvoice.number}` : "Create New Invoice"}
            </DialogTitle>
          </DialogHeader>
          <InvoiceForm 
            projectName={project.name}
            contractors={project.contractors || []}
            initialData={editingInvoice}
            onSave={editingInvoice ? handleSaveEditedInvoice : handleCreateInvoice}
            onCancel={() => setShowInvoiceDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Quote Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingQuote ? `Edit Quote #${editingQuote.number}` : "Create New Quote"}
            </DialogTitle>
          </DialogHeader>
          <QuoteForm 
            projectName={project.name}
            clientName={project.clientName}
            initialData={editingQuote}
            onSave={editingQuote ? handleSaveEditedQuote : handleCreateQuote}
            onCancel={() => setShowQuoteDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Invoice Card Component
interface InvoiceCardProps {
  invoice: ProjectInvoice;
  onUpdateStatus: (id: string, status: ProjectInvoice['status']) => void;
  onEdit: (invoice: ProjectInvoice) => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onUpdateStatus, onEdit }) => {
  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    cancelled: "bg-amber-100 text-amber-800"
  };
  
  const statusLabels = {
    draft: "Draft",
    sent: "Sent",
    paid: "Paid",
    overdue: "Overdue",
    cancelled: "Cancelled"
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-gray-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">Invoice #{invoice.number}</p>
            <CardTitle className="text-lg mt-1 line-clamp-1">{invoice.recipientName}</CardTitle>
          </div>
          <Badge className={statusColors[invoice.status]}>{statusLabels[invoice.status]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-medium">{formatCurrency(invoice.totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Issued:</span>
            <span>{format(new Date(invoice.issueDate), "MMM d, yyyy")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Due:</span>
            <span>{format(new Date(invoice.dueDate), "MMM d, yyyy")}</span>
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="text-sm font-medium">Actions</div>
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => onEdit(invoice)}
              >
                Edit
              </Button>
              
              {invoice.status === "draft" && (
                <Button 
                  size="sm"
                  variant="default"
                  className="flex-1"
                  onClick={() => onUpdateStatus(invoice.id, "sent")}
                >
                  <Send size={14} className="mr-1" />
                  Send
                </Button>
              )}
              
              {invoice.status === "sent" && (
                <Button 
                  size="sm"
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700 flex-1"
                  onClick={() => onUpdateStatus(invoice.id, "paid")}
                >
                  <Check size={14} className="mr-1" />
                  Mark Paid
                </Button>
              )}
              
              {(invoice.status === "draft" || invoice.status === "sent") && (
                <Button 
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => onUpdateStatus(invoice.id, "cancelled")}
                >
                  <X size={14} className="mr-1" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Quote Card Component
interface QuoteCardProps {
  quote: ProjectQuote;
  onUpdateStatus: (id: string, status: ProjectQuote['status']) => void;
  onEdit: (quote: ProjectQuote) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onUpdateStatus, onEdit }) => {
  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    expired: "bg-amber-100 text-amber-800"
  };
  
  const statusLabels = {
    draft: "Draft",
    sent: "Sent",
    accepted: "Accepted",
    rejected: "Rejected",
    expired: "Expired"
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-gray-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">Quote #{quote.number}</p>
            <CardTitle className="text-lg mt-1 line-clamp-1">{quote.clientName}</CardTitle>
          </div>
          <Badge className={statusColors[quote.status]}>{statusLabels[quote.status]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-medium">{formatCurrency(quote.totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Issued:</span>
            <span>{format(new Date(quote.issueDate), "MMM d, yyyy")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Valid until:</span>
            <span>{format(new Date(quote.validUntil), "MMM d, yyyy")}</span>
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="text-sm font-medium">Actions</div>
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => onEdit(quote)}
              >
                Edit
              </Button>
              
              {quote.status === "draft" && (
                <Button 
                  size="sm"
                  variant="default"
                  className="flex-1"
                  onClick={() => onUpdateStatus(quote.id, "sent")}
                >
                  <Send size={14} className="mr-1" />
                  Send
                </Button>
              )}
              
              {quote.status === "sent" && (
                <>
                  <Button 
                    size="sm"
                    variant="default" 
                    className="bg-green-600 hover:bg-green-700 flex-1"
                    onClick={() => onUpdateStatus(quote.id, "accepted")}
                  >
                    <Check size={14} className="mr-1" />
                    Accept
                  </Button>
                  <Button 
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => onUpdateStatus(quote.id, "rejected")}
                  >
                    <X size={14} className="mr-1" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Invoice Form Component
interface InvoiceFormProps {
  projectName: string;
  contractors: ProjectContractor[];
  initialData: ProjectInvoice | null;
  onSave: (invoice: ProjectInvoice) => void;
  onCancel: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ 
  projectName, 
  contractors, 
  initialData, 
  onSave,
  onCancel
}) => {
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  const generateInvoiceNumber = () => {
    const year = today.getFullYear().toString().slice(2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  };
  
  const [invoice, setInvoice] = useState<ProjectInvoice>(initialData || {
    id: uuidv4(),
    number: generateInvoiceNumber(),
    recipientType: "client",
    recipientName: "",
    recipientEmail: "",
    items: [
      {
        id: uuidv4(),
        description: `${projectName} - Services`,
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
      }
    ],
    totalAmount: 0,
    status: "draft",
    issueDate: format(today, "yyyy-MM-dd"),
    dueDate: format(nextMonth, "yyyy-MM-dd"),
    notes: "",
    createdAt: new Date().toISOString()
  });
  
  const handleChange = (field: keyof ProjectInvoice, value: any) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };
  
  const handleRecipientTypeChange = (type: ProjectInvoice['recipientType']) => {
    setInvoice(prev => {
      // If changing to contractor and we have contractors, pre-select the first one
      if (type === "contractor" && contractors.length > 0) {
        return {
          ...prev,
          recipientType: type,
          recipientName: contractors[0].name,
          recipientEmail: contractors[0].email || ""
        };
      }
      return { ...prev, recipientType: type };
    });
  };
  
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: uuidv4(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    };
    
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };
  
  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setInvoice(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          
          // If quantity or unitPrice changed, recalculate the total price
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
          }
          
          return updatedItem;
        }
        return item;
      });
      
      // Recalculate total amount
      const total = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        ...prev,
        items: updatedItems,
        totalAmount: total
      };
    });
  };
  
  const removeItem = (itemId: string) => {
    setInvoice(prev => {
      const updatedItems = prev.items.filter(item => item.id !== itemId);
      const total = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        ...prev,
        items: updatedItems,
        totalAmount: total
      };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(invoice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Invoice Number</label>
          <input
            type="text"
            value={invoice.number}
            onChange={(e) => handleChange("number", e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Recipient Type</label>
          <select
            value={invoice.recipientType}
            onChange={(e) => handleRecipientTypeChange(e.target.value as ProjectInvoice['recipientType'])}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="client">Client</option>
            <option value="contractor">Contractor</option>
            <option value="supplier">Supplier</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Recipient Name</label>
          {invoice.recipientType === "contractor" && contractors.length > 0 ? (
            <select
              value={invoice.recipientName}
              onChange={(e) => handleChange("recipientName", e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              {contractors.map(contractor => (
                <option key={contractor.id} value={contractor.name}>
                  {contractor.name} ({contractor.role})
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={invoice.recipientName}
              onChange={(e) => handleChange("recipientName", e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder={invoice.recipientType === "client" ? "Client name" : "Recipient name"}
              required
            />
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Recipient Email</label>
          <input
            type="email"
            value={invoice.recipientEmail || ""}
            onChange={(e) => handleChange("recipientEmail", e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Email address"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Issue Date</label>
          <input
            type="date"
            value={invoice.issueDate}
            onChange={(e) => handleChange("issueDate", e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Due Date</label>
          <input
            type="date"
            value={invoice.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2 border-t border-b py-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Invoice Items</h3>
          <Button 
            type="button"
            size="sm"
            variant="outline"
            onClick={addItem}
          >
            Add Item
          </Button>
        </div>
        
        {invoice.items.map((item, index) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded-md">
            <div className="col-span-12 md:col-span-5">
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Item description"
                required
              />
            </div>
            <div className="col-span-4 md:col-span-2">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value))}
                className="w-full p-2 border rounded-md"
                placeholder="Qty"
                required
              />
            </div>
            <div className="col-span-4 md:col-span-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value))}
                className="w-full p-2 border rounded-md"
                placeholder="Price"
                required
              />
            </div>
            <div className="col-span-2 md:col-span-2 font-medium text-right">
              ${item.totalPrice.toFixed(2)}
            </div>
            <div className="col-span-2 md:col-span-1 text-right">
              {invoice.items.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeItem(item.id)}
                  className="h-8 w-8 p-0"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        <div className="flex justify-end mt-4">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between p-2 bg-gray-100 rounded-md">
              <span className="font-medium">Total:</span>
              <span className="font-bold">${invoice.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <textarea
          value={invoice.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Additional notes or payment instructions"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex items-center gap-2">
          <Receipt size={16} />
          {initialData ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
};

// Quote Form Component
interface QuoteFormProps {
  projectName: string;
  clientName: string;
  initialData: ProjectQuote | null;
  onSave: (quote: ProjectQuote) => void;
  onCancel: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ 
  projectName, 
  clientName, 
  initialData, 
  onSave,
  onCancel
}) => {
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  const generateQuoteNumber = () => {
    const year = today.getFullYear().toString().slice(2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `QT-${year}${month}-${random}`;
  };
  
  const [quote, setQuote] = useState<ProjectQuote>(initialData || {
    id: uuidv4(),
    number: generateQuoteNumber(),
    clientName: clientName,
    clientEmail: "",
    items: [
      {
        id: uuidv4(),
        description: `${projectName} - Services`,
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
      }
    ],
    totalAmount: 0,
    status: "draft",
    issueDate: format(today, "yyyy-MM-dd"),
    validUntil: format(nextMonth, "yyyy-MM-dd"),
    notes: "",
    createdAt: new Date().toISOString()
  });
  
  const handleChange = (field: keyof ProjectQuote, value: any) => {
    setQuote(prev => ({ ...prev, [field]: value }));
  };
  
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: uuidv4(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    };
    
    setQuote(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };
  
  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setQuote(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          
          // If quantity or unitPrice changed, recalculate the total price
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
          }
          
          return updatedItem;
        }
        return item;
      });
      
      // Recalculate total amount
      const total = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        ...prev,
        items: updatedItems,
        totalAmount: total
      };
    });
  };
  
  const removeItem = (itemId: string) => {
    setQuote(prev => {
      const updatedItems = prev.items.filter(item => item.id !== itemId);
      const total = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        ...prev,
        items: updatedItems,
        totalAmount: total
      };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(quote);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Quote Number</label>
          <input
            type="text"
            value={quote.number}
            onChange={(e) => handleChange("number", e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Client Name</label>
          <input
            type="text"
            value={quote.clientName}
            onChange={(e) => handleChange("clientName", e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Client name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Client Email</label>
          <input
            type="email"
            value={quote.clientEmail || ""}
            onChange={(e) => handleChange("clientEmail", e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Client email address"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Project</label>
          <input
            type="text"
            value={projectName}
            className="w-full p-2 border rounded-md bg-gray-50"
            readOnly
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Issue Date</label>
          <input
            type="date"
            value={quote.issueDate}
            onChange={(e) => handleChange("issueDate", e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Valid Until</label>
          <input
            type="date"
            value={quote.validUntil}
            onChange={(e) => handleChange("validUntil", e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2 border-t border-b py-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Quote Items</h3>
          <Button 
            type="button"
            size="sm"
            variant="outline"
            onClick={addItem}
          >
            Add Item
          </Button>
        </div>
        
        {quote.items.map((item, index) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded-md">
            <div className="col-span-12 md:col-span-5">
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Item description"
                required
              />
            </div>
            <div className="col-span-4 md:col-span-2">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value))}
                className="w-full p-2 border rounded-md"
                placeholder="Qty"
                required
              />
            </div>
            <div className="col-span-4 md:col-span-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value))}
                className="w-full p-2 border rounded-md"
                placeholder="Price"
                required
              />
            </div>
            <div className="col-span-2 md:col-span-2 font-medium text-right">
              ${item.totalPrice.toFixed(2)}
            </div>
            <div className="col-span-2 md:col-span-1 text-right">
              {quote.items.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeItem(item.id)}
                  className="h-8 w-8 p-0"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        <div className="flex justify-end mt-4">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between p-2 bg-gray-100 rounded-md">
              <span className="font-medium">Total:</span>
              <span className="font-bold">${quote.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <textarea
          value={quote.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Additional notes or terms and conditions"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex items-center gap-2">
          <FileText size={16} />
          {initialData ? "Update Quote" : "Create Quote"}
        </Button>
      </div>
    </form>
  );
};

// Empty State Component
interface EmptyStateProps {
  title: string;
  description: string;
  onAction: () => void;
  actionText: string;
  icon: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  onAction,
  actionText,
  icon
}) => {
  return (
    <div className="text-center py-12 border rounded-md bg-gray-50">
      <div className="mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-gray-500 mt-1 mb-4 max-w-md mx-auto">
        {description}
      </p>
      <Button onClick={onAction} className="flex items-center gap-2 mx-auto">
        <Plus size={16} />
        {actionText}
      </Button>
    </div>
  );
};

export default InvoiceQuoteTab;
