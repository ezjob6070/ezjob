
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileTextIcon, EyeIcon, DownloadIcon } from "lucide-react";

type Invoice = {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  date: Date;
  dueDate: Date;
  status: "paid" | "pending" | "overdue";
};

const InvoiceList = () => {
  // Mock data for demonstration
  const invoices: Invoice[] = [
    {
      id: "inv1",
      invoiceNumber: "INV-1001",
      client: "Acme Corp",
      amount: 2500,
      date: new Date("2023-09-01"),
      dueDate: new Date("2023-09-15"),
      status: "paid"
    },
    {
      id: "inv2",
      invoiceNumber: "INV-1002",
      client: "Tech Solutions Inc.",
      amount: 1200,
      date: new Date("2023-09-05"),
      dueDate: new Date("2023-09-20"),
      status: "pending"
    },
    {
      id: "inv3",
      invoiceNumber: "INV-1003",
      client: "Global Industries",
      amount: 3400,
      date: new Date("2023-08-28"),
      dueDate: new Date("2023-09-10"),
      status: "overdue"
    }
  ];

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700" variant="outline">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-700">Overdue</Badge>;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="flex items-center">
                    <FileTextIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    {invoice.invoiceNumber}
                  </div>
                </TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      <EyeIcon className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button size="sm" variant="ghost">
                      <DownloadIcon className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {invoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No invoices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InvoiceList;
