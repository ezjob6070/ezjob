
import React, { useState } from "react";
import { MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardHeader = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="bg-white -mx-6 -mt-6 px-6 pt-6 pb-8 border-b shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="mr-3">
            <span className="text-3xl">👋</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hello, Alex Johnson</h1>
            <p className="text-gray-500">Welcome to your Uleadz CRM dashboard</p>
          </div>
        </div>
        <div>
          <Button 
            variant="outline" 
            className="border-gray-200 bg-white hover:bg-gray-50"
          >
            <MailIcon className="mr-2 h-4 w-4" />
            <span>Send Reports</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="statistics" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm"
          >
            Statistics
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm"
          >
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          {/* Dashboard content is shown in the parent component */}
        </TabsContent>
        
        <TabsContent value="statistics">
          <div className="mt-4 bg-white rounded-lg shadow-sm p-4 text-gray-800">
            <h2 className="text-xl font-bold mb-4">Statistics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Conversion Rate</h3>
                <p className="text-2xl font-bold mt-2">24.8%</p>
                <p className="text-sm text-green-600 mt-1">↑ 2.1% from last month</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Average Response Time</h3>
                <p className="text-2xl font-bold mt-2">3.2 hours</p>
                <p className="text-sm text-green-600 mt-1">↑ 15% faster than target</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Customer Satisfaction</h3>
                <p className="text-2xl font-bold mt-2">4.8/5.0</p>
                <p className="text-sm text-green-600 mt-1">↑ 0.2 from previous quarter</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="mt-4 bg-white rounded-lg shadow-sm p-4 text-gray-800">
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
