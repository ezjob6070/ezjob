
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface InvoiceButtonProps {
  entityName?: string;
  entityType?: "technician" | "jobSource" | "client";
}

const InvoiceButton: React.FC<InvoiceButtonProps> = ({ 
  entityName = "Entity", 
  entityType = "technician" 
}) => {
  const [open, setOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: `Services provided by ${entityName}`,
    amount: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  const generateInvoice = () => {
    // This would connect to your invoicing system in a real app
    toast.success(`Invoice created for ${entityName}`);
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <FileText className="h-4 w-4" />
        Generate Invoice
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Invoice for {entityName}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input 
                  id="invoiceNumber" 
                  name="invoiceNumber" 
                  value={invoiceData.invoiceNumber} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input 
                  id="invoiceDate" 
                  name="invoiceDate" 
                  type="date" 
                  value={invoiceData.invoiceDate} 
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("paymentTerms", value)}
                  defaultValue="30days"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Due immediately</SelectItem>
                    <SelectItem value="15days">15 days</SelectItem>
                    <SelectItem value="30days">30 days</SelectItem>
                    <SelectItem value="60days">60 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  name="dueDate" 
                  type="date" 
                  value={invoiceData.dueDate} 
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={invoiceData.description} 
                onChange={handleChange}
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input 
                  id="amount" 
                  name="amount" 
                  type="number" 
                  placeholder="0.00" 
                  value={invoiceData.amount} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("taxRate", value)}
                  defaultValue="0"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="7.5">7.5%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="15">15%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={invoiceData.notes} 
                onChange={handleChange}
                placeholder="Additional notes or payment instructions"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Preview PDF
            </Button>
            <Button onClick={generateInvoice}>
              Generate Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceButton;
