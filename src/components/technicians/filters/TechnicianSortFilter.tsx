
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpAZ, ArrowDownAZ, ArrowUp10, ArrowDown10, Calendar, DollarSign } from "lucide-react";
import { SortOption } from "@/types/sortOptions";

interface TechnicianSortFilterProps {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
}

const TechnicianSortFilter: React.FC<TechnicianSortFilterProps> = ({
  sortBy,
  setSortBy
}) => {
  return (
    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort technicians" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="name-asc">
          <div className="flex items-center gap-2">
            <ArrowUpAZ className="h-4 w-4" />
            <span>Name A-Z</span>
          </div>
        </SelectItem>
        <SelectItem value="name-desc">
          <div className="flex items-center gap-2">
            <ArrowDownAZ className="h-4 w-4" />
            <span>Name Z-A</span>
          </div>
        </SelectItem>
        <SelectItem value="newest">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Newest First</span>
          </div>
        </SelectItem>
        <SelectItem value="oldest">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Oldest First</span>
          </div>
        </SelectItem>
        <SelectItem value="revenue-high">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Highest Revenue</span>
          </div>
        </SelectItem>
        <SelectItem value="profit-high">
          <div className="flex items-center gap-2">
            <ArrowUp10 className="h-4 w-4" />
            <span>Most Profitable</span>
          </div>
        </SelectItem>
        <SelectItem value="profit-low">
          <div className="flex items-center gap-2">
            <ArrowDown10 className="h-4 w-4" />
            <span>Least Profitable</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TechnicianSortFilter;
