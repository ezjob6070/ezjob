
import React, { useState } from "react";
import { MailIcon, Bell, Calendar, BarChart3, Home } from "lucide-react";
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
    <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 -mx-4 -mt-4 md:-mx-6 md:-mt-6 px-4 pt-6 pb-6 md:px-6 md:pt-8 md:pb-8 border-b shadow-sm rounded-b-lg mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 md:gap-6">
        <div className="flex items-center">
          <div className="mr-4 bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-lg shadow-md">
            <Home className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Hello, Alex Johnson</h1>
            <p className="text-blue-600 text-sm md:text-base font-medium">Welcome to your Uleadz CRM dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isMobile && (
            <Button 
              variant="outline" 
              className="border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-blue-600 shadow-sm"
            >
              <MailIcon className="mr-2 h-4 w-4" />
              <span>Send Reports</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="flex flex-col bg-white rounded-lg p-4 border border-blue-100 shadow-sm hover:shadow-md transition-all">
          <span className="text-sm text-gray-500 mb-1">Active Tasks</span>
          <span className="text-xl font-bold text-blue-700">28</span>
        </div>
        <div className="flex flex-col bg-white rounded-lg p-4 border border-blue-100 shadow-sm hover:shadow-md transition-all">
          <span className="text-sm text-gray-500 mb-1">Pending Jobs</span>
          <span className="text-xl font-bold text-indigo-700">13</span>
        </div>
        <div className="flex flex-col bg-white rounded-lg p-4 border border-blue-100 shadow-sm hover:shadow-md transition-all">
          <span className="text-sm text-gray-500 mb-1">Completed (MTD)</span>
          <span className="text-xl font-bold text-teal-700">42</span>
        </div>
        <div className="flex flex-col bg-white rounded-lg p-4 border border-blue-100 shadow-sm hover:shadow-md transition-all">
          <span className="text-sm text-gray-500 mb-1">Conversion Rate</span>
          <span className="text-xl font-bold text-emerald-700">24.8%</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-blue-50/80 backdrop-blur-sm p-1 border border-blue-100 rounded-lg w-full md:w-auto shadow-sm">
            <TabsTrigger 
              value="dashboard" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="statistics" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md transition-all hidden md:flex"
        >
          + New Task
        </Button>
      </div>
      
      <Button 
        className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md w-full transition-all md:hidden mb-4"
      >
        + New Task
      </Button>
    </div>
  );
};

export default DashboardHeader;
