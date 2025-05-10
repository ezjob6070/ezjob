
import { Estimate, EstimateStatus } from "@/types/estimate";
import { Card, CardContent } from "@/components/ui/card";
import EstimateCard from "./EstimateCard";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon, FilterIcon, SortAscIcon, CalendarIcon } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface EstimateListProps {
  estimates: Estimate[];
  onStatusChange: (id: string, status: EstimateStatus) => void;
}

const EstimateList = ({ estimates, onStatusChange }: EstimateListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEstimates, setFilteredEstimates] = useState<Estimate[]>(estimates);
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [priceFilter, setPriceFilter] = useState<[number, number] | null>(null);
  const [statusFilters, setStatusFilters] = useState<EstimateStatus[]>([]);
  const [activeFilters, setActiveFilters] = useState<number>(0);
  
  // Apply filtering and sorting
  useEffect(() => {
    // First apply search filter
    let results = estimates.filter(
      (est) =>
        est.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Apply status filters if any are selected
    if (statusFilters.length > 0) {
      results = results.filter(est => statusFilters.includes(est.status));
    }
    
    // Apply price filter if set
    if (priceFilter && priceFilter[0] !== 0 && priceFilter[1] !== 0) {
      results = results.filter(
        est => est.price! >= priceFilter[0] && est.price! <= priceFilter[1]
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "date-desc":
        results = [...results].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "date-asc":
        results = [...results].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case "price-desc":
        results = [...results].sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "price-asc":
        results = [...results].sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "name-asc":
        results = [...results].sort((a, b) => a.clientName.localeCompare(b.clientName));
        break;
      case "name-desc":
        results = [...results].sort((a, b) => b.clientName.localeCompare(a.clientName));
        break;
      default:
        break;
    }
    
    setFilteredEstimates(results);
    
    // Count active filters
    let count = 0;
    if (statusFilters.length > 0) count++;
    if (priceFilter) count++;
    setActiveFilters(count);
    
  }, [estimates, searchTerm, sortBy, priceFilter, statusFilters]);

  const handleStatusFilterChange = (status: EstimateStatus) => {
    if (statusFilters.includes(status)) {
      setStatusFilters(statusFilters.filter(s => s !== status));
    } else {
      setStatusFilters([...statusFilters, status]);
    }
  };

  const handlePriceFilterChange = (min: number, max: number) => {
    setPriceFilter([min, max]);
  };

  const clearFilters = () => {
    setStatusFilters([]);
    setPriceFilter(null);
    setSortBy("date-desc");
  };

  if (estimates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-muted-foreground text-center">No estimates found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:space-x-2">
        <div className="relative w-full sm:max-w-md">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search estimates by client, job title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-1 items-center">
                <FilterIcon className="h-4 w-4" />
                <span>Filters</span>
                {activeFilters > 0 && (
                  <Badge className="ml-1 bg-primary text-primary-foreground rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFilters}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="status-sent" 
                        checked={statusFilters.includes("sent")} 
                        onCheckedChange={() => handleStatusFilterChange("sent")}
                      />
                      <Label htmlFor="status-sent">Sent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="status-in-process" 
                        checked={statusFilters.includes("in-process")} 
                        onCheckedChange={() => handleStatusFilterChange("in-process")}
                      />
                      <Label htmlFor="status-in-process">In Process</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="status-completed" 
                        checked={statusFilters.includes("completed")} 
                        onCheckedChange={() => handleStatusFilterChange("completed")}
                      />
                      <Label htmlFor="status-completed">Completed</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Price Range</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="min-price" className="text-xs">Minimum</Label>
                      <Input 
                        id="min-price" 
                        type="number"
                        placeholder="Min"
                        value={priceFilter?.[0] || ''}
                        onChange={(e) => handlePriceFilterChange(
                          Number(e.target.value), 
                          priceFilter?.[1] || 100000
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-price" className="text-xs">Maximum</Label>
                      <Input 
                        id="max-price" 
                        type="number"
                        placeholder="Max"
                        value={priceFilter?.[1] || ''}
                        onChange={(e) => handlePriceFilterChange(
                          priceFilter?.[0] || 0,
                          Number(e.target.value)
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="price-desc">Highest Price</SelectItem>
              <SelectItem value="price-asc">Lowest Price</SelectItem>
              <SelectItem value="name-asc">Client A-Z</SelectItem>
              <SelectItem value="name-desc">Client Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredEstimates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground text-center">No matching estimates found</p>
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Clear filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEstimates.map((estimate) => (
            <EstimateCard 
              key={estimate.id} 
              estimate={estimate} 
              onStatusChange={onStatusChange} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EstimateList;
