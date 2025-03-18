
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpAZ, ArrowDownAZ, ArrowUp10, ArrowDown10 } from "lucide-react";

interface TechnicianSortFilterProps {
  sortBy: string;
  setSortBy: (value: string) => void;
}

const TechnicianSortFilter: React.FC<TechnicianSortFilterProps> = ({
  sortBy,
  setSortBy
}) => {
  return (
    <Select value={sortBy} onValueChange={setSortBy}>
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
