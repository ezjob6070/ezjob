
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "revenue-high" | "revenue-low";

interface JobSortFilterProps {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
}

const JobSortFilter: React.FC<JobSortFilterProps> = ({
  sortBy,
  setSortBy
}) => {
  return (
    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">
          <div className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4" />
            <span>Newest First</span>
          </div>
        </SelectItem>
        <SelectItem value="oldest">
          <div className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4" />
            <span>Oldest First</span>
          </div>
        </SelectItem>
        <SelectItem value="name-asc">
          <div className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4" />
            <span>Name (A-Z)</span>
          </div>
        </SelectItem>
        <SelectItem value="name-desc">
          <div className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4" />
            <span>Name (Z-A)</span>
          </div>
        </SelectItem>
        <SelectItem value="revenue-high">
          <div className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4" />
            <span>Revenue (High-Low)</span>
          </div>
        </SelectItem>
        <SelectItem value="revenue-low">
          <div className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4" />
            <span>Revenue (Low-High)</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default JobSortFilter;
