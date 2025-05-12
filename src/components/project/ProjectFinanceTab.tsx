
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Project } from "@/types/project";
import { BarChart, CheckCircle, Clock, PlusCircle, AlertTriangle } from "lucide-react";
import { toast } from 'sonner';

type Quote = {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: "pending" | "completed" | "overdue";
  date: string;
}

type ProjectFinanceTabProps = {
  project: Project;
}

const ProjectFinanceTab = ({ project }: ProjectFinanceTabProps) => {
  // Sample quotes data
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: 1,
      title: "Initial Site Assessment",
      description: "Comprehensive evaluation of the project site and requirements",
      amount: 2500,
      status: "completed",
      date: "2023-11-15"
    },
    {
      id: 2,
      title: "Materials Supply (Phase 1)",
      description: "Supply of materials for the first construction phase",
      amount: 15800,
      status: "pending",
      date: "2024-01-10"
    },
    {
      id: 3,
      title: "Labor Costs (Month 1)",
      description: "Specialized labor for foundation and structural work",
      amount: 12500,
      status: "completed",
      date: "2023-12-05"
    },
    {
      id: 4,
      title: "Equipment Rental",
      description: "Heavy machinery rental for excavation and site preparation",
      amount: 8750,
      status: "overdue",
      date: "2023-10-20"
    },
    {
      id: 5,
      title: "Consulting Services",
      description: "Engineering consultation and technical specifications",
      amount: 4200,
      status: "pending",
      date: "2024-02-18"
    }
  ]);
  
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>(quotes);
  
  // Apply filters when selection changes
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredQuotes(quotes);
    } else {
      setFilteredQuotes(quotes.filter(quote => quote.status === activeFilter));
    }
  }, [quotes, activeFilter]);

  // Calculate finance statistics
  const totalQuotes = quotes.length;
  const totalValue = quotes.reduce((sum, quote) => sum + quote.amount, 0);
  const pendingValue = quotes
    .filter(quote => quote.status === "pending")
    .reduce((sum, quote) => sum + quote.amount, 0);
  const completedValue = quotes
    .filter(quote => quote.status === "completed")
    .reduce((sum, quote) => sum + quote.amount, 0);
  const overdueValue = quotes
    .filter(quote => quote.status === "overdue")
    .reduce((sum, quote) => sum + quote.amount, 0);

  // Handle status change for a quote
  const handleStatusChange = (id: number, status: "pending" | "completed" | "overdue") => {
    const updatedQuotes = quotes.map(quote => 
      quote.id === id ? { ...quote, status } : quote
    );
    setQuotes(updatedQuotes);
    toast.success(`Quote status updated to ${status}`);
  };

  // Handle setting all quotes to a specific status
  const setAllQuotesToStatus = (status: "pending" | "completed" | "overdue") => {
    const updatedQuotes = quotes.map(quote => ({
      ...quote,
      status
    }));
    setQuotes(updatedQuotes);
    toast.success(`All quotes set to ${status}`);
  };

  // Function to get status badge style
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Finance Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Quotes</CardDescription>
            <CardTitle className="text-2xl">{totalQuotes}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-lg font-medium">{formatCurrency(totalValue)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl">{quotes.filter(q => q.status === "pending").length}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-lg font-medium">{formatCurrency(pendingValue)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl">{quotes.filter(q => q.status === "completed").length}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-lg font-medium">{formatCurrency(completedValue)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue</CardDescription>
            <CardTitle className="text-2xl">{quotes.filter(q => q.status === "overdue").length}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-lg font-medium">{formatCurrency(overdueValue)}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Quotes Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Project Quotes</CardTitle>
              <CardDescription>Manage and track all project quotes</CardDescription>
            </div>
            <Button className="flex items-center gap-2 self-start md:self-center">
              <PlusCircle className="h-4 w-4" />
              Add New Quote
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Quote Filters */}
          <div className="mb-6">
            <Tabs 
              defaultValue="all" 
              value={activeFilter}
              onValueChange={setActiveFilter} 
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 md:w-auto mb-2">
                <TabsTrigger value="all" className="text-base">
                  All Quotes
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-base">
                  <Clock className="h-4 w-4 mr-2 inline" />
                  Pending
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-base">
                  <CheckCircle className="h-4 w-4 mr-2 inline" />
                  Completed
                </TabsTrigger>
                <TabsTrigger value="overdue" className="text-base">
                  <AlertTriangle className="h-4 w-4 mr-2 inline" />
                  Overdue
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-700"
              onClick={() => setAllQuotesToStatus("pending")}
            >
              Set All to Pending
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-700"
              onClick={() => setAllQuotesToStatus("completed")}
            >
              Complete All Quotes
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-700"
              onClick={() => setAllQuotesToStatus("overdue")}
            >
              Mark All as Overdue
            </Button>
          </div>
          
          {/* Quotes List */}
          <div className="space-y-4">
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map(quote => (
                <Card key={quote.id} className={`overflow-hidden ${quote.status === 'overdue' ? 'border-red-300 bg-red-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-medium">{quote.title}</h3>
                          <div className="flex items-center">
                            <Select 
                              defaultValue={quote.status}
                              onValueChange={(value) => handleStatusChange(quote.id, value as any)}
                            >
                              <SelectTrigger className={`w-[120px] h-8 ${getStatusStyles(quote.status)}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{quote.description}</p>
                        <div className="flex items-center gap-6 mt-3">
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{quote.date}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Amount</p>
                            <p className="font-medium">{formatCurrency(quote.amount)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium">No quotes found</h3>
                <p className="text-gray-500 max-w-md mx-auto mt-1">
                  {activeFilter === 'all' 
                    ? 'There are no quotes for this project yet.' 
                    : `There are no ${activeFilter} quotes for this project.`}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectFinanceTab;
