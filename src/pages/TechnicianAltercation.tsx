
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Search, FileText, Trophy, TrendingUp, Package, Award } from "lucide-react";
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
          <Link to="/technicians/analytics">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Technician Analytics
            </Button>
          </Link>
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
    </div>
  );
};

export default TechnicianAltercation;
