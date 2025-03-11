import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Filter, MapPin, Phone, Mail, Star, Building, Briefcase, TrendingUp } from "lucide-react";

type RealEstateAgent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  activeListings: number;
  salesYTD: number;
  revenue: number;
  rating: number;
  specialty: string;
  experience: number;
  avatar?: string;
};

const RealEstateAgents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Sample data for real estate agents
  const agents: RealEstateAgent[] = [
    {
      id: "1",
      name: "Sarah Miller",
      email: "sarah.miller@example.com",
      phone: "(555) 123-4567",
      location: "Downtown Office",
      activeListings: 24,
      salesYTD: 18,
      revenue: 285000,
      rating: 4.9,
      specialty: "Residential Properties",
      experience: 7
    },
    {
      id: "2",
      name: "John Davis",
      email: "john.davis@example.com",
      phone: "(555) 234-5678",
      location: "West Side Branch",
      activeListings: 19,
      salesYTD: 15,
      revenue: 245000,
      rating: 4.8,
      specialty: "Commercial Real Estate",
      experience: 9
    },
    {
      id: "3",
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      phone: "(555) 345-6789",
      location: "North Office",
      activeListings: 22,
      salesYTD: 14,
      revenue: 215000,
      rating: 4.7,
      specialty: "Luxury Homes",
      experience: 5
    },
    {
      id: "4",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "(555) 456-7890",
      location: "Downtown Office",
      activeListings: 16,
      salesYTD: 12,
      revenue: 195000,
      rating: 4.9,
      specialty: "Investment Properties",
      experience: 11
    },
    {
      id: "5",
      name: "Jessica Taylor",
      email: "jessica.taylor@example.com",
      phone: "(555) 567-8901",
      location: "East Side Branch",
      activeListings: 18,
      salesYTD: 10,
      revenue: 175000,
      rating: 4.6,
      specialty: "New Developments",
      experience: 4
    },
    {
      id: "6",
      name: "David Johnson",
      email: "david.johnson@example.com",
      phone: "(555) 678-9012",
      location: "South Office",
      activeListings: 14,
      salesYTD: 9,
      revenue: 155000,
      rating: 4.5,
      specialty: "Residential Properties",
      experience: 6
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('');
  };

  const getRandomColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500"
    ];
    
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         agent.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "top") return matchesSearch && agent.rating >= 4.8;
    if (activeTab === "residential") return matchesSearch && agent.specialty.includes("Residential");
    if (activeTab === "commercial") return matchesSearch && agent.specialty.includes("Commercial");
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Real Estate Agents</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Agent
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            type="search" 
            placeholder="Search agents..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">Sort By</Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm">
          <TabsTrigger value="all">All Agents</TabsTrigger>
          <TabsTrigger value="top">Top Performers</TabsTrigger>
          <TabsTrigger value="residential">Residential</TabsTrigger>
          <TabsTrigger value="commercial">Commercial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map(agent => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-0">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start">
                      <Avatar className={`h-12 w-12 mr-4 ${agent.rating >= 4.8 ? "ring-2 ring-yellow-400" : ""}`}>
                        {agent.avatar ? (
                          <img src={agent.avatar} alt={agent.name} />
                        ) : (
                          <AvatarFallback className={getRandomColor(agent.name)}>
                            {getInitials(agent.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg">{agent.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm">{agent.rating}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{agent.specialty}</div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Briefcase className="h-3 w-3 mr-1" />
                          <span>{agent.experience} years experience</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{agent.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{agent.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{agent.location}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 border-t border-gray-100">
                    <div className="py-3 px-4 text-center border-r border-gray-100">
                      <div className="text-xs text-gray-500">Listings</div>
                      <div className="font-semibold">{agent.activeListings}</div>
                    </div>
                    <div className="py-3 px-4 text-center border-r border-gray-100">
                      <div className="text-xs text-gray-500">Sales YTD</div>
                      <div className="font-semibold">{agent.salesYTD}</div>
                    </div>
                    <div className="py-3 px-4 text-center">
                      <div className="text-xs text-gray-500">Revenue</div>
                      <div className="font-semibold flex items-center justify-center">
                        {formatCurrency(agent.revenue).replace('.00', '')}
                        <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="top" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map(agent => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-0">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start">
                      <Avatar className={`h-12 w-12 mr-4 ${agent.rating >= 4.8 ? "ring-2 ring-yellow-400" : ""}`}>
                        {agent.avatar ? (
                          <img src={agent.avatar} alt={agent.name} />
                        ) : (
                          <AvatarFallback className={getRandomColor(agent.name)}>
                            {getInitials(agent.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg">{agent.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm">{agent.rating}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{agent.specialty}</div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Briefcase className="h-3 w-3 mr-1" />
                          <span>{agent.experience} years experience</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{agent.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{agent.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{agent.location}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 border-t border-gray-100">
                    <div className="py-3 px-4 text-center border-r border-gray-100">
                      <div className="text-xs text-gray-500">Listings</div>
                      <div className="font-semibold">{agent.activeListings}</div>
                    </div>
                    <div className="py-3 px-4 text-center border-r border-gray-100">
                      <div className="text-xs text-gray-500">Sales YTD</div>
                      <div className="font-semibold">{agent.salesYTD}</div>
                    </div>
                    <div className="py-3 px-4 text-center">
                      <div className="text-xs text-gray-500">Revenue</div>
                      <div className="font-semibold flex items-center justify-center">
                        {formatCurrency(agent.revenue).replace('.00', '')}
                        <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="residential" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map(agent => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-0">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start">
                      <Avatar className={`h-12 w-12 mr-4 ${agent.rating >= 4.8 ? "ring-2 ring-yellow-400" : ""}`}>
                        {agent.avatar ? (
                          <img src={agent.avatar} alt={agent.name} />
                        ) : (
                          <AvatarFallback className={getRandomColor(agent.name)}>
                            {getInitials(agent.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg">{agent.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm">{agent.rating}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{agent.specialty}</div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Briefcase className="h-3 w-3 mr-1" />
                          <span>{agent.experience} years experience</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{agent.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{agent.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{agent.location}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 border-t border-gray-100">
                    <div className="py-3 px-4 text-center border-r border-gray-100">
                      <div className="text-xs text-gray-500">Listings</div>
                      <div className="font-semibold">{agent.activeListings}</div>
                    </div>
                    <div className="py-3 px-4 text-center border-r border-gray-100">
                      <div className="text-xs text-gray-500">Sales YTD</div>
                      <div className="font-semibold">{agent.salesYTD}</div>
                    </div>
                    <div className="py-3 px-4 text-center">
                      <div className="text-xs text-gray-500">Revenue</div>
                      <div className="font-semibold flex items-center justify-center">
                        {formatCurrency(agent.revenue).replace('.00', '')}
                        <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="commercial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map(agent => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-0">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start">
                      <Avatar className={`h-12 w-12 mr-4 ${agent.rating >= 4.8 ? "ring-2 ring-yellow-400" : ""}`}>
                        {agent.avatar ? (
                          <img src={agent.avatar} alt={agent.name} />
                        ) : (
                          <AvatarFallback className={getRandomColor(agent.name)}>
                            {getInitials(agent.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg">{agent.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm">{agent.rating}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{agent.specialty}</div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Briefcase className="h-3 w-3 mr-1" />
                          <span>{agent.experience} years experience</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{agent.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{agent.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{agent.location}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 border-t border-gray-100">
                    <div className="py-3 px-4 text-center border-r border-gray-100">
                      <div className="text-xs text-gray-500">Listings</div>
                      <div className="font-semibold">{agent.activeListings}</div>
                    </div>
                    <div className="py-3 px-4 text-center border-r border-gray-100">
                      <div className="text-xs text-gray-500">Sales YTD</div>
                      <div className="font-semibold">{agent.salesYTD}</div>
                    </div>
                    <div className="py-3 px-4 text-center">
                      <div className="text-xs text-gray-500">Revenue</div>
                      <div className="font-semibold flex items-center justify-center">
                        {formatCurrency(agent.revenue).replace('.00', '')}
                        <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealEstateAgents;
