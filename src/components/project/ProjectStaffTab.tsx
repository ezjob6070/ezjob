import { useState, useEffect } from "react";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users, Download, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectStaff } from "@/types/finance";

interface ProjectStaffTabProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
}

const ProjectStaffTab = ({ project, onUpdateProject }: ProjectStaffTabProps) => {
  const [staff, setStaff] = useState<ProjectStaff[]>(project.staff || []);
  const [newStaff, setNewStaff] = useState<ProjectStaff>({
    id: `staff-${Date.now()}`,
    name: "",
    role: "",
    hourlyRate: 0,
    totalHours: 0,
    totalCost: 0,
  });
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  useEffect(() => {
    setStaff(project.staff || []);
  }, [project.staff]);

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.role) {
      const updatedStaffList = [...staff, newStaff];
      onUpdateProject({ ...project, staff: updatedStaffList });
      setStaff(updatedStaffList);
      setNewStaff({
        id: `staff-${Date.now()}`,
        name: "",
        role: "",
        hourlyRate: 0,
        totalHours: 0,
        totalCost: 0,
      });
      setIsAddingStaff(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  const calculateTotalCost = (staffMember: ProjectStaff) => {
    return (staffMember.hourlyRate || 0) * (staffMember.totalHours || 0);
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
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Total Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell>{staffMember.name}</TableCell>
                    <TableCell>{staffMember.role}</TableCell>
                    <TableCell>{formatCurrency(staffMember.hourlyRate || 0)}</TableCell>
                    <TableCell>{staffMember.totalHours || 0}</TableCell>
                    <TableCell>{formatCurrency(calculateTotalCost(staffMember))}</TableCell>
                  </TableRow>
                ))}
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
                <label htmlFor="totalHours" className="block text-sm font-medium text-gray-700">
                  Total Hours
                </label>
                <input
                  type="number"
                  name="totalHours"
                  id="totalHours"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newStaff.totalHours}
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
