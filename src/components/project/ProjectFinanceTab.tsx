
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Project, ProjectQuote, ProjectInvoice } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Plus, FileText, Download } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProjectFinanceTabProps {
  project: Project;
}

const ProjectFinanceTab: React.FC<ProjectFinanceTabProps> = ({ project }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<ProjectInvoice | null>(null);

  // Dummy data for quotes if not provided in project
  const quotes = project.quotes || [
    {
      id: "q1",
      createdAt: "2024-04-10",
      sentAt: "2024-04-11",
      status: "accepted",
      validUntil: "2024-05-10",
      totalAmount: 2500,
      items: [
        { id: "qi1", description: "Labor", quantity: 20, unitPrice: 75, totalPrice: 1500 },
        { id: "qi2", description: "Materials", quantity: 1, unitPrice: 1000, totalPrice: 1000 }
      ],
      clientName: project.clientName
    }
  ];

  // Dummy data for invoices if not provided in project
  const invoices = project.invoices || [
    {
      id: "inv1",
      contractorId: "c1",
      contractorName: "ABC Contractors",
      createdAt: "2024-04-15",
      sentAt: "2024-04-16",
      dueDate: "2024-05-15",
      status: "sent",
      totalAmount: 3000,
      items: [
        { id: "i1", description: "Phase 1 Work", quantity: 1, rate: 3000, totalAmount: 3000 }
      ]
    }
  ];

  const revenue = project.revenue || 0;
  const expenses = project.actualSpent || 0;
  const profit = revenue - expenses;

  const handleInvoiceView = (invoice: ProjectInvoice) => {
    setSelectedInvoice(invoice);
  };

  const handleInvoiceClose = () => {
    setSelectedInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-600">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenue)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-red-600">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(expenses)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={profit >= 0 ? "text-green-600" : "text-red-600"}>Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(profit)}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quotes Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Quotes</CardTitle>
            <CardDescription>Client quotes for this project</CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            New Quote
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">Q-{quote.id.toUpperCase()}</TableCell>
                  <TableCell>{quote.clientName}</TableCell>
                  <TableCell>{quote.createdAt}</TableCell>
                  <TableCell>{quote.validUntil}</TableCell>
                  <TableCell>{formatCurrency(quote.totalAmount)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quote.status === "accepted" ? "bg-green-100 text-green-800" :
                      quote.status === "rejected" ? "bg-red-100 text-red-800" :
                      quote.status === "expired" ? "bg-gray-100 text-gray-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {quotes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                    No quotes available for this project
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Invoices Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Payment invoices for this project</CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Contractor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">INV-{invoice.id.toUpperCase()}</TableCell>
                  <TableCell>{invoice.contractorName}</TableCell>
                  <TableCell>{invoice.createdAt}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === "paid" ? "bg-green-100 text-green-800" :
                      invoice.status === "overdue" ? "bg-red-100 text-red-800" :
                      invoice.status === "cancelled" ? "bg-gray-100 text-gray-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleInvoiceView(invoice)}
                    >
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                    No invoices available for this project
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={handleInvoiceClose}>
        <DialogContent className="max-w-3xl">
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Invoice #{selectedInvoice.id}</h2>
                  <p className="text-gray-500">Issued on {selectedInvoice.createdAt}</p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-2">From</h3>
                  <p>Your Company Name</p>
                  <p>123 Business Street</p>
                  <p>Business City, State 12345</p>
                  <p>contact@yourcompany.com</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">To</h3>
                  <p>{selectedInvoice.contractorName}</p>
                  <p>Contractor Address</p>
                  <p>Contractor City, State 12345</p>
                  <p>contractor@email.com</p>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedInvoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.totalAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex justify-end">
                <div className="w-1/3 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedInvoice.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (0%)</span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-1">
                    <span>Total</span>
                    <span>{formatCurrency(selectedInvoice.totalAmount)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-gray-500">
                  {selectedInvoice.notes || "Thank you for your business. Payment is due within 30 days."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectFinanceTab;
