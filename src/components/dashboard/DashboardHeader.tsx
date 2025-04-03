
import React, { useState, useEffect } from "react";
import { Bell, Calendar, BarChart3, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWindowSize } from "@/hooks/use-window-size";

interface DashboardHeaderProps {
  onTabChange?: (tab: string) => void;
  activeTab?: string;
}

const DashboardHeader = ({ onTabChange, activeTab = "dashboard" }: DashboardHeaderProps) => {
  const [localActiveTab, setLocalActiveTab] = useState(activeTab);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  
  // Update local state when parent state changes
  useEffect(() => {
    setLocalActiveTab(activeTab);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setLocalActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-lg -mx-4 -mt-4 md:-mx-6 md:-mt-6 px-5 pt-6 pb-4 md:px-7 md:pt-7 md:pb-2 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
        <div className="flex items-center">
          <div className="mr-4 bg-white p-3 rounded-xl shadow-md text-indigo-600">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Hello, Alex Johnson</h1>
            <p className="text-indigo-600 text-sm md:text-base font-medium">Welcome to your Easy Job dashboard</p>
          </div>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="relative bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-full h-10 w-10"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
          </Button>
        </div>
      </div>
      
      <Tabs value={localActiveTab} onValueChange={handleTabChange} className="w-full">
        <div className="border-b border-gray-100">
          <TabsList className="bg-transparent p-0 w-full md:w-auto justify-start">
            <TabsTrigger 
              value="dashboard" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-700 px-4 py-2"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="statistics" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-700 px-4 py-2"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-700 px-4 py-2"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
};

export default DashboardHeader;
