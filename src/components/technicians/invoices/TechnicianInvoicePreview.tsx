
import React from "react";
import { Technician } from "@/types/technician";
import { format } from "date-fns";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/components/jobs/JobTypes";
import { initialJobs } from "@/data/jobs";

interface TechnicianInvoicePreviewProps {
  technician: Technician;
  settings: {
    invoiceTitle: string;
    invoiceNumber?: string;
    showJobAddress: boolean;
    showJobDate: boolean;
    showTechnicianEarnings: boolean;
    showCompanyProfit: boolean;
    showPartsValue: boolean;
    showDetails: boolean;
    jobStatus: string;
    dateRange: string;
    customDateFrom?: string;
    customDateTo?: string;
  };
}

const TechnicianInvoicePreview: React.FC<TechnicianInvoicePreviewProps> = ({
  technician,
  settings
}) => {
  // Filter jobs based on settings
  const technicianJobs = initialJobs.filter(job => 
    job.technicianName === technician.name && 
    (settings.jobStatus === "all" || job.status === settings.jobStatus)
  );
  
  // Calculate totals
  const totalRevenue = technicianJobs.reduce((sum, job) => sum + (job.amount || 0), 0);
  const technicianEarnings = totalRevenue * (technician.paymentType === "percentage" ? technician.paymentRate / 100 : 1);
  const partsValue = totalRevenue * 0.2; // Assuming parts are 20% of total revenue
  const companyProfit = totalRevenue - technicianEarnings - partsValue;
  
  return (
    <Card className="shadow-lg border">
      <CardHeader className="border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{settings.invoiceTitle}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              <p>Generated on {format(new Date(), "MMMM d, yyyy")}</p>
              {settings.invoiceNumber && <p>Invoice #{settings.invoiceNumber}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Technician Information</h3>
            <div className="space-y-1">
              <p><span className="font-medium">Name:</span> {technician.name}</p>
              <p><span className="font-medium">Payment Type:</span> {technician.paymentType === "percentage" ? `Percentage (${technician.paymentRate}%)` : "Flat Rate"}</p>
              <p><span className="font-medium">Phone:</span> {technician.phone || "Not provided"}</p>
              <p><span className="font-medium">Email:</span> {technician.email || "Not provided"}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <div className="space-y-1">
              <p><span className="font-medium">Total Jobs:</span> {technicianJobs.length}</p>
              <p><span className="font-medium">Total Revenue:</span> {formatCurrency(totalRevenue)}</p>
              {settings.showTechnicianEarnings && (
                <p><span className="font-medium">Technician Earnings:</span> {formatCurrency(technicianEarnings)}</p>
              )}
              {settings.showPartsValue && (
                <p><span className="font-medium">Parts Value:</span> {formatCurrency(partsValue)}</p>
              )}
              {settings.showCompanyProfit && (
                <p><span className="font-medium">Company Profit:</span> {formatCurrency(companyProfit)}</p>
              )}
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-4">Job Details</h3>
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Job Title</TableHead>
                {settings.showJobDate && <TableHead>Date</TableHead>}
                {settings.showJobAddress && <TableHead>Address</TableHead>}
                <TableHead>Amount</TableHead>
                {settings.showTechnicianEarnings && <TableHead>Technician Earnings</TableHead>}
                {settings.showPartsValue && <TableHead>Parts</TableHead>}
                {settings.showCompanyProfit && <TableHead>Company Profit</TableHead>}
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicianJobs.length > 0 ? (
                technicianJobs.map((job) => {
                  const jobAmount = job.amount || 0;
                  const jobTechEarnings = jobAmount * (technician.paymentType === "percentage" ? technician.paymentRate / 100 : 1);
                  const jobPartsValue = jobAmount * 0.2;
                  const jobCompanyProfit = jobAmount - jobTechEarnings - jobPartsValue;
                  
                  return (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.clientName}</TableCell>
                      <TableCell>{job.title}</TableCell>
                      {settings.showJobDate && (
                        <TableCell>{format(job.date, "MMM d, yyyy")}</TableCell>
                      )}
                      {settings.showJobAddress && (
                        <TableCell className="max-w-[200px] truncate" title={job.address}>
                          {job.address}
                        </TableCell>
                      )}
                      <TableCell>{formatCurrency(jobAmount)}</TableCell>
                      {settings.showTechnicianEarnings && (
                        <TableCell>{formatCurrency(jobTechEarnings)}</TableCell>
                      )}
                      {settings.showPartsValue && (
                        <TableCell>{formatCurrency(jobPartsValue)}</TableCell>
                      )}
                      {settings.showCompanyProfit && (
                        <TableCell>{formatCurrency(jobCompanyProfit)}</TableCell>
                      )}
                      <TableCell>
                        <Badge
                          className={
                            job.status === "completed" ? "bg-green-500" :
                            job.status === "scheduled" ? "bg-yellow-500" :
                            job.status === "in_progress" ? "bg-blue-500" :
                            "bg-red-500"
                          }
                        >
                          {job.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    No jobs found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {settings.showDetails && technicianJobs.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Job Notes</h3>
            <div className="space-y-4">
              {technicianJobs.map((job) => (
                job.notes ? (
                  <div key={`${job.id}-notes`} className="p-4 border rounded-md">
                    <p className="font-medium">{job.title} - {job.clientName}</p>
                    <p className="text-sm mt-1">{job.description}</p>
                    <p className="text-sm text-muted-foreground mt-2 italic">Notes: {job.notes}</p>
                  </div>
                ) : null
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Thank you for your services.
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">Total Due: {formatCurrency(technicianEarnings)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Payment due within 30 days
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianInvoicePreview;
