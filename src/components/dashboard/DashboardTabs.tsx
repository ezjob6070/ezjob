
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Activity } from "lucide-react";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mr-2">
      <TabsList>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="statistics" className="flex items-center gap-1">
          <BarChart3 className="h-3.5 w-3.5" />
          Statistics
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-1">
          <Activity className="h-3.5 w-3.5" />
          Analytics
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DashboardTabs;
