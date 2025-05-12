
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileDown, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { technicians, initialTechnicians } from "@/data/technicians";
import { Technician } from "@/types/technician";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import AddContractorModal from "@/components/contractors/AddContractorModal";

const ContractorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localContractors, setLocalContractors] = useState<Technician[]>([]);
  const navigate = useNavigate();
  
  // Get contractors from both the static data and any newly added ones
  const allContractors = [...technicians.filter(tech => tech.role === "contractor"), ...localContractors];
  
  // Apply search filter
  const filteredContractors = allContractors.filter(contractor => 
    contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contractor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contractor.subRole?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter by status based on current tab
  const displayedContractors = currentTab === "all" 
    ? filteredContractors 
    : filteredContractors.filter(c => c.status.toLowerCase() === currentTab);
  
  const handleAddContractor = (newContractor: Technician) => {
    // In a real app, this would save to the backend
    // For now, we just add it to our local state
    setLocalContractors(prev => [...prev, newContractor]);
  };
  
  // Calculate counts for each tab
  const activeCount = allContractors.filter(c => c.status === "active").length;
  const inactiveCount = allContractors.filter(c => c.status === "inactive").length;
  const onLeaveCount = allContractors.filter(c => c.status === "onLeave").length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contractors</h1>
          <p className="text-muted-foreground">Manage your external contractor relationships</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Contractor
          </Button>
          <Button variant="outline">
            <FileDown className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contractors..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-2" /> Sort
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Contractors ({allContractors.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveCount})</TabsTrigger>
          <TabsTrigger value="onLeave">On Leave ({onLeaveCount})</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedContractors.length > 0 ? (
          displayedContractors.map((contractor) => (
            <Card 
              key={contractor.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/technicians/${contractor.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-lg">
                    {contractor.initials || contractor.name.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-medium">{contractor.name}</h3>
                    <p className="text-sm text-muted-foreground">{contractor.specialty}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-y-2 mb-4 text-sm">
                  <div className="text-muted-foreground">Contractor Type:</div>
                  <div>{contractor.subRole || "General"}</div>
                  
                  <div className="text-muted-foreground">Rate:</div>
                  <div>
                    ${contractor.paymentRate}/{contractor.paymentType === "hourly" ? "hr" : 
                      contractor.paymentType === "flat" ? "job" : "%"}
                  </div>
                  
                  <div className="text-muted-foreground">Since:</div>
                  <div>{format(new Date(contractor.hireDate), "MMM dd, yyyy")}</div>
                  
                  <div className="text-muted-foreground">Contact:</div>
                  <div className="truncate">{contractor.email}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    className={`${
                      contractor.status === "active" ? "bg-green-100 text-green-800" :
                      contractor.status === "inactive" ? "bg-gray-100 text-gray-800" :
                      "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {contractor.status.charAt(0).toUpperCase() + contractor.status.slice(1)}
                  </Badge>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Jobs: </span>
                    <span className="font-medium">{contractor.completedJobs || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg">
            <p className="text-muted-foreground text-center">No contractors found matching your filters.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchQuery("");
                setCurrentTab("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
      
      {/* Add Contractor Modal */}
      <AddContractorModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSave={handleAddContractor}
      />
    </div>
  );
};

export default ContractorsPage;
