
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, TrashIcon, SendIcon } from "lucide-react";

const InvoiceForm = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    clientName: "",
    clientEmail: "",
    invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
    dueDate: "",
    notes: "",
  });

  const [items, setItems] = useState([
    { description: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    // @ts-ignore - We know these fields exist
    newItems[index][field] = value;
    
    if (field === "quantity" || field === "rate") {
      const quantity = field === "quantity" ? Number(value) : Number(newItems[index].quantity);
      const rate = field === "rate" ? Number(value) : Number(newItems[index].rate);
      newItems[index].amount = quantity * rate;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsCreating(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsCreating(false);
      toast({
        title: "Invoice Created",
        description: `Invoice ${invoiceData.invoiceNumber} has been created and sent to the client.`,
      });
      
      // Reset form
      setInvoiceData({
        clientName: "",
        clientEmail: "",
        invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
        dueDate: "",
        notes: "",
      });
      setItems([{ description: "", quantity: 1, rate: 0, amount: 0 }]);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <select 
            id="clientName"
            name="clientName"
            value={invoiceData.clientName}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          >
            <option value="" disabled>Select a client</option>
            <option value="Acme Corp">Acme Corp</option>
            <option value="Tech Solutions Inc.">Tech Solutions Inc.</option>
            <option value="Global Industries">Global Industries</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientEmail">Client Email</Label>
          <Input 
            id="clientEmail"
            name="clientEmail"
            value={invoiceData.clientEmail}
            onChange={handleChange}
            placeholder="client@example.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input 
            id="invoiceNumber"
            name="invoiceNumber"
            value={invoiceData.invoiceNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input 
            id="dueDate"
            name="dueDate"
            type="date"
            value={invoiceData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-sm font-medium mb-4">Invoice Items</h3>
        
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-6 space-y-2">
                <Label htmlFor={`item-${index}-desc`}>Description</Label>
                <Input 
                  id={`item-${index}-desc`}
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  placeholder="Service description"
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor={`item-${index}-qty`}>Qty</Label>
                <Input 
                  id={`item-${index}-qty`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor={`item-${index}-rate`}>Rate ($)</Label>
                <Input 
                  id={`item-${index}-rate`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                  required
                />
              </div>
              <div className="col-span-1 space-y-2">
                <Label>Amount</Label>
                <div className="h-10 flex items-center font-medium">
                  ${item.amount.toFixed(2)}
                </div>
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  disabled={items.length <= 1}
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="mt-2"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t mt-4">
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes"
            name="notes"
            value={invoiceData.notes}
            onChange={handleChange}
            placeholder="Thank you for your business!"
            className="h-20"
          />
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Total Amount</div>
          <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
        </div>
      </div>

      <Button 
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 mt-4"
        disabled={isCreating}
      >
        {isCreating ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <SendIcon className="h-4 w-4" />
            Create & Send Invoice
          </span>
        )}
      </Button>
    </form>
  );
};

export default InvoiceForm;
