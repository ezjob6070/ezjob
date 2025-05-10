
import { useState, useEffect } from "react";
import { initialEstimates } from "@/data/estimates";
import { Estimate, EstimateStatus } from "@/types/estimate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SendIcon, ClockIcon, CheckCircleIcon, Search, Filter, SortDesc, Calendar } from "lucide-react";
import EstimateList from "@/components/estimates/EstimateList";
import CreateEstimateButton from "@/components/estimates/CreateEstimateButton";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { addDays, isWithinInterval, parseISO, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

const Estimates = () => {
  const [estimates, setEstimates] = useState<Estimate[]>(initialEstimates);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("sent");
  const [filteredEstimates, setFilteredEstimates] = useState<Estimate[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "amount-high" | "amount-low">("newest");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter and sort estimates based on the selected criteria
  useEffect(() => {
    let result = [...estimates];
    
    // Filter by status
    if (activeTab !== "all") {
      result = result.filter(est => est.status === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        est =>
          est.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          est.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          est.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          est.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by date range
    if (dateRange && dateRange.from) {
      result = result.filter(est => {
        const estDate = est.createdAt instanceof Date ? est.createdAt : parseISO(est.createdAt.toString());
        if (dateRange.to) {
          return isWithinInterval(estDate, { 
            start: dateRange.from, 
            end: dateRange.to 
          });
        }
        return estDate >= dateRange.from;
      });
    }
    
    // Apply sort order
    result = result.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : parseISO(a.createdAt.toString());
      const dateB = b.createdAt instanceof Date ? b.createdAt : parseISO(b.createdAt.toString());
      
      switch (sortOrder) {
        case "newest":
          return dateB.getTime() - dateA.getTime();
        case "oldest":
          return dateA.getTime() - dateB.getTime();
        case "amount-high":
          return b.amount - a.amount;
        case "amount-low":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
    
    setFilteredEstimates(result);
  }, [estimates, activeTab, searchTerm, sortOrder, dateRange]);
  
  const sentEstimates = filteredEstimates.filter(est => est.status === "sent");
  const inProcessEstimates = filteredEstimates.filter(est => est.status === "in-process");
  const completedEstimates = filteredEstimates.filter(est => est.status === "completed");
  const allEstimates = filteredEstimates;

  const addEstimate = (estimate: Estimate) => {
    setEstimates(prev => [...prev, estimate]);
  };

  const updateEstimateStatus = (id: string, status: EstimateStatus) => {
    setEstimates(prev => 
      prev.map(est => est.id === id ? { ...est, status, updatedAt: new Date() } : est)
    );
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateRange(undefined);
    setSortOrder("newest");
  };

  const getFilterCount = (): number => {
    let count = 0;
    if (searchTerm) count++;
    if (dateRange) count++;
    if (sortOrder !== "newest") count++;
    return count;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Estimates</h1>
        <div className="flex items-center gap-2">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                Advanced Options
                {getFilterCount() > 0 && (
                  <Badge variant="secondary" className="ml-1">{getFilterCount()}</Badge>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Advanced Estimate Options</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Date Range</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setDateRange({ 
                        from: addDays(new Date(), -30), 
                        to: new Date() 
                      })}>
                        Last 30 Days
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDateRange({ 
                        from: addDays(new Date(), -90), 
                        to: new Date() 
                      })}>
                        Last 90 Days
                      </Button>
                    </div>
                    {dateRange && (
                      <div className="mt-2 text-sm">
                        {dateRange.from && format(dateRange.from, "MMM d, yyyy")} - 
                        {dateRange.to && format(dateRange.to, "MMM d, yyyy")}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setDateRange(undefined)}
                          className="ml-2 h-auto p-1"
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Sort Options</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={sortOrder === "newest" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setSortOrder("newest")}
                      >
                        Newest First
                      </Button>
                      <Button 
                        variant={sortOrder === "oldest" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setSortOrder("oldest")}
                      >
                        Oldest First
                      </Button>
                      <Button 
                        variant={sortOrder === "amount-high" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setSortOrder("amount-high")}
                      >
                        Highest Amount
                      </Button>
                      <Button 
                        variant={sortOrder === "amount-low" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setSortOrder("amount-low")}
                      >
                        Lowest Amount
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Bulk Actions</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Export Selected
                      </Button>
                      <Button variant="outline" size="sm">
                        Send Reminders
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={clearFilters} variant="secondary" className="w-full">
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
          <CreateEstimateButton onEstimateCreate={addEstimate} />
        </div>
      </div>
      
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search estimates by client, title, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <span>All</span>
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
              {allEstimates.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <SendIcon size={16} />
            <span>Sent</span>
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
              {sentEstimates.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="in-process" className="flex items-center gap-2">
            <ClockIcon size={16} />
            <span>In Process</span>
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
              {inProcessEstimates.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircleIcon size={16} />
            <span>Completed</span>
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
              {completedEstimates.length}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <EstimateList 
            estimates={allEstimates} 
            onStatusChange={updateEstimateStatus}
          />
        </TabsContent>
        
        <TabsContent value="sent" className="mt-6">
          <EstimateList 
            estimates={sentEstimates} 
            onStatusChange={updateEstimateStatus}
          />
        </TabsContent>
        
        <TabsContent value="in-process" className="mt-6">
          <EstimateList 
            estimates={inProcessEstimates} 
            onStatusChange={updateEstimateStatus}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <EstimateList 
            estimates={completedEstimates} 
            onStatusChange={updateEstimateStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Estimates;
