
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, Users, PhoneIcon, MailIcon } from "lucide-react";
import { toast } from "sonner";
import { AddContractorModal } from "@/components/construction/AddContractorModal";

interface Contractor {
  id: number;
  name: string;
  company: string;
  specialty: string;
  phone: string;
  email: string;
  status: "Active" | "On Leave" | "Unavailable";
  rating: number;
}

export default function Contractors() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [contractors, setContractors] = useState<Contractor[]>([
    {
      id: 1,
      name: "John Doe",
      company: "ABC Construction",
      specialty: "Electrical",
      phone: "555-123-4567",
      email: "john@abcconstruction.com",
      status: "Active",
      rating: 4.5
    },
    {
      id: 2,
      name: "Jane Smith",
      company: "Smith Plumbing",
      specialty: "Plumbing",
      phone: "555-987-6543",
      email: "jane@smithplumbing.com",
      status: "Active",
      rating: 4.8
    },
    {
      id: 3,
      name: "Mike Johnson",
      company: "Johnson Roofing",
      specialty: "Roofing",
      phone: "555-456-7890",
      email: "mike@johnsonroofing.com",
      status: "On Leave",
      rating: 4.2
    }
  ]);

  // Calculate stats
  const activeContractors = contractors.filter(c => c.status === "Active").length;
  const onLeaveContractors = contractors.filter(c => c.status === "On Leave").length;
  const unavailableContractors = contractors.filter(c => c.status === "Unavailable").length;

  const handleAddContractor = (data: any) => {
    const newContractor: Contractor = {
      id: contractors.length + 1,
      name: data.name,
      company: data.company,
      specialty: data.specialty,
      phone: data.phone || "",
      email: data.email || "",
      status: data.status as "Active" | "On Leave" | "Unavailable",
      rating: 0
    };
    
    setContractors([...contractors, newContractor]);
    toast.success("New contractor added successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contractors Management</h1>
          <p className="text-muted-foreground">Manage and track your contractors</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <PlusIcon className="h-4 w-4" />
          <span>Add Contractor</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Contractors</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-full p-3">
                <Users className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeContractors}</div>
                <div className="text-sm text-muted-foreground">Currently Working</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">On Leave</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 rounded-full p-3">
                <Users className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{onLeaveContractors}</div>
                <div className="text-sm text-muted-foreground">Temporarily Unavailable</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Unavailable</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 rounded-full p-3">
                <Users className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{unavailableContractors}</div>
                <div className="text-sm text-muted-foreground">Not Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contractors Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractors.map((contractor) => (
                <TableRow key={contractor.id}>
                  <TableCell className="font-medium">{contractor.name}</TableCell>
                  <TableCell>{contractor.company}</TableCell>
                  <TableCell>{contractor.specialty}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <PhoneIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{contractor.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <MailIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{contractor.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      contractor.status === 'Active' ? 'bg-green-100 text-green-700' :
                      contractor.status === 'On Leave' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {contractor.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{contractor.rating}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.floor(contractor.rating) 
                                ? "text-yellow-400" 
                                : star - 0.5 <= contractor.rating 
                                  ? "text-yellow-400/70" 
                                  : "text-gray-300"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddContractorModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAddContractor}
      />
    </div>
  );
}
