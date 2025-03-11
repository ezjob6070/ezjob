
import { useState } from "react";
import { Building, Home, Users, TrendingUp, MapPin, Calendar, DollarSign, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DonutChart } from "@/components/DonutChart";
import RealEstateHeader from "@/components/realEstate/RealEstateHeader";
import PropertyListingCard from "@/components/realEstate/PropertyListingCard";
import AgentPerformanceCard from "@/components/realEstate/AgentPerformanceCard";
import MarketTrendsChart from "@/components/realEstate/MarketTrendsChart";
import UpcomingViewingsCard from "@/components/realEstate/UpcomingViewingsCard";

const RealEstateDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for property metrics
  const propertyMetrics = {
    activeListings: 48,
    pendingSales: 15,
    recentlySold: 23,
    newLeads: 34
  };
  
  // Sample data for financial metrics
  const financialMetrics = {
    totalCommission: 127500,
    avgListingPrice: 425000,
    monthlyRevenue: 42500,
    conversionRate: 18
  };
  
  // Sample data for property types
  const propertyTypes = [
    { name: "Residential", value: 62, color: "#4f46e5" },
    { name: "Commercial", value: 25, color: "#0ea5e9" },
    { name: "Land", value: 13, color: "#10b981" }
  ];
  
  // Sample data for market breakdown
  const marketBreakdown = [
    { name: "City Center", value: 45, color: "#8b5cf6" },
    { name: "Suburbs", value: 35, color: "#ec4899" },
    { name: "Waterfront", value: 20, color: "#f59e0b" }
  ];
  
  // Sample featured properties
  const featuredProperties = [
    {
      id: "1",
      title: "Modern Luxury Villa",
      address: "123 Lakefront Drive",
      price: 1250000,
      bedrooms: 4,
      bathrooms: 3.5,
      sqft: 3200,
      imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGx1eHVyeSUyMGhvdXNlfGVufDB8fDB8fHww",
      type: "Residential",
      status: "Active"
    },
    {
      id: "2",
      title: "Downtown Office Space",
      address: "456 Business Avenue",
      price: 875000,
      sqft: 2800,
      imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b2ZmaWNlJTIwc3BhY2V8ZW58MHx8MHx8fDA%3D",
      type: "Commercial",
      status: "Active"
    },
    {
      id: "3",
      title: "Waterfront Condo",
      address: "789 Harbor View",
      price: 650000,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1500,
      imageUrl: "https://images.unsplash.com/photo-1551361415-69c87624334f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvbmRvfGVufDB8fDB8fHww",
      type: "Residential",
      status: "Pending"
    }
  ];
  
  // Sample top agents
  const topAgents = [
    { name: "Sarah Miller", listings: 24, sales: 18, revenue: 285000, rating: 4.9 },
    { name: "John Davis", listings: 19, sales: 15, revenue: 245000, rating: 4.8 },
    { name: "Emily Wilson", listings: 22, sales: 14, revenue: 215000, rating: 4.7 },
    { name: "Michael Brown", listings: 16, sales: 12, revenue: 195000, rating: 4.9 }
  ];
  
  // Sample upcoming viewings
  const upcomingViewings = [
    { 
      property: "Modern Luxury Villa", 
      client: "James Wilson", 
      agent: "Sarah Miller", 
      datetime: new Date(new Date().setHours(new Date().getHours() + 4)),
      address: "123 Lakefront Drive"
    },
    { 
      property: "Waterfront Condo", 
      client: "Lisa Johnson", 
      agent: "John Davis", 
      datetime: new Date(new Date().setHours(new Date().getHours() + 24)),
      address: "789 Harbor View"
    },
    { 
      property: "Downtown Office Space", 
      client: "Tech Solutions Inc.", 
      agent: "Emily Wilson", 
      datetime: new Date(new Date().setDate(new Date().getDate() + 2)),
      address: "456 Business Avenue"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6 py-6">
      <RealEstateHeader />
      
      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Property Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <Home className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{propertyMetrics.activeListings}</div>
                <p className="text-xs text-muted-foreground mt-1">Properties on the market</p>
                <div className="mt-2 p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-900/50 w-fit">
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-300">
                    ↑ 7% from last month
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Sales</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{propertyMetrics.pendingSales}</div>
                <p className="text-xs text-muted-foreground mt-1">Contracts pending close</p>
                <div className="mt-2 p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/50 w-fit">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
                    ↑ 12% from last month
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recently Sold</CardTitle>
                <Building className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{propertyMetrics.recentlySold}</div>
                <p className="text-xs text-muted-foreground mt-1">Closed in last 30 days</p>
                <div className="mt-2 p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/50 w-fit">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-300">
                    ↑ 5% from previous period
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{propertyMetrics.newLeads}</div>
                <p className="text-xs text-muted-foreground mt-1">New client inquiries</p>
                <div className="mt-2 p-1.5 rounded-md bg-purple-50 dark:bg-purple-900/50 w-fit">
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-300">
                    ↑ 15% from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts & Financial Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Market Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarketTrendsChart />
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle>Property Types</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <DonutChart 
                      data={propertyTypes}
                      title={propertyMetrics.activeListings.toString()}
                      subtitle="Total Listings"
                    />
                  </CardContent>
                </Card>
                
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle>Market Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <DonutChart 
                      data={marketBreakdown}
                      title={`${propertyMetrics.activeListings + propertyMetrics.pendingSales}`}
                      subtitle="Properties"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Total Commission</p>
                      <p className="text-sm text-muted-foreground">Year to date</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatCurrency(financialMetrics.totalCommission)}</p>
                      <p className="text-xs text-green-500">+12.5% YoY</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Avg. Listing Price</p>
                      <p className="text-sm text-muted-foreground">Active listings</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatCurrency(financialMetrics.avgListingPrice)}</p>
                      <p className="text-xs text-green-500">+3.2% YoY</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Monthly Revenue</p>
                      <p className="text-sm text-muted-foreground">Current month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatCurrency(financialMetrics.monthlyRevenue)}</p>
                      <p className="text-xs text-green-500">+8.7% MoM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Conversion Rate</p>
                      <p className="text-sm text-muted-foreground">Leads to sales</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{financialMetrics.conversionRate}%</p>
                      <p className="text-xs text-green-500">+2.3% YoY</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <UpcomingViewingsCard viewings={upcomingViewings} />
            </div>
          </div>
          
          {/* Featured Properties */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Featured Properties</CardTitle>
              <Button variant="outline" size="sm">View All Properties</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredProperties.map(property => (
                  <PropertyListingCard key={property.id} property={property} />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Top Agents */}
          <AgentPerformanceCard agents={topAgents} formatCurrency={formatCurrency} />
        </TabsContent>
        
        <TabsContent value="properties">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Property Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-10 text-muted-foreground">
                Switch to the Properties tab in the main navigation for full property management.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agents">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Agent Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-10 text-muted-foreground">
                Switch to the Agents tab in the main navigation for full agent management.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-10 text-muted-foreground">
                Detailed market analytics and reports will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealEstateDashboard;
