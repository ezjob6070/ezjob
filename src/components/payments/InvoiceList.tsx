
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileTextIcon, EyeIcon, DownloadIcon, PrinterIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

type Invoice = {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  date: Date;
  dueDate: Date;
  status: "paid" | "pending" | "overdue";
};

type InvoiceDisplayOptions = {
  showJobAddress: boolean;
  showJobDate: boolean;
  showTechnicianEarnings: boolean;
  showCompanyProfit: boolean;
  showPartsValue: boolean;
  showJobDetails: boolean;
  showTotalDue: boolean;
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
    },
    {
      id: "inv4",
      invoiceNumber: "INV-1004",
      client: "John Smith (Technician)",
      amount: 1800,
      date: new Date("2023-09-10"),
      dueDate: new Date("2023-09-25"),
      status: "pending"
    },
    {
      id: "inv5",
      invoiceNumber: "INV-1005",
      client: "Mike Williams (Technician)",
      amount: 2100,
      date: new Date("2023-09-07"),
      dueDate: new Date("2023-09-22"),
      status: "paid"
    }
  ];

  const [displayOptions, setDisplayOptions] = useState<InvoiceDisplayOptions>({
    showJobAddress: true,
    showJobDate: true,
    showTechnicianEarnings: true,
    showCompanyProfit: true,
    showPartsValue: true, 
    showJobDetails: true,
    showTotalDue: true
  });

  const [showFilterBar, setShowFilterBar] = useState(false);

  const toggleOption = (option: keyof InvoiceDisplayOptions) => {
    setDisplayOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

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

  const formatCurrencyValue = (amount: number) => {
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

  // Sample job data for demonstration
  const sampleJobBreakdown = [
    {
      id: "job1",
      title: "Bathroom Plumbing Repair",
      client: "John Doe",
      address: "123 Main St, Anytown, CA",
      date: new Date("2023-09-03"),
      totalAmount: 450,
      technicianRate: 60, // percentage
      technicianEarnings: 270, // 60% of 450
      partsValue: 90, // 20% of 450
      companyProfit: 90, // remainder
      status: "completed"
    },
    {
      id: "job2",
      title: "Kitchen Sink Installation",
      client: "Jane Smith",
      address: "456 Oak Ave, Sometown, CA",
      date: new Date("2023-09-05"),
      totalAmount: 650,
      technicianRate: 60, // percentage
      technicianEarnings: 390, // 60% of 650
      partsValue: 130, // 20% of 650
      companyProfit: 130, // remainder
      status: "completed"
    },
    {
      id: "job3",
      title: "Water Heater Repair",
      client: "Mike Johnson",
      address: "789 Pine Rd, Anywhere, CA",
      date: new Date("2023-09-07"),
      totalAmount: 350,
      technicianRate: 60, // percentage
      technicianEarnings: 210, // 60% of 350
      partsValue: 70, // 20% of 350
      companyProfit: 70, // remainder
      status: "completed"
    }
  ];

  // Calculate totals
  const totalJobRevenue = sampleJobBreakdown.reduce((sum, job) => sum + job.totalAmount, 0);
  const totalTechnicianEarnings = sampleJobBreakdown.reduce((sum, job) => sum + job.technicianEarnings, 0);
  const totalPartsValue = sampleJobBreakdown.reduce((sum, job) => sum + job.partsValue, 0);
  const totalCompanyProfit = sampleJobBreakdown.reduce((sum, job) => sum + job.companyProfit, 0);

  return (
    <div className="space-y-6">
      {/* Invoice Filter Options Panel */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <Button 
          variant="outline" 
          onClick={() => setShowFilterBar(!showFilterBar)}
          className="flex items-center gap-2"
        >
          <FilterIcon className="h-4 w-4" />
          Invoice Display Options
        </Button>
      </div>

      {showFilterBar && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-md">Configure Invoice Display Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="job-address" 
                  checked={displayOptions.showJobAddress}
                  onCheckedChange={() => toggleOption('showJobAddress')}
                />
                <Label htmlFor="job-address">Show Job Address</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="job-date" 
                  checked={displayOptions.showJobDate}
                  onCheckedChange={() => toggleOption('showJobDate')}
                />
                <Label htmlFor="job-date">Show Job Date</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="technician-earnings" 
                  checked={displayOptions.showTechnicianEarnings}
                  onCheckedChange={() => toggleOption('showTechnicianEarnings')}
                />
                <Label htmlFor="technician-earnings">Show Technician Earnings</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="company-profit" 
                  checked={displayOptions.showCompanyProfit}
                  onCheckedChange={() => toggleOption('showCompanyProfit')}
                />
                <Label htmlFor="company-profit">Show Company Profit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="parts-value" 
                  checked={displayOptions.showPartsValue}
                  onCheckedChange={() => toggleOption('showPartsValue')}
                />
                <Label htmlFor="parts-value">Show Parts Value</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="job-details" 
                  checked={displayOptions.showJobDetails}
                  onCheckedChange={() => toggleOption('showJobDetails')}
                />
                <Label htmlFor="job-details">Show Job Details</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice List */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
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
                <TableCell>{formatCurrencyValue(invoice.amount)}</TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      <EyeIcon className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button size="sm" variant="ghost">
                      <PrinterIcon className="h-4 w-4" />
                      <span className="sr-only">Print</span>
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
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  No invoices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Sample Technician Invoice with Jobs Breakdown */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Technician Invoice - Sample</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Technician Information</h3>
                <p>John Smith</p>
                <p>Payment Type: Percentage (60%)</p>
                <p>Invoice Period: Sept 1-15, 2023</p>
              </div>
              <div className="text-right">
                <h3 className="font-medium">Summary</h3>
                <p>Total Revenue: {formatCurrency(totalJobRevenue)}</p>
                <p>Technician Earnings: {formatCurrency(totalTechnicianEarnings)}</p>
                <p>Due to Company: {formatCurrency(totalJobRevenue - totalTechnicianEarnings)}</p>
              </div>
            </div>
          </div>
          
          <h3 className="font-semibold mb-4">Job Breakdown</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job</TableHead>
                  <TableHead>Client</TableHead>
                  {displayOptions.showJobDate && <TableHead>Date</TableHead>}
                  {displayOptions.showJobAddress && <TableHead>Address</TableHead>}
                  <TableHead>Total Amount</TableHead>
                  {displayOptions.showTechnicianEarnings && (
                    <>
                      <TableHead>Tech Rate</TableHead>
                      <TableHead>Tech Earnings</TableHead>
                    </>
                  )}
                  {displayOptions.showPartsValue && <TableHead>Parts Value</TableHead>}
                  {displayOptions.showCompanyProfit && <TableHead>Company Profit</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleJobBreakdown.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.client}</TableCell>
                    {displayOptions.showJobDate && <TableCell>{formatDate(job.date)}</TableCell>}
                    {displayOptions.showJobAddress && <TableCell>{job.address}</TableCell>}
                    <TableCell>{formatCurrency(job.totalAmount)}</TableCell>
                    {displayOptions.showTechnicianEarnings && (
                      <>
                        <TableCell>{job.technicianRate}%</TableCell>
                        <TableCell>{formatCurrency(job.technicianEarnings)}</TableCell>
                      </>
                    )}
                    {displayOptions.showPartsValue && <TableCell>{formatCurrency(job.partsValue)}</TableCell>}
                    {displayOptions.showCompanyProfit && <TableCell>{formatCurrency(job.companyProfit)}</TableCell>}
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50 font-medium">
                  <TableCell colSpan={displayOptions.showJobDate ? 3 : 2}>TOTALS</TableCell>
                  {displayOptions.showJobAddress && <TableCell></TableCell>}
                  <TableCell>{formatCurrency(totalJobRevenue)}</TableCell>
                  {displayOptions.showTechnicianEarnings && (
                    <>
                      <TableCell></TableCell>
                      <TableCell>{formatCurrency(totalTechnicianEarnings)}</TableCell>
                    </>
                  )}
                  {displayOptions.showPartsValue && <TableCell>{formatCurrency(totalPartsValue)}</TableCell>}
                  {displayOptions.showCompanyProfit && <TableCell>{formatCurrency(totalCompanyProfit)}</TableCell>}
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          {displayOptions.showJobDetails && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Job Details</h3>
              {sampleJobBreakdown.map((job) => (
                <div key={`${job.id}-details`} className="mb-4 p-3 border rounded-md">
                  <h4 className="font-medium">{job.title}</h4>
                  <p className="text-sm text-gray-600">Client: {job.client}</p>
                  {displayOptions.showJobAddress && (
                    <p className="text-sm text-gray-600">Address: {job.address}</p>
                  )}
                  {displayOptions.showJobDate && (
                    <p className="text-sm text-gray-600">Date: {formatDate(job.date)}</p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <div className="text-sm">
                      <span className="font-medium">Total: </span>
                      {formatCurrency(job.totalAmount)}
                    </div>
                    {displayOptions.showTechnicianEarnings && (
                      <>
                        <div className="text-sm">
                          <span className="font-medium">Rate: </span>
                          {job.technicianRate}%
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Earnings: </span>
                          {formatCurrency(job.technicianEarnings)}
                        </div>
                      </>
                    )}
                    {displayOptions.showPartsValue && (
                      <div className="text-sm">
                        <span className="font-medium">Parts: </span>
                        {formatCurrency(job.partsValue)}
                      </div>
                    )}
                    {displayOptions.showCompanyProfit && (
                      <div className="text-sm">
                        <span className="font-medium">Company: </span>
                        {formatCurrency(job.companyProfit)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {displayOptions.showTotalDue && (
            <div className="mt-6 p-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Payment terms: Net 30 days</p>
                </div>
                <div>
                  <p className="text-lg font-bold">Total Due to Technician: {formatCurrency(totalTechnicianEarnings)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceList;
