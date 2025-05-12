
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash2, Plus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project, ProjectQuote, ProjectQuoteItem } from "@/types/project";
import { toast } from "sonner";

interface ProjectQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onCreateQuote: (quote: ProjectQuote) => void;
  existingQuote?: ProjectQuote;
}

const ProjectQuoteModal: React.FC<ProjectQuoteModalProps> = ({
  open,
  onOpenChange,
  project,
  onCreateQuote,
  existingQuote
}) => {
  const isEditing = !!existingQuote;
  
  const [validUntil, setValidUntil] = useState<Date>(
    existingQuote?.validUntil 
      ? new Date(existingQuote.validUntil) 
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days from now
  );
  
  const [quoteData, setQuoteData] = useState<{
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    notes: string;
    items: ProjectQuoteItem[];
    termsAndConditions: string;
    taxRate: number;
    discountType: "fixed" | "percentage";
    discountAmount: number;
  }>({
    clientName: existingQuote?.clientName || project.clientName || "",
    clientEmail: existingQuote?.clientEmail || "",
    clientPhone: existingQuote?.clientPhone || "",
    notes: existingQuote?.notes || "",
    items: existingQuote?.items || [
      {
        id: uuidv4(),
        description: "Project Services",
        quantity: 1,
        unitPrice: project.budget * 0.8, // Default to 80% of budget as starting point
        totalPrice: project.budget * 0.8,
        category: "service"
      }
    ],
    termsAndConditions: existingQuote?.termsAndConditions || "Payment due within 30 days of acceptance. Quote valid for 30 days from issue date.",
    taxRate: existingQuote?.taxRate || 8.5,
    discountType: existingQuote?.discountType || "percentage",
    discountAmount: existingQuote?.discountAmount || 0
  });
  
  const [status, setStatus] = useState(existingQuote?.status || "draft");
  
  // Calculate totals
  const subtotal = quoteData.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const discount = quoteData.discountType === "percentage" 
    ? subtotal * (quoteData.discountAmount / 100) 
    : quoteData.discountAmount;
  const taxableAmount = subtotal - discount;
  const taxAmount = (taxableAmount * quoteData.taxRate) / 100;
  const total = taxableAmount + taxAmount;
  
  // Handle item updates
  const updateItem = (index: number, field: keyof ProjectQuoteItem, value: any) => {
    const newItems = [...quoteData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    // Recalculate total price if quantity or unit price changed
    if (field === "quantity" || field === "unitPrice") {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setQuoteData({
      ...quoteData,
      items: newItems
    });
  };
  
  const addItem = () => {
    setQuoteData({
      ...quoteData,
      items: [
        ...quoteData.items,
        {
          id: uuidv4(),
          description: "",
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0
        }
      ]
    });
  };
  
  const removeItem = (index: number) => {
    const newItems = [...quoteData.items];
    newItems.splice(index, 1);
    setQuoteData({
      ...quoteData,
      items: newItems
    });
  };
  
  const handleSubmit = () => {
    const quote: ProjectQuote = {
      id: existingQuote?.id || uuidv4(),
      createdAt: existingQuote?.createdAt || format(new Date(), 'yyyy-MM-dd'),
      validUntil: format(validUntil, 'yyyy-MM-dd'),
      status: status as ProjectQuote["status"],
      totalAmount: total,
      items: quoteData.items,
      clientName: quoteData.clientName,
      clientEmail: quoteData.clientEmail,
      clientPhone: quoteData.clientPhone,
      notes: quoteData.notes,
      termsAndConditions: quoteData.termsAndConditions,
      discountAmount: quoteData.discountAmount,
      discountType: quoteData.discountType,
      taxRate: quoteData.taxRate,
      taxAmount: taxAmount
    };
    
    onCreateQuote(quote);
    onOpenChange(false);
    toast.success(isEditing ? "Quote updated successfully" : "Quote created successfully");
  };
  
  const previewQuote = () => {
    // In a real app, this would generate a PDF preview
    toast.success("Quote preview generated");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Quote" : "Create New Quote"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update quote details for this project" 
              : "Create a new quote for the customer based on project details"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Client Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-md font-semibold">Client Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client Name</label>
                  <Input 
                    value={quoteData.clientName} 
                    onChange={(e) => setQuoteData({
                      ...quoteData,
                      clientName: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client Email</label>
                  <Input 
                    type="email"
                    value={quoteData.clientEmail} 
                    onChange={(e) => setQuoteData({
                      ...quoteData,
                      clientEmail: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client Phone</label>
                  <Input 
                    value={quoteData.clientPhone} 
                    onChange={(e) => setQuoteData({
                      ...quoteData,
                      clientPhone: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Valid Until</label>
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
                        {validUntil ? format(validUntil, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={validUntil}
                        onSelect={(date) => date && setValidUntil(date)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            {/* Quote Status */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold">Quote Status</h3>
              <Select 
                value={status} 
                onValueChange={(value) => setStatus(value)}
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
              
              <div className="pt-4 space-y-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={previewQuote}
                >
                  <FileText className="h-4 w-4" />
                  Preview Quote
                </Button>
              </div>
            </div>
          </div>
          
          {/* Line Items */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold">Quote Items</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addItem}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
            
            <div className="border rounded-md">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-sm font-medium">
                <div className="col-span-5">Description</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Unit Price</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-1"></div>
              </div>
              
              {/* Items */}
              <div className="divide-y">
                {quoteData.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                    <div className="col-span-5">
                      <Input 
                        value={item.description} 
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                        min="0"
                        step="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                        <Input 
                          type="number" 
                          value={item.unitPrice} 
                          onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                          className="pl-7"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 font-medium">
                      ${item.totalPrice.toFixed(2)}
                    </div>
                    <div className="col-span-1 text-right">
                      <Button 
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={quoteData.items.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quote Summary */}
            <div className="flex justify-end">
              <div className="w-full md:w-1/3 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                {/* Discount */}
                <div className="flex items-center gap-2">
                  <Select 
                    value={quoteData.discountType} 
                    onValueChange={(value: "fixed" | "percentage") => setQuoteData({
                      ...quoteData,
                      discountType: value
                    })}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed ($)</SelectItem>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input 
                    type="number" 
                    value={quoteData.discountAmount} 
                    onChange={(e) => setQuoteData({
                      ...quoteData,
                      discountAmount: parseFloat(e.target.value) || 0
                    })}
                    min="0"
                    step={quoteData.discountType === "percentage" ? "1" : "0.01"}
                    placeholder={quoteData.discountType === "percentage" ? "%" : "$"}
                    className="max-w-[100px]"
                  />
                  
                  <span className="text-sm ml-auto font-medium">
                    -${discount.toFixed(2)}
                  </span>
                </div>
                
                {/* Tax */}
                <div className="flex items-center gap-2">
                  <label className="text-sm">Tax Rate (%):</label>
                  <Input 
                    type="number" 
                    value={quoteData.taxRate} 
                    onChange={(e) => setQuoteData({
                      ...quoteData,
                      taxRate: parseFloat(e.target.value) || 0
                    })}
                    min="0"
                    max="100"
                    step="0.1"
                    className="max-w-[100px]"
                  />
                  <span className="text-sm ml-auto font-medium">
                    ${taxAmount.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between text-base pt-2 border-t">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notes & Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea 
                value={quoteData.notes} 
                onChange={(e) => setQuoteData({
                  ...quoteData,
                  notes: e.target.value
                })}
                placeholder="Add any notes for the client..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Terms and Conditions</label>
              <Textarea 
                value={quoteData.termsAndConditions} 
                onChange={(e) => setQuoteData({
                  ...quoteData,
                  termsAndConditions: e.target.value
                })}
                placeholder="Terms and conditions..."
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
