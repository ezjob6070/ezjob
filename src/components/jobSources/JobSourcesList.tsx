
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, SlidersHorizontal } from "lucide-react";
import { JobSource } from "@/types/jobSource";
import JobSourceCard from "./JobSourceCard";

interface JobSourcesListProps {
  jobSources: JobSource[];
  onEditJobSource: (jobSource: JobSource) => void;
}

const JobSourcesList = ({ jobSources, onEditJobSource }: JobSourcesListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [filterActive, setFilterActive] = useState("all");

  const filteredJobSources = jobSources.filter(source => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    
    // Search by name, phone, email, or website
    const matchesName = source.name.toLowerCase().includes(search);
    const matchesPhone = source.phone?.toLowerCase().includes(search) || false;
    const matchesEmail = source.email?.toLowerCase().includes(search) || false;
    const matchesWebsite = source.website?.toLowerCase().includes(search) || false;
    
    const matchesSearch = matchesName || matchesPhone || matchesEmail || matchesWebsite;
    
    const matchesActiveFilter = filterActive === "all" || 
                              (filterActive === "active" && source.isActive) || 
                              (filterActive === "inactive" && !source.isActive);
    
    return matchesSearch && matchesActiveFilter;
  });

  const sortedJobSources = [...filteredJobSources].sort((a, b) => {
    switch (sortBy) {
      case "revenue":
        return b.totalRevenue - a.totalRevenue;
      case "profit":
        return b.profit - a.profit;
      case "jobs":
        return b.totalJobs - a.totalJobs;
      case "date":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      {showFilters && (
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="profit">Profit</SelectItem>
                <SelectItem value="jobs">Jobs</SelectItem>
                <SelectItem value="date">Date Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Select value={filterActive} onValueChange={setFilterActive}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedJobSources.map((jobSource) => (
          <JobSourceCard 
            key={jobSource.id} 
            jobSource={jobSource}
            onEdit={onEditJobSource}
          />
        ))}
        
        {sortedJobSources.length === 0 && (
          <div className="col-span-3 py-8 text-center">
            <p className="text-muted-foreground">No job sources found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSourcesList;
