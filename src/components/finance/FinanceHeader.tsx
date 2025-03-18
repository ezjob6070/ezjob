
import React from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";

interface TabOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface FinanceHeaderProps {
  tabOptions: TabOption[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const FinanceHeader: React.FC<FinanceHeaderProps> = () => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* All controls removed as requested */}
      </CardContent>
    </Card>
  );
};

export default FinanceHeader;
