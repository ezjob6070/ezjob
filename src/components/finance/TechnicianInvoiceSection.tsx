
import React, { useState } from "react";
import { Technician } from "@/types/technician";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FilePlus, Download, Printer, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface TechnicianInvoiceSectionProps {
  activeTechnicians: Technician[];
}

type InvoiceFormValues = {
  technicianId: string;
  invoiceDate: string;
  dueDate: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  notes: string;
  items: InvoiceItem[];
};

type InvoiceItem = {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

const TechnicianInvoiceSection: React.FC<TechnicianInvoiceSectionProps> = ({
  activeTechnicians,
}) => {
  const { toast } = useToast();
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, rate: 0, amount: 0 },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<InvoiceFormValues>({
    defaultValues: {
      technicianId: "",
      invoiceDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: format(new Date(new Date().setDate(new Date().getDate() + 30)), "yyyy-MM-dd"),
      invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      clientName: "",
      clientEmail: "",
      clientAddress: "",
      notes: "Thank you for your business!",
      items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    },
  });

  const filteredTechnicians = activeTechnicians.filter(tech => 
    searchQuery === "" || 
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTechnicianSelect = (techId: string) => {
    setSelectedTechnician(techId);
    form.setValue("technicianId", techId);
    const tech = activeTechnicians.find(t => t.id === techId);
    if (tech) {
      // Pre-fill some invoice data based on the technician
      setInvoiceItems([
        { 
          description: `${tech.specialty} Services`, 
          quantity: 1, 
          rate: tech.totalRevenue / tech.completedJobs, 
          amount: tech.totalRevenue / tech.completedJobs 
        },
      ]);
      form.setValue("items", invoiceItems);
    }
  };

  const updateItemAmount = (index: number, quantity: number, rate: number) => {
    const newItems = [...invoiceItems];
    newItems[index].quantity = quantity;
    newItems[index].rate = rate;
    newItems[index].amount = quantity * rate;
    setInvoiceItems(newItems);
  };

  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeInvoiceItem = (index: number) => {
    if (invoiceItems.length > 1) {
      const newItems = invoiceItems.filter((_, i) => i !== index);
      setInvoiceItems(newItems);
    }
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((total, item) => total + item.amount, 0);
  };

  const onSubmit = (data: InvoiceFormValues) => {
    // In a real app, you would send this data to your backend
    // For now, we'll just show a success message
    
    toast({
      title: "Invoice Created",
      description: "Your invoice has been created successfully",
    });
    
    // In a real application, you would redirect to the generated PDF
    // For now, we'll just close the dialog
    setDialogOpen(false);
  };

  const generatePDF = () => {
    // In a real application, this would generate a PDF
    toast({
      title: "PDF Generated",
      description: "Your invoice PDF has been generated and is ready to download",
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Create Invoice</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900">
              <FilePlus className="mr-2 h-4 w-4" /> Create New Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="technicianId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technician</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select technician" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {activeTechnicians.map((tech) => (
                              <SelectItem key={tech.id} value={tech.id}>
                                {tech.name} - {tech.specialty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="invoiceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Invoice Items</h4>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addInvoiceItem}
                    >
                      Add Item
                    </Button>
                  </div>
                  
                  {invoiceItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <Input 
                          placeholder="Description" 
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...invoiceItems];
                            newItems[index].description = e.target.value;
                            setInvoiceItems(newItems);
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input 
                          type="number" 
                          placeholder="Qty" 
                          value={item.quantity}
                          onChange={(e) => {
                            updateItemAmount(index, Number(e.target.value), item.rate);
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input 
                          type="number" 
                          placeholder="Rate" 
                          value={item.rate}
                          onChange={(e) => {
                            updateItemAmount(index, item.quantity, Number(e.target.value));
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input 
                          readOnly 
                          value={formatCurrency(item.amount)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeInvoiceItem(index)}
                          disabled={invoiceItems.length === 1}
                        >
                          &times;
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end pt-4">
                    <div className="w-1/3">
                      <div className="flex justify-between py-1">
                        <span className="font-medium">Total:</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Invoice
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
          <CardDescription>Create and manage technician invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search technicians..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTechnicians.map((tech) => (
              <Card key={tech.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-1 text-sm">
                      {tech.initials}
                    </div>
                    <div>
                      <h3 className="font-medium">{tech.name}</h3>
                      <p className="text-sm text-muted-foreground">{tech.specialty}</p>
                    </div>
                  </div>
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completed Jobs:</span>
                      <span>{tech.completedJobs}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span>{formatCurrency(tech.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment Rate:</span>
                      <span>{tech.paymentType === "percentage" ? `${tech.paymentRate}%` : "Flat"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        handleTechnicianSelect(tech.id);
                        setDialogOpen(true);
                      }}
                    >
                      <FilePlus className="mr-1 h-4 w-4" /> New Invoice
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={generatePDF}
                    >
                      <Download className="mr-1 h-4 w-4" /> PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianInvoiceSection;
