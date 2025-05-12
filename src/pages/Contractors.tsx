
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  HardHat, 
  Search, 
  Plus, 
  FileText, 
  Clock, 
  Receipt, 
  Mail, 
  User,
  Building,
  Briefcase,
  Phone,
  MapPin,
  ShieldCheck,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { ContractorDetail, ContractorProject, ContractorPayment } from "@/types/contractor";
import { format } from "date-fns";
import ContractorInvoiceSection from "@/components/contractors/ContractorInvoiceSection";

// Mock data for contractors
const mockContractors: ContractorDetail[] = [
  {
    id: "c1",
    name: "John Carpenter",
    email: "john@carpenter.com",
    phone: "555-123-4567",
    address: "123 Builder St",
    city: "Construction City",
    state: "CA",
    zip: "90210",
    status: "active",
    skills: ["Framing", "Flooring", "Drywall"],
    specialties: ["Custom Cabinetry", "Finish Carpentry"],
    businessName: "Carpenter Construction LLC",
    taxId: "12-3456789",
    insurance: {
      provider: "Builder's Insurance Co",
      policyNumber: "BLD-123456",
      expirationDate: "2026-05-15",
      coverageAmount: 1000000
    },
    agreementSigned: true,
    agreementDate: "2023-01-15",
    projects: [
      {
        id: "p1",
        projectId: 1,
        projectName: "City Center Tower",
        startDate: "2023-02-15",
        status: "active",
        role: "Lead Carpenter",
        value: 45000
      },
      {
        id: "p2",
        projectId: 3,
        projectName: "Tech Park Campus",
        startDate: "2023-06-10",
        endDate: "2023-12-15",
        status: "completed",
        role: "Finishing Specialist",
        value: 28000
      }
    ],
    payments: [
      {
        id: "pay1",
        date: "2023-03-15",
        amount: 15000,
        projectId: 1,
        projectName: "City Center Tower",
        status: "paid",
        description: "First milestone payment"
      },
      {
        id: "pay2",
        date: "2023-04-20",
        amount: 15000,
        projectId: 1,
        projectName: "City Center Tower",
        status: "paid",
        description: "Second milestone payment"
      }
    ],
    invoices: [
      {
        id: "inv1",
        invoiceNumber: "INV-2023-001",
        date: "2023-03-10",
        dueDate: "2023-03-24",
        amount: 15000,
        status: "paid",
        projectId: 1,
        projectName: "City Center Tower",
        description: "First milestone work"
      },
      {
        id: "inv2",
        invoiceNumber: "INV-2023-002",
        date: "2023-04-15",
        dueDate: "2023-04-29",
        amount: 15000,
        status: "paid",
        projectId: 1,
        projectName: "City Center Tower",
        description: "Second milestone work"
      }
    ],
    quotes: [
      {
        id: "q1",
        quoteNumber: "Q-2023-001",
        date: "2023-01-05",
        validUntil: "2023-02-05",
        amount: 45000,
        status: "accepted",
        projectId: 1,
        projectName: "City Center Tower",
        description: "Complete carpentry work for the project"
      }
    ]
  },
  {
    id: "c2",
    name: "Sarah Plumber",
    email: "sarah@plumber.com",
    phone: "555-987-6543",
    address: "456 Pipe Ave",
    city: "Waterworks",
    state: "NY",
    zip: "10001",
    status: "active",
    skills: ["Plumbing", "Pipe Fitting", "Water Heaters"],
    specialties: ["Commercial Plumbing", "Leak Detection"],
    businessName: "Sarah's Plumbing Solutions",
    taxId: "98-7654321",
    insurance: {
      provider: "Tradesman Insurance",
      policyNumber: "PLB-654321",
      expirationDate: "2025-11-30",
      coverageAmount: 750000
    },
    agreementSigned: true,
    agreementDate: "2023-02-10",
    projects: [
      {
        id: "p3",
        projectId: 2,
        projectName: "Riverside Residential",
        startDate: "2023-03-01",
        status: "active",
        role: "Lead Plumber",
        value: 35000
      }
    ],
    payments: [
      {
        id: "pay3",
        date: "2023-04-05",
        amount: 10000,
        projectId: 2,
        projectName: "Riverside Residential",
        status: "paid",
        description: "Initial plumbing installation"
      }
    ],
    invoices: [
      {
        id: "inv3",
        invoiceNumber: "INV-2023-003",
        date: "2023-03-30",
        dueDate: "2023-04-13",
        amount: 10000,
        status: "paid",
        projectId: 2,
        projectName: "Riverside Residential",
        description: "Initial plumbing installation"
      }
    ],
    quotes: [
      {
        id: "q2",
        quoteNumber: "Q-2023-002",
        date: "2023-02-15",
        validUntil: "2023-03-15",
        amount: 35000,
        status: "accepted",
        projectId: 2,
        projectName: "Riverside Residential",
        description: "Complete plumbing installation for 350 units"
      }
    ]
  }
];

