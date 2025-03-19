
import React from "react";
import { MailIcon, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const RealEstateHeader = () => {
  return (
    <div className="bg-white border-b shadow-sm -mx-6 -mt-6 px-6 pt-6 pb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="mr-3">
            <span className="text-3xl">🏡</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, Alex Johnson</h1>
            <p className="text-gray-500">Your Real Estate Portfolio Dashboard</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              type="search" 
              placeholder="Search properties..." 
              className="w-64 bg-gray-50 border-gray-200 pl-9"
            />
          </div>
          <Button 
            variant="outline" 
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <MailIcon className="mr-2 h-4 w-4" />
            <span>Messages</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-700 hover:bg-gray-100"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Active Listings</span>
            <span className="text-xl font-bold">48</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Pending Sales</span>
            <span className="text-xl font-bold">15</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Closed Deals (YTD)</span>
            <span className="text-xl font-bold">82</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Revenue (YTD)</span>
            <span className="text-xl font-bold">$1.4M</span>
          </div>
        </div>
        
        <Button 
          className="bg-gray-800 hover:bg-gray-700 text-white"
        >
          + Add New Listing
        </Button>
      </div>
    </div>
  );
};

export default RealEstateHeader;
