
import React, { useState } from "react";
import { MailIcon, Bell, Search, Calendar, BarChart3, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const DashboardHeader = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 -mx-6 -mt-6 px-6 pt-6 pb-6 border-b shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="mr-4 bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg shadow-sm">
            <Home className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hello, Alex Johnson</h1>
            <p className="text-blue-600">Welcome to your Uleadz CRM dashboard</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-400" />
            <Input 
              type="search" 
              placeholder="Search dashboard..." 
              className="w-64 bg-white/80 backdrop-blur-sm border-blue-100 pl-9 focus:border-blue-300 focus:ring-blue-200"
            />
          </div>
          <Button 
            variant="outline" 
            className="border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-blue-600"
          >
            <MailIcon className="mr-2 h-4 w-4" />
            <span>Send Reports</span>
          </Button>
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
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex space-x-8">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Active Tasks</span>
            <span className="text-xl font-bold text-blue-700">28</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Pending Jobs</span>
            <span className="text-xl font-bold text-indigo-700">13</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Completed (MTD)</span>
            <span className="text-xl font-bold text-teal-700">42</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Conversion Rate</span>
            <span className="text-xl font-bold text-emerald-700">24.8%</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm"
          >
            + New Task
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="bg-blue-50/80 backdrop-blur-sm p-1 border border-blue-100 rounded-lg">
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
        
        <TabsContent value="dashboard">
          {/* Dashboard content is shown in the parent component */}
        </TabsContent>
        
        <TabsContent value="statistics">
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4 text-gray-800">
            <h2 className="text-xl font-bold mb-4">Statistics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm">
                <h3 className="font-medium text-blue-700">Conversion Rate</h3>
                <p className="text-2xl font-bold mt-2">24.8%</p>
                <p className="text-sm text-green-600 mt-1">↑ 2.1% from last month</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100 shadow-sm">
                <h3 className="font-medium text-purple-700">Average Response Time</h3>
                <p className="text-2xl font-bold mt-2">3.2 hours</p>
                <p className="text-sm text-green-600 mt-1">↑ 15% faster than target</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-100 shadow-sm">
                <h3 className="font-medium text-emerald-700">Customer Satisfaction</h3>
                <p className="text-2xl font-bold mt-2">4.8/5.0</p>
                <p className="text-sm text-green-600 mt-1">↑ 0.2 from previous quarter</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4 text-gray-800">
            <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3">Performance Trends</h3>
                <div className="h-40 flex items-center justify-center border border-dashed border-gray-300 rounded">
                  <p className="text-gray-500">Performance chart visualization would appear here</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">Lead Sources</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Referrals</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Direct</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Social Media</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Other</span>
                      <span className="font-medium">12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">Engagement Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mr-4">
                        <span className="text-lg font-bold">85%</span>
                      </div>
                      <div>
                        <p className="font-medium">Email Open Rate</p>
                        <p className="text-sm text-gray-500">↑ 5% improvement</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mr-4">
                        <span className="text-lg font-bold">62%</span>
                      </div>
                      <div>
                        <p className="font-medium">Follow-up Response</p>
                        <p className="text-sm text-gray-500">↑ 3% improvement</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mr-4">
                        <span className="text-lg font-bold">78%</span>
                      </div>
                      <div>
                        <p className="font-medium">Client Retention</p>
                        <p className="text-sm text-gray-500">↑ 7% improvement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardHeader;
