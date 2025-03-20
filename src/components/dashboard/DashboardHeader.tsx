
import React, { useState } from "react";
import { MailIcon, Bell, Calendar, BarChart3, Home, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWindowSize } from "@/hooks/use-window-size";

const DashboardHeader = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="bg-white border border-gray-100 shadow-md rounded-xl -mx-4 -mt-4 md:-mx-6 md:-mt-6 px-5 pt-6 pb-5 md:px-7 md:pt-7 md:pb-7 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 md:gap-6">
        <div className="flex items-center">
          <div className="mr-4 bg-gradient-to-br from-indigo-600 to-violet-600 p-3 rounded-xl shadow-lg shadow-indigo-200">
            <Home className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Hello, Alex Johnson</h1>
            <p className="text-indigo-600 text-sm md:text-base font-medium">Welcome to your Uleadz CRM dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isMobile && (
            <Button 
              variant="outline" 
              className="border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 text-indigo-600 shadow-sm"
            >
              <MailIcon className="mr-2 h-4 w-4" />
              <span>Send Reports</span>
            </Button>
          )}
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
      
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-gray-50 p-1 border border-gray-100 rounded-xl w-full md:w-auto shadow-sm">
            <TabsTrigger 
              value="dashboard" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="statistics" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md transition-all hidden md:flex"
        >
          + New Task
        </Button>
      </div>
      
      <Button 
        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md w-full transition-all md:hidden mb-4"
      >
        + New Task
      </Button>
    </div>
  );
};

export default DashboardHeader;
