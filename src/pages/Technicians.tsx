
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PlusIcon, SearchIcon, PercentIcon, DollarSignIcon, StarIcon, BarChartIcon, BriefcaseIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import AddTechnicianModal from "@/components/technicians/AddTechnicianModal";

type TechnicianPaymentType = "percentage" | "flat";

export type Technician = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  status: "active" | "inactive";
  paymentType: TechnicianPaymentType;
  paymentRate: number;
  completedJobs: number;
  totalRevenue: number;
  rating: number;
  initials: string;
};

const Technicians = () => {
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: "tech1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      specialty: "HVAC",
      status: "active",
      paymentType: "percentage",
      paymentRate: 20,
      completedJobs: 45,
      totalRevenue: 24500,
      rating: 4.8,
      initials: "JS",
    },
    {
      id: "tech2",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(555) 987-6543",
      specialty: "Electrical",
      status: "active",
      paymentType: "percentage",
      paymentRate: 25,
      completedJobs: 38,
      totalRevenue: 19800,
      rating: 4.9,
      initials: "SJ",
    },
    {
      id: "tech3",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "(555) 456-7890",
      specialty: "Plumbing",
      status: "active",
      paymentType: "flat",
      paymentRate: 100,
      completedJobs: 27,
      totalRevenue: 14300,
      rating: 4.5,
      initials: "MB",
    },
    {
      id: "tech4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "(555) 789-0123",
      specialty: "General Maintenance",
      status: "inactive",
      paymentType: "percentage",
      paymentRate: 15,
      completedJobs: 12,
      totalRevenue: 5800,
      rating: 4.2,
      initials: "ED",
    },
  ]);

  const handleAddTechnician = (newTechnician: Technician) => {
    setTechnicians((prevTechnicians) => [newTechnician, ...prevTechnicians]);
    toast({
      title: "Success",
      description: "New technician added successfully",
    });
  };

  const filteredTechnicians = technicians.filter(
    (tech) => 
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const activeTechnicians = technicians.filter(tech => tech.status === "active").length;
  const totalJobs = technicians.reduce((sum, tech) => sum + tech.completedJobs, 0);
  const totalRevenue = technicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);

  return (
    <div className="space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Technicians
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your technicians and their payment structures
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Technician
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Technicians</p>
                <p className="text-2xl font-bold">{activeTechnicians}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <UsersIcon className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Jobs</p>
                <p className="text-2xl font-bold">{totalJobs}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <BriefcaseIcon className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <BarChartIcon className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search technicians..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTechnicians.map((technician) => (
            <Card key={technician.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {technician.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{technician.name}</p>
                      <p className="text-sm text-muted-foreground">{technician.specialty}</p>
                    </div>
                  </div>
                  <Badge variant={technician.status === "active" ? "success" : "outline"}>
                    {technician.status}
                  </Badge>
                </div>

                <div className="mt-5 pt-4 border-t grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Jobs</p>
                      <p className="font-medium">{technician.completedJobs}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="font-medium">{formatCurrency(technician.totalRevenue)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarIcon className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className="font-medium">{technician.rating.toFixed(1)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {technician.paymentType === "percentage" ? (
                      <PercentIcon className="h-4 w-4 text-blue-600" />
                    ) : (
                      <DollarSignIcon className="h-4 w-4 text-green-600" />
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Rate</p>
                      <p className="font-medium">
                        {technician.paymentType === "percentage" 
                          ? `${technician.paymentRate}%` 
                          : `$${technician.paymentRate}`}
                      </p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <AddTechnicianModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddTechnician={handleAddTechnician}
      />
    </div>
  );
};

export default Technicians;

// Fix missing import
import { UsersIcon } from "lucide-react";
