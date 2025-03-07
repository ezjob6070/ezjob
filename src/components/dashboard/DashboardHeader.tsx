
import React from "react";
import { MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardHeader = () => {
  return (
    <div className="bg-blue-600 -mx-6 -mt-6 px-6 pt-6 pb-8 text-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="mr-3">
            <span className="text-yellow-200 text-3xl">👋</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Hello, Alex Johnson</h1>
            <p className="text-blue-100">Welcome to your Uleadz CRM dashboard</p>
          </div>
        </div>
        <div>
          <Button 
            variant="secondary" 
            className="bg-white/20 text-white hover:bg-white/30 border-none"
          >
            <MailIcon className="mr-2 h-4 w-4" />
            <span>Send Reports</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="dashboard" className="mt-4">
        <TabsList className="bg-blue-700/30 text-white">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="statistics" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
          >
            Statistics
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
          >
            Analytics
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DashboardHeader;
