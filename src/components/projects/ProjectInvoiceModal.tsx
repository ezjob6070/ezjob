
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { format, addDays } from "date-fns";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash2, Plus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project, ProjectInvoice, ProjectInvoiceItem, ProjectContractor } from "@/types/project";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface ProjectInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onCreateInvoice: (invoice: ProjectInvoice) => void;
  existingInvoice?: ProjectInvoice;
}

const ProjectInvoiceModal: React.FC<ProjectInvoiceModalProps> = ({
  open,
  onOpenChange,
  project,
  onCreateInvoice,
  existingInvoice
}) => {
  const isEditing = !!existingInvoice;
  
  // Get project contractors
  const contractors = project.contractors || [];
  
  // Initialize state
  const [selectedContractorId, setSelectedContractorId] = useState<string>(
    existingInvoice?.contractorId || (contractors.length > 0 ? contractors[0].id : "")
  );
  
  const [dueDate, setDueDate] = useState<Date>(
    existingInvoice?.dueDate 
      ? new Date(existingInvoice.dueDate) 
      : addDays(new Date(), 30) // Default 30 days from now
  );
  
  const [invoiceData, setInvoiceData] = useState<{
    reference: string;
    notes: string;
    items: ProjectInvoiceItem[];
    paymentTerms: string;
    paymentMethod: string;
    status: ProjectInvoice["status"];
    paidAmount?: number;
    paidDate?: Date;
  }>({
    reference: existingInvoice?.reference || `INV-${project.id}-${Math.floor(Math.random() * 10000)}`,
    notes: existingInvoice?.notes || "",
    items: existingInvoice?.items || [
      {
        id: uuidv4(),
        description: "Contractor Services",
        quantity: 1,
        rate: getSelectedContractor()?.rate || 0,
        totalAmount: getSelectedContractor()?.rate || 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        category: "labor"
      }
    ],
    paymentTerms: existingInvoice?.paymentTerms || "Payment due within 30 days of invoice date",
    paymentMethod: existingInvoice?.paymentMethod || "Direct Deposit",
    status: existingInvoice?.status || "draft",
    paidAmount: existingInvoice?.paidAmount,
    paidDate: existingInvoice?.paidDate ? new Date(existingInvoice.paidDate) : undefined
  });
  
  // Helper function to get selected contractor
  function getSelectedContractor(): ProjectContractor | undefined {
    return contractors.find(c => c.id === selectedContractorId);
  }
  
  // Update items when contractor changes
  useEffect(() => {
    const contractor = getSelectedContractor();
    if (contractor && !isEditing) {
      // Only auto-update rate for new invoices
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.map(item => ({
          ...item,
          rate: contractor.rate,
          totalAmount: item.quantity * contractor.rate
        }))
      }));
    }
  }, [selectedContractorId, isEditing]);
  
  // Calculate total
  const totalAmount = invoiceData.items.reduce((sum, item) => sum + item.totalAmount, 0);
  
  // Handle item updates
  const updateItem = (index: number, field: keyof ProjectInvoiceItem, value: any) => {
    const newItems = [...invoiceData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    // Recalculate total amount if quantity or rate changed
    if (field === "quantity" || field === "rate") {
      newItems[index].totalAmount = newItems[index].quantity * newItems[index].rate;
    }
    
    setInvoiceData({
      ...invoiceData,
      items: newItems
    });
  };
  
  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        {
          id: uuidv4(),
          description: "",
          quantity: 1,
          rate: getSelectedContractor()?.rate || 0,
          totalAmount: getSelectedContractor()?.rate || 0,
          date: format(new Date(), 'yyyy-MM-dd')
        }
      ]
    });
  };
  
  const removeItem = (index: number) => {
    const newItems = [...invoiceData.items];
    newItems.splice(index, 1);
    setInvoiceData({
      ...invoiceData,
      items: newItems
    });
  };
  
  // Handle show paid fields
  const isPaid = invoiceData.status === "paid";
  
  const handleSubmit = () => {
    if (!selectedContractorId) {
      toast.error("Please select a contractor");
      return;
    }
    
    const contractor = getSelectedContractor();
    if (!contractor) {
      toast.error("Selected contractor not found");
      return;
    }
    
    const invoice: ProjectInvoice = {
      id: existingInvoice?.id || uuidv4(),
      contractorId: selectedContractorId,
      contractorName: contractor.name,
      createdAt: existingInvoice?.createdAt || format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(dueDate, 'yyyy-MM-dd'),
      status: invoiceData.status,
      totalAmount: totalAmount,
      items: invoiceData.items,
      notes: invoiceData.notes,
      paymentTerms: invoiceData.paymentTerms,
      paymentMethod: invoiceData.paymentMethod,
      reference: invoiceData.reference,
      paidAmount: invoiceData.paidAmount,
      paidDate: invoiceData.paidDate ? format(invoiceData.paidDate, 'yyyy-MM-dd') : undefined
    };
    
    onCreateInvoice(invoice);
    onOpenChange(false);
    toast.success(isEditing ? "Invoice updated successfully" : "Invoice created successfully");
  };
  
  const previewInvoice = () => {
    // In a real app, this would generate a PDF preview
    toast.success("Invoice preview generated");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Invoice" : "Create Contractor Invoice"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update invoice details for this contractor" 
              : "Create a new invoice for a contractor on this project"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Contractor selection and basic info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-md font-semibold">Contractor Information</h3>
              
              {contractors.length > 0 ? (
                <Select 
                  value={selectedContractorId} 
                  onValueChange={setSelectedContractorId}
                  disabled={isEditing} // Can't change contractor for existing invoices
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contractor" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractors.map(contractor => (
                      <SelectItem key={contractor.id} value={contractor.id}>
                        {contractor.name} - {contractor.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-amber-600 text-sm">
                  No contractors assigned to this project. Please add contractors first.
                </div>
              )}
              
              {getSelectedContractor() && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Role:</div>
                    <div className="font-medium">{getSelectedContractor()?.role}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Rate:</div>
                    <div className="font-medium">${getSelectedContractor()?.rate}/{getSelectedContractor()?.rateType}</div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Invoice Reference</label>
                  <Input 
                    value={invoiceData.reference} 
                    onChange={(e) => setInvoiceData({
                      ...invoiceData,
                      reference: e.target.value
                    })}
                    placeholder="Invoice reference number"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => date && setDueDate(date)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            {/* Invoice Status */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold">Invoice Status</h3>
              <Select 
                value={invoiceData.status} 
                onValueChange={(value: ProjectInvoice["status"]) => setInvoiceData({
                  ...invoiceData,
                  status: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="pt-4 space-y-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={previewInvoice}
                >
                  <FileText className="h-4 w-4" />
                  Preview Invoice
                </Button>
              </div>
            </div>
          </div>
          
          {/* Payment Details - shown only if paid */}
          {isPaid && (
            <div className="border-t pt-4 space-y-4">
              <h3 className="text-md font-semibold">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !invoiceData.paidDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {invoiceData.paidDate ? format(invoiceData.paidDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={invoiceData.paidDate}
                        onSelect={(date) => setInvoiceData({
                          ...invoiceData,
                          paidDate: date || undefined
                        })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                    <Input 
                      type="number" 
                      value={invoiceData.paidAmount || 0} 
                      onChange={(e) => setInvoiceData({
                        ...invoiceData,
                        paidAmount: parseFloat(e.target.value) || 0
                      })}
                      className="pl-7"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select 
                  value={invoiceData.paymentMethod} 
                  onValueChange={(value) => setInvoiceData({
                    ...invoiceData,
                    paymentMethod: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direct Deposit">Direct Deposit</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {/* Line Items */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold">Invoice Items</h3>
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
                <div className="col-span-4">Description</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Rate</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1"></div>
              </div>
              
              {/* Items */}
              <div className="divide-y">
                {invoiceData.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                    <div className="col-span-4">
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
                          value={item.rate} 
                          onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
                          className="pl-7"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 font-medium">
                      ${item.totalAmount.toFixed(2)}
                    </div>
                    <div className="col-span-1">
                      <Input 
                        type="date" 
                        value={item.date} 
                        onChange={(e) => updateItem(index, "date", e.target.value)}
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      <Button 
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={invoiceData.items.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Invoice Total */}
            <div className="flex justify-end">
              <div className="w-full md:w-1/3 space-y-3">
                <div className="flex justify-between text-base pt-2">
                  <span className="font-semibold">Total Due:</span>
                  <span className="font-bold">${totalAmount.toFixed(2)}</span>
                </div>
                
                {isPaid && invoiceData.paidAmount !== undefined && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Paid Amount:</span>
                      <span className="font-medium">${invoiceData.paidAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Remaining:</span>
                      <span className="font-medium">
                        ${Math.max(0, totalAmount - invoiceData.paidAmount).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Payment Terms & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Terms</label>
              <Textarea 
                value={invoiceData.paymentTerms} 
                onChange={(e) => setInvoiceData({
                  ...invoiceData,
                  paymentTerms: e.target.value
                })}
                placeholder="Add payment terms..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea 
                value={invoiceData.notes} 
                onChange={(e) => setInvoiceData({
                  ...invoiceData,
                  notes: e.target.value
                })}
                placeholder="Add notes for the contractor..."
                rows={3}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={!selectedContractorId || contractors.length === 0}
          >
            {isEditing ? "Update Invoice" : "Create Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectInvoiceModal;
