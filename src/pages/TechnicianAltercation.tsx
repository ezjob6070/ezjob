
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Search, FileText, Trophy, TrendingUp, Package, X, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialTechnicians } from "@/data/technicians";
import { Technician } from "@/types/technician";
import TechniciansList from "@/components/technicians/TechniciansList";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const TechnicianAltercation = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const filteredTechnicians = technicians.filter(tech => {
    // Filter by search query
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tech.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tech.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tech.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by active/inactive status
    const matchesStatus = statusFilter === "all" 
                        ? true 
                        : tech.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEditTechnician = (technician: Technician) => {
    // Navigate to technician page or open edit modal
    toast({
      title: "Edit Technician",
      description: `Editing ${technician.name}`,
    });
  };

  // Sort technicians by various metrics to find top performers
  const bestRatedTechnician = [...technicians].sort((a, b) => b.rating - a.rating)[0];
  const mostJobsTechnician = [...technicians].sort((a, b) => b.completedJobs - a.completedJobs)[0];
  const mostRevenueTechnician = [...technicians].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
  
  // Calculate highest and lowest values for scaling
  const highestRevenue = Math.max(...technicians.map(t => t.totalRevenue));
  const highestJobs = Math.max(...technicians.map(t => t.completedJobs));

  // Get top 5 technicians by revenue
  const topTechnicians = [...technicians]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  return (
    <div className="container py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Technicians</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all technicians and their performance records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/technicians/dashboard">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Technician Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Search Technicians</CardTitle>
          <CardDescription>Find technicians by name, specialty, email or phone number</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search technicians..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technicians</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Technicians</TabsTrigger>
          <TabsTrigger value="hvac">HVAC</TabsTrigger>
          <TabsTrigger value="electrical">Electrical</TabsTrigger>
          <TabsTrigger value="plumbing">Plumbing</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <TechniciansList 
            technicians={filteredTechnicians} 
            onEditTechnician={handleEditTechnician}
          />
        </TabsContent>
        <TabsContent value="hvac">
          <TechniciansList 
            technicians={filteredTechnicians.filter(tech => tech.specialty === "HVAC")} 
            onEditTechnician={handleEditTechnician}
          />
        </TabsContent>
        <TabsContent value="electrical">
          <TechniciansList 
            technicians={filteredTechnicians.filter(tech => tech.specialty === "Electrical")} 
            onEditTechnician={handleEditTechnician}
          />
        </TabsContent>
        <TabsContent value="plumbing">
          <TechniciansList 
            technicians={filteredTechnicians.filter(tech => tech.specialty === "Plumbing")} 
            onEditTechnician={handleEditTechnician}
          />
        </TabsContent>
        <TabsContent value="maintenance">
          <TechniciansList 
            technicians={filteredTechnicians.filter(tech => tech.specialty === "General Maintenance")} 
            onEditTechnician={handleEditTechnician}
          />
        </TabsContent>
      </Tabs>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Top Technician Performers</h2>
        <p className="text-muted-foreground">Recognition and performance analytics for your best technicians</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Best Rated Technician */}
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="h-10 w-10 text-amber-500" />
              <div className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                Top Rated
              </div>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white mr-3 text-lg font-bold">
                {bestRatedTechnician.initials}
              </div>
              <div>
                <h3 className="font-bold text-lg">{bestRatedTechnician.name}</h3>
                <p className="text-amber-700">{bestRatedTechnician.specialty}</p>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="flex items-center gap-1 bg-amber-200 text-amber-800 px-3 py-1 rounded-full">
                <Award className="h-4 w-4" />
                <span className="font-medium">{bestRatedTechnician.rating}/5 Rating</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Jobs Completed */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Package className="h-10 w-10 text-blue-500" />
              <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                Most Jobs
              </div>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3 text-lg font-bold">
                {mostJobsTechnician.initials}
              </div>
              <div>
                <h3 className="font-bold text-lg">{mostJobsTechnician.name}</h3>
                <p className="text-blue-700">{mostJobsTechnician.specialty}</p>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="flex items-center gap-1 bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">{mostJobsTechnician.completedJobs} Jobs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Revenue Generated */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-10 w-10 text-emerald-500" />
              <div className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
                Top Sales
              </div>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white mr-3 text-lg font-bold">
                {mostRevenueTechnician.initials}
              </div>
              <div>
                <h3 className="font-bold text-lg">{mostRevenueTechnician.name}</h3>
                <p className="text-emerald-700">{mostRevenueTechnician.specialty}</p>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="flex items-center gap-1 bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">${mostRevenueTechnician.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Technicians by Revenue Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top 5 Technicians by Revenue</CardTitle>
          <CardDescription>Performance comparison of your highest earning technicians</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topTechnicians.map((tech, index) => (
              <div key={tech.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full bg-${index === 0 ? 'amber' : index === 1 ? 'blue' : 'emerald'}-${600 - index * 100} flex items-center justify-center text-white`}>
                      {tech.initials}
                    </div>
                    <span>{tech.name}</span>
                  </div>
                  <span className="font-medium">${tech.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-blue-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(tech.totalRevenue / highestRevenue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Jobs vs Revenue Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs vs Revenue Comparison</CardTitle>
          <CardDescription>Analyzing job quantity and revenue generation for active technicians</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {technicians
              .filter(tech => tech.status === "active")
              .sort((a, b) => b.completedJobs - a.completedJobs)
              .slice(0, 6)
              .map((tech) => (
                <div key={tech.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                        {tech.initials}
                      </div>
                      <span className="font-medium">{tech.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tech.completedJobs} jobs | ${tech.totalRevenue.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Jobs</span>
                      <span>{Math.round((tech.completedJobs / highestJobs) * 100)}%</span>
                    </div>
                    <Progress value={(tech.completedJobs / highestJobs) * 100} className="h-2 bg-gray-100" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Revenue</span>
                      <span>{Math.round((tech.totalRevenue / highestRevenue) * 100)}%</span>
                    </div>
                    <Progress value={(tech.totalRevenue / highestRevenue) * 100} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianAltercation;
