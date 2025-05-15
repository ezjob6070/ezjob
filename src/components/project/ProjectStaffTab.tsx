
import { useState, useEffect } from "react";
import { Project, ProjectStaff } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users, Download, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectStaffTabProps {
  projectId: number;
  projectStaff?: ProjectStaff[];
  onUpdateProject?: (updatedProject: Project) => void;
}

const ProjectStaffTab = ({ projectId, projectStaff = [], onUpdateProject }: ProjectStaffTabProps) => {
  const [staff, setStaff] = useState<ProjectStaff[]>(projectStaff);
  const [newStaff, setNewStaff] = useState<ProjectStaff>({
    id: `staff-${Date.now()}`,
    name: "",
    role: "",
    email: "",
    phone: "",
    hourlyRate: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    status: "active",
    notes: "",
    specialty: "",
    assignedTasks: []
  });
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  useEffect(() => {
    setStaff(projectStaff || []);
  }, [projectStaff]);

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.role) {
      const updatedStaffList = [...staff, newStaff];
      if (onUpdateProject) {
        onUpdateProject({
          id: projectId,
          name: "",  // These are placeholder values since we don't have the full project
          type: "",
          description: "",
          location: "",
          completion: 0,
          workers: 0,
          vehicles: 0,
          status: "In Progress",
          startDate: "",
          expectedEndDate: "",
          budget: 0,
          actualSpent: 0,
          clientName: "",
          staff: updatedStaffList
        });
      }
      setStaff(updatedStaffList);
      setNewStaff({
        id: `staff-${Date.now()}`,
        name: "",
        role: "",
        email: "",
        phone: "",
        hourlyRate: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        status: "active",
        notes: "",
        specialty: "",
        assignedTasks: []
      });
      setIsAddingStaff(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  const calculateTotalCost = (staffMember: ProjectStaff) => {
    const hourlyRate = staffMember.hourlyRate || 0;
    return hourlyRate;
  };

  return (
    <Tabs defaultValue="staff" className="w-full space-y-4">
      <TabsList>
        <TabsTrigger value="staff">Staff</TabsTrigger>
        <TabsTrigger value="add">Add Staff</TabsTrigger>
      </TabsList>
      <TabsContent value="staff" className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Hourly Rate</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No staff members assigned to this project
                    </TableCell>
                  </TableRow>
                ) : (
                  staff.map((staffMember) => (
                    <TableRow key={staffMember.id}>
                      <TableCell>{staffMember.name}</TableCell>
                      <TableCell>{staffMember.role}</TableCell>
                      <TableCell>{formatCurrency(staffMember.hourlyRate || 0)}</TableCell>
                      <TableCell>{staffMember.specialty || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            staffMember.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : staffMember.status === "completed"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }
                        >
                          {staffMember.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="add">
        <Card>
          <CardHeader>
            <CardTitle>Add New Staff</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newStaff.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  id="role"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newStaff.role}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                  Hourly Rate
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  id="hourlyRate"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newStaff.hourlyRate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                  Specialty
                </label>
                <input
                  type="text"
                  name="specialty"
                  id="specialty"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newStaff.specialty || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <Button onClick={handleAddStaff}>Add Staff</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProjectStaffTab;
