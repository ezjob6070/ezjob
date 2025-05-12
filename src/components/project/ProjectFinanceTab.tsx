
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project, ProjectQuote } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Clock, FileText, X } from "lucide-react";

interface ProjectFinanceTabProps {
  project: Project;
}

type QuoteStatus = "all" | "draft" | "sent" | "accepted" | "rejected" | "expired" | "overdue";

const ProjectFinanceTab: React.FC<ProjectFinanceTabProps> = ({ project }) => {
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<QuoteStatus>("all");
  
  const projectQuotes = project.quotes || [];
  
  // Apply status filter to quotes
  const filteredQuotes = projectQuotes.filter(quote => {
    if (quoteStatusFilter === "all") return true;
    if (quoteStatusFilter === "overdue") {
      const validUntil = new Date(quote.validUntil);
      const today = new Date();
      return validUntil < today && quote.status !== "accepted" && quote.status !== "rejected";
    }
    return quote.status === quoteStatusFilter;
  });

  // Function to update quote status
  const handleStatusChange = (quoteId: string, newStatus: "draft" | "sent" | "accepted" | "rejected" | "expired") => {
    toast.success(`Quote #${quoteId.slice(0, 5)} status updated to ${newStatus}`);
  };

  // Function to set all quotes to a specific status
  const updateAllQuotesStatus = (status: "draft" | "sent" | "accepted" | "rejected" | "expired") => {
    toast.success(`All quotes updated to ${status}`);
  };

  const getQuoteBadgeStyles = (status: string) => {
    switch(status) {
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "sent":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "accepted":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "expired":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Check if quote is overdue
  const isQuoteOverdue = (validUntil: string) => {
    const validUntilDate = new Date(validUntil);
    const today = new Date();
    return validUntilDate < today;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(project.budget)}</p>
            <p className="text-muted-foreground text-sm">Allocated budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Actual Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(project.actualSpent)}</p>
            <p className="text-muted-foreground text-sm">Total expenses to date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(project.budget - project.actualSpent)}</p>
            <p className="text-muted-foreground text-sm">Available budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Quotes Section */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Project Quotes</CardTitle>
            <div className="flex gap-2">
              <Select onValueChange={(value) => updateAllQuotesStatus(value as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Set All Quotes To..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Set All to Draft</SelectItem>
                  <SelectItem value="sent">Set All to Sent</SelectItem>
                  <SelectItem value="accepted">Set All to Accepted</SelectItem>
                  <SelectItem value="rejected">Set All to Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Improved Quote Status Filter - similar to Task & Progress tab */}
          <div className="p-4 border-b">
            <Tabs 
              value={quoteStatusFilter} 
              onValueChange={(value) => setQuoteStatusFilter(value as QuoteStatus)}
              className="w-full"
            >
              <TabsList className="w-full bg-muted/50 p-1 grid grid-cols-5 sm:grid-cols-7 h-10 mb-2">
                <TabsTrigger value="all" className="flex gap-1 items-center">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">All</span>
                </TabsTrigger>
                <TabsTrigger value="draft" className="flex gap-1 items-center">
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Draft</span>
                </TabsTrigger>
                <TabsTrigger value="sent" className="flex gap-1 items-center">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Sent</span>
                </TabsTrigger>
                <TabsTrigger value="accepted" className="flex gap-1 items-center">
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Accepted</span>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex gap-1 items-center">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Rejected</span>
                </TabsTrigger>
                <TabsTrigger value="expired" className="flex gap-1 items-center">
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Expired</span>
                </TabsTrigger>
                <TabsTrigger value="overdue" className="flex gap-1 items-center">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span className="hidden sm:inline">Overdue</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">
                  {filteredQuotes.length} {filteredQuotes.length === 1 ? 'Quote' : 'Quotes'} 
                  {quoteStatusFilter !== "all" ? 
                    ` • ${quoteStatusFilter.charAt(0).toUpperCase() + quoteStatusFilter.slice(1)}` : ''}
                </h3>
              </div>
            </div>
          </div>
          
          {filteredQuotes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote ID</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => {
                  const isOverdue = isQuoteOverdue(quote.validUntil) && quote.status !== "accepted" && quote.status !== "rejected";
                  
                  return (
                    <TableRow key={quote.id} className={isOverdue ? "bg-red-50" : ""}>
                      <TableCell className="font-medium">#{quote.id.slice(0, 5)}</TableCell>
                      <TableCell>{new Date(quote.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {new Date(quote.validUntil).toLocaleDateString()}
                        {isOverdue && (
                          <Badge variant="destructive" className="ml-2">Overdue</Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatCurrency(quote.totalAmount)}</TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={quote.status}
                          onValueChange={(value) => handleStatusChange(quote.id, value as any)}
                        >
                          <SelectTrigger className={`w-[120px] ${getQuoteBadgeStyles(quote.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            View
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            Download
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium mb-1">No quotes found</h3>
              <p className="text-gray-500 max-w-sm mb-4">
                {quoteStatusFilter !== "all" 
                  ? `There are no quotes with ${quoteStatusFilter} status` 
                  : "No quotes have been created for this project yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoices Section */}
      <Card>
        <CardHeader>
          <CardTitle>Project Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {project.invoices && project.invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Contractor</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">#{invoice.id.slice(0, 5)}</TableCell>
                    <TableCell>{invoice.contractorName}</TableCell>
                    <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge className={
                        invoice.status === "paid" ? "bg-green-100 text-green-800" : 
                        invoice.status === "overdue" ? "bg-red-100 text-red-800" :
                        invoice.status === "sent" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium mb-1">No invoices found</h3>
              <p className="text-gray-500 max-w-sm mb-4">
                No invoices have been created for this project yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expenses Section */}
      <Card>
        <CardHeader>
          <CardTitle>Project Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {project.expenses && project.expenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">#{expense.id.slice(0, 5)}</TableCell>
                    <TableCell>{expense.name}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>
                      <Badge className={
                        expense.status === "paid" ? "bg-green-100 text-green-800" : 
                        expense.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-amber-100 text-amber-800"
                      }>
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium mb-1">No expenses found</h3>
              <p className="text-gray-500 max-w-sm mb-4">
                No expenses have been recorded for this project yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectFinanceTab;
