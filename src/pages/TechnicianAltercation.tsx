
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Filter, SlidersHorizontal } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import { initialTechnicians } from "@/data/technicians";
import { EditTechnicianModal } from "@/components/technicians/EditTechnicianModal";
import AddTechnicianModal from "@/components/technicians/AddTechnicianModal";

const TechnicianAltercation = () => {
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredTechnicians = technicians.filter(tech => {
    const matchesSearch = searchQuery === "" || 
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || tech.status === statusFilter;
    
    const matchesCategory = categoryFilter === "all" || 
      (tech.category && tech.category === categoryFilter) || 
      (!tech.category && categoryFilter === "uncategorized");
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const toggleTechnician = (techId: string) => {
    setSelectedTechnicians(prev => {
      if (prev.includes(techId)) {
        return prev.filter(id => id !== techId);
      } else {
        return [...prev, techId];
      }
    });
  };

  const getCompensationText = (tech: Technician) => {
    switch (tech.paymentType) {
      case "percentage":
        return `${tech.paymentRate}% of job revenue`;
      case "flat":
        return `$${tech.paymentRate} flat rate per job`;
      case "hourly":
        return `$${tech.paymentRate}/hour`;
      default:
        return "Not set";
    }
  };

  const categories = Array.from(new Set(technicians.map(tech => tech.category || "Uncategorized")));

  const handleEditTechnician = (tech: Technician) => {
    setSelectedTechnician(tech);
    setIsEditModalOpen(true);
  };

  const handleUpdateTechnician = (updatedTechnician: Technician) => {
    setTechnicians(prev => 
      prev.map(tech => tech.id === updatedTechnician.id ? updatedTechnician : tech)
    );
  };

  const handleAddTechnician = (newTechnician: Technician) => {
    setTechnicians(prev => [newTechnician, ...prev]);
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technician Altercation</h1>
          <p className="text-muted-foreground mt-1">Manage conflicts, schedule changes, and technician replacements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900"
          >
            <Plus className="h-4 w-4" />
            Add Technician
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Card className="md:w-2/3">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Technicians List</CardTitle>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search technicians..."
                  className="w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="onLeave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category === "Uncategorized" ? "uncategorized" : category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedTechnicians.length === filteredTechnicians.length && filteredTechnicians.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTechnicians(filteredTechnicians.map(t => t.id));
                        } else {
                          setSelectedTechnicians([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Compensation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTechnicians.map(tech => (
                  <TableRow key={tech.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedTechnicians.includes(tech.id)}
                        onCheckedChange={() => toggleTechnician(tech.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={tech.imageUrl} />
                          <AvatarFallback>{tech.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{tech.name}</p>
                          <p className="text-xs text-muted-foreground">{tech.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{tech.specialty}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          tech.status === "active" ? "success" : 
                          tech.status === "inactive" ? "secondary" : 
                          "outline"
                        }
                      >
                        {tech.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{getCompensationText(tech)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditTechnician(tech)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle>Altercation Summary</CardTitle>
            <CardDescription>
              Selected technicians: {selectedTechnicians.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTechnicians.length > 0 ? (
              <div className="space-y-4">
                {selectedTechnicians.map(techId => {
                  const tech = technicians.find(t => t.id === techId);
                  if (!tech) return null;
                  
                  return (
                    <div key={tech.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={tech.imageUrl} />
                          <AvatarFallback>{tech.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{tech.name}</p>
                          <p className="text-xs text-muted-foreground">{tech.specialty}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => toggleTechnician(tech.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-6">
                <p>No technicians selected</p>
                <p className="text-sm">Select technicians from the list to manage altercations</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              disabled={selectedTechnicians.length === 0}
            >
              Resolve Altercation
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Modals */}
      <EditTechnicianModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onUpdateTechnician={handleUpdateTechnician}
        technician={selectedTechnician}
      />

      <AddTechnicianModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddTechnician={handleAddTechnician}
      />
    </div>
  );
};

export default TechnicianAltercation;
