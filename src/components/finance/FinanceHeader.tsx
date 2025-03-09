
import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface TabOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface FinanceHeaderProps {
  tabOptions: TabOption[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const FinanceHeader: React.FC<FinanceHeaderProps> = ({
  tabOptions,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  date,
  setDate
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex rounded-md shadow-sm">
          {tabOptions.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`flex gap-2 ${activeTab === tab.id ? "" : "hover:bg-gray-50"}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn("h-9 w-9", showFilters ? "bg-blue-50 text-blue-600" : "")}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinanceHeader;
