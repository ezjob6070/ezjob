
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus, Trash2, Receipt } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Project, ProjectQuote, QuoteInvoiceItem } from "@/types/project";

interface ProjectQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onSave: (quote: ProjectQuote) => void;
  editingQuote?: ProjectQuote;
}

const ProjectQuoteModal: React.FC<ProjectQuoteModalProps> = ({
  open,
  onOpenChange,
  project,
  onSave,
  editingQuote
}) => {
  const isEditing = !!editingQuote;
  const [quoteData, setQuoteData] = useState<Omit<ProjectQuote, "id">>({
    quoteNumber: `Q-${project.id}-${Math.floor(Math.random() * 10000)}`,
    clientName: project.clientName,
    clientEmail: "",
    clientPhone: "",
    issueDate: format(new Date(), "yyyy-MM-dd"),
    validUntil: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), "yyyy-MM-dd"),
    status: "draft",
    items: [
      {
        id: uuidv4(),
        description: `${project.name} - Services`,
        quantity: 1,
        unitPrice: 0,
        amount: 0
      }
    ],
    subtotal: 0,
    tax: 0,
    total: 0
  });

  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [validUntil, setValidUntil] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() + 1)));

  // Initialize with editing data if available
  useEffect(() => {
    if (editingQuote) {
      setQuoteData({
        ...editingQuote,
      });
      setIssueDate(new Date(editingQuote.issueDate));
      setValidUntil(new Date(editingQuote.validUntil));
    } else {
      // Reset to default for new quotes
      setQuoteData({
        quoteNumber: `Q-${project.id}-${Math.floor(Math.random() * 10000)}`,
        clientName: project.clientName,
        clientEmail: "",
        clientPhone: "",
        issueDate: format(new Date(), "yyyy-MM-dd"),
        validUntil: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), "yyyy-MM-dd"),
        status: "draft",
        items: [
          {
            id: uuidv4(),
            description: `${project.name} - Services`,
            quantity: 1,
            unitPrice: 0,
            amount: 0
          }
        ],
        subtotal: 0,
        tax: 0,
        total: 0
      });
      setIssueDate(new Date());
      setValidUntil(new Date(new Date().setMonth(new Date().getMonth() + 1)));
    }
  }, [editingQuote, project]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuoteData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = () => {
    const newItem: QuoteInvoiceItem = {
      id: uuidv4(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0
    };

    setQuoteData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const handleRemoveItem = (id: string) => {
    setQuoteData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
    calculateTotals();
  };

  const handleItemChange = (id: string, field: keyof QuoteInvoiceItem, value: any) => {
    setQuoteData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Auto-calculate amount if quantity or unitPrice changes
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
          }
          return updatedItem;
        }
        return item;
      });
      
      return { ...prev, items: updatedItems };
    });
    calculateTotals();
  };

  const calculateTotals = () => {
    setQuoteData(prev => {
      const subtotal = prev.items.reduce((sum, item) => sum + Number(item.amount), 0);
      const tax = Number(prev.tax) || 0;
      const total = subtotal + (subtotal * tax / 100);
      
      return {
        ...prev,
        subtotal,
        total
      };
    });
  };

  useEffect(() => {
    calculateTotals();
  }, [quoteData.items, quoteData.tax]);

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const taxValue = parseFloat(e.target.value) || 0;
    setQuoteData(prev => ({
      ...prev,
      tax: taxValue
    }));
  };

  const handleSubmit = () => {
    // Create or update quote
    const finalQuote: ProjectQuote = {
      id: editingQuote?.id || uuidv4(),
      ...quoteData,
      lastUpdated: format(new Date(), "yyyy-MM-dd")
    };

    onSave(finalQuote);
    toast.success(`Quote ${isEditing ? "updated" : "created"} successfully`);
    onOpenChange(false);
  };

  const handleStatusChange = (status: string) => {
    setQuoteData(prev => ({
      ...prev,
      status: status as "draft" | "sent" | "accepted" | "rejected" | "expired"
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {isEditing ? "Edit Quote" : "Create New Quote"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this quote"
              : "Create a new quote for your client"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quoteNumber">Quote Number</Label>
              <Input
                id="quoteNumber"
                name="quoteNumber"
                value={quoteData.quoteNumber}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={quoteData.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Client Info Section */}
          <div className="grid grid-cols-1 gap-4">
            <h3 className="text-md font-medium">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={quoteData.clientName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  value={quoteData.clientEmail || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clientPhone">Client Phone</Label>
                <Input
                  id="clientPhone"
                  name="clientPhone"
                  value={quoteData.clientPhone || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          {/* Date Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !issueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {issueDate ? format(issueDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={issueDate}
                    onSelect={(date) => {
                      if (date) {
                        setIssueDate(date);
                        setQuoteData(prev => ({
                          ...prev,
                          issueDate: format(date, "yyyy-MM-dd")
                        }));
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label>Valid Until</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !validUntil && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {validUntil ? format(validUntil, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={validUntil}
                    onSelect={(date) => {
                      if (date) {
                        setValidUntil(date);
                        setQuoteData(prev => ({
                          ...prev,
                          validUntil: format(date, "yyyy-MM-dd")
                        }));
                      }
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-medium">Items</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddItem}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            </div>
            
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-right w-20">Qty</th>
                    <th className="px-4 py-2 text-right w-28">Unit Price</th>
                    <th className="px-4 py-2 text-right w-28">Amount</th>
                    <th className="px-4 py-2 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {quoteData.items.map((item, index) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="px-4 py-2">
                        <Input 
                          value={item.description} 
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          min="1"
                          step="1"
                          className="text-right"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                          <Input 
                            type="number" 
                            value={item.unitPrice} 
                            onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            className="text-right pl-7"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                          <Input 
                            type="number" 
                            value={item.amount}
                            readOnly
                            className="text-right pl-7 bg-gray-50"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {quoteData.items.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Totals Section */}
          <div className="flex justify-end space-y-2">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex items-center justify-between">
                <Label>Subtotal:</Label>
                <span className="font-medium">${quoteData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="tax">Tax (%):</Label>
                <div className="w-20">
                  <Input
                    id="tax"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={quoteData.tax}
                    onChange={handleTaxChange}
                    className="text-right"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <Label className="font-semibold">Total:</Label>
                <span className="font-bold text-lg">${quoteData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Notes and Terms Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={quoteData.notes || ""}
                onChange={handleInputChange}
                placeholder="Additional notes for the client"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea
                id="terms"
                name="terms"
                value={quoteData.terms || ""}
                onChange={handleInputChange}
                placeholder="Payment terms and conditions"
                rows={3}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {isEditing ? "Update Quote" : "Create Quote"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectQuoteModal;