const Contractors = () => {
  const [contractors, setContractors] = useState<ContractorDetail[]>(mockContractors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContractor, setSelectedContractor] = useState<ContractorDetail | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const filteredContractors = contractors.filter(contractor => {
    // Filter by search query
    const matchesSearch = contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         contractor.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contractor.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || contractor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectContractor = (contractor: ContractorDetail) => {
    setSelectedContractor(contractor);
  };

  const handleCloseDetails = () => {
    setSelectedContractor(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contractors</h1>
          <p className="text-muted-foreground">
            Manage your project contractors and their assignments
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <HardHat className="mr-2 h-4 w-4" />
            Import Contractors
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Contractor
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contractors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            size="sm"
          >
            All
          </Button>
          <Button 
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
            size="sm"
          >
            Active
          </Button>
          <Button 
            variant={statusFilter === "inactive" ? "default" : "outline"}
            onClick={() => setStatusFilter("inactive")}
            size="sm"
          >
            Inactive
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      {!selectedContractor ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContractors.map((contractor) => (
            <Card 
              key={contractor.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleSelectContractor(contractor)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{contractor.name}</CardTitle>
                    <CardDescription>{contractor.businessName}</CardDescription>
                  </div>
                  <Badge variant={contractor.status === "active" ? "default" : "secondary"}>
                    {contractor.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{contractor.specialties.join(", ")}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{contractor.email}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{contractor.phone}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-gray-500">Projects: </span>
                    <span className="font-medium">{contractor.projects?.length || 0}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Invoices: </span>
                    <span className="font-medium">{contractor.invoices?.length || 0}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Quotes: </span>
                    <span className="font-medium">{contractor.quotes?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredContractors.length === 0 && (
            <div className="col-span-3 text-center py-10 border rounded-md bg-gray-50">
              <HardHat className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No contractors found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? "Try adjusting your search or filters" 
                  : "Add your first contractor to get started"}
              </p>
              <Button className="mx-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Contractor
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Back button */}
          <Button variant="ghost" onClick={handleCloseDetails} className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Contractors
          </Button>
          
          {/* Contractor Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{selectedContractor.name}</h1>
                <p className="text-muted-foreground">{selectedContractor.businessName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={selectedContractor.status === "active" ? "default" : "secondary"}>
                {selectedContractor.status === "active" ? "Active" : "Inactive"}
              </Badge>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Edit Details
              </Button>
            </div>
          </div>
          
          {/* Contractor Tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="invoicesQuotes">Invoices & Quotes</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Contractor Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-1">Business Name</h3>
                        <p className="text-gray-600">{selectedContractor.businessName}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Tax ID</h3>
                        <p className="text-gray-600">{selectedContractor.taxId}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Email</h3>
                        <p className="text-gray-600">{selectedContractor.email}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Phone</h3>
                        <p className="text-gray-600">{selectedContractor.phone}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Address</h3>
                      <p className="text-gray-600">{selectedContractor.address}</p>
                      <p className="text-gray-600">
                        {selectedContractor.city}, {selectedContractor.state} {selectedContractor.zip}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Skills & Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedContractor.skills.map((skill) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                      <h4 className="font-medium mt-3 mb-1">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedContractor.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary">{specialty}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Insurance & Contract</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Insurance Details</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-500 text-sm">Provider:</span>
                          <p>{selectedContractor.insurance?.provider}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Policy Number:</span>
                          <p>{selectedContractor.insurance?.policyNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Expiration:</span>
                          <p>{selectedContractor.insurance?.expirationDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Coverage:</span>
                          <p>${selectedContractor.insurance?.coverageAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Agreement Status</h3>
                      <div className="flex items-center">
                        {selectedContractor.agreementSigned ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                        )}
                        <span>
                          {selectedContractor.agreementSigned ? (
                            <>Signed on {selectedContractor.agreementDate}</>
                          ) : (
                            <>Agreement not signed</>
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Activity */}
              <div>
                <h2 className="text-lg font-medium mb-4">Recent Projects</h2>
                {selectedContractor.projects && selectedContractor.projects.length > 0 ? (
                  <div className="space-y-4">
                    {selectedContractor.projects.slice(0, 2).map((project) => (
                      <Card key={project.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{project.projectName}</h3>
                              <p className="text-sm text-gray-500">Role: {project.role}</p>
                            </div>
                            <Badge variant={
                              project.status === "active" ? "default" :
                              project.status === "completed" ? "success" : "secondary"
                            }>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{project.startDate}</span>
                              {project.endDate && (
                                <span className="ml-2">to {project.endDate}</span>
                              )}
                            </div>
                            <div>${project.value.toLocaleString()}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p>No projects assigned yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="projects" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedContractor.projects && selectedContractor.projects.length > 0 ? (
                    <div className="space-y-4">
                      {selectedContractor.projects.map((project) => (
                        <div key={project.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{project.projectName}</h3>
                              <p className="text-sm text-gray-500">Role: {project.role}</p>
                            </div>
                            <Badge variant={
                              project.status === "active" ? "default" :
                              project.status === "completed" ? "success" : "secondary"
                            }>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-4">
                            <div className="text-sm">
                              <span className="text-gray-500">Start Date: </span>
                              <span>{project.startDate}</span>
                            </div>
                            {project.endDate && (
                              <div className="text-sm">
                                <span className="text-gray-500">End Date: </span>
                                <span>{project.endDate}</span>
                              </div>
                            )}
                            <div className="text-sm">
                              <span className="text-gray-500">Value: </span>
                              <span className="font-medium">${project.value.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">No projects assigned to this contractor</p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Assign Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="invoicesQuotes" className="pt-4">
              <ContractorInvoiceSection contractor={selectedContractor} />
            </TabsContent>
            
            <TabsContent value="payments" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedContractor.payments && selectedContractor.payments.length > 0 ? (
                    <div className="relative overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Project</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedContractor.payments.map((payment) => (
                            <tr key={payment.id} className="bg-white border-b">
                              <td className="px-6 py-4">{payment.date}</td>
                              <td className="px-6 py-4 font-medium">${payment.amount.toLocaleString()}</td>
                              <td className="px-6 py-4">{payment.projectName || "N/A"}</td>
                              <td className="px-6 py-4">{payment.description || "N/A"}</td>
                              <td className="px-6 py-4">
                                <Badge variant={
                                  payment.status === "paid" ? "success" :
                                  payment.status === "pending" ? "warning" : "destructive"
                                }>
                                  {payment.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No payments recorded yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">No documents uploaded yet</p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Contractors;
