
import React from "react";
import { MailIcon, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const RealEstateHeader = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 -mx-6 -mt-6 px-6 pt-6 pb-8 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="mr-3">
            <span className="text-3xl">🏡</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome, Alex Johnson</h1>
            <p className="text-blue-100">Your Real Estate Portfolio Dashboard</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
            <Input 
              type="search" 
              placeholder="Search properties..." 
              className="w-64 bg-white/10 border-white/20 text-white placeholder:text-white/70 pl-9"
            />
          </div>
          <Button 
            variant="outline" 
            className="bg-white/10 text-white hover:bg-white/20 border-white/20"
          >
            <MailIcon className="mr-2 h-4 w-4" />
            <span>Messages</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:bg-white/10"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <div className="flex flex-col">
            <span className="text-sm text-white/70">Active Listings</span>
            <span className="text-xl font-bold">48</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white/70">Pending Sales</span>
            <span className="text-xl font-bold">15</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white/70">Closed Deals (YTD)</span>
            <span className="text-xl font-bold">82</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white/70">Revenue (YTD)</span>
            <span className="text-xl font-bold">$1.4M</span>
          </div>
        </div>
        
        <Button 
          className="bg-white text-indigo-600 hover:bg-white/90"
        >
          + Add New Listing
        </Button>
      </div>
    </div>
  );
};

export default RealEstateHeader;
