
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, User, Trash2, CalendarDays, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { ProjectStaff } from "@/types/finance";

interface ProjectStaffTabProps {
  projectId: number;
  projectStaff?: ProjectStaff[];
}

const ProjectStaffTab: React.FC<ProjectStaffTabProps> = ({ projectId, projectStaff: initialStaff = [] }) => {
  const [staffMembers, setStaffMembers] = useState<ProjectStaff[]>(initialStaff);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<ProjectStaff>>({
    role: "contractor",
    status: "active",
    startDate: new Date().toISOString().split('T')[0],
  });

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    const staffMember: ProjectStaff = {
      id: `staff-${Date.now()}`,
      name: newStaff.name || "",
      role: newStaff.role || "contractor",
      email: newStaff.email,
      phone: newStaff.phone,
      hourlyRate: newStaff.hourlyRate,
      startDate: newStaff.startDate || new Date().toISOString().split('T')[0],
      status: newStaff.status || "active",
      notes: newStaff.notes,
      specialty: newStaff.specialty,
    };

    setStaffMembers([...staffMembers, staffMember]);
    setShowAddDialog(false);
    setNewStaff({
      role: "contractor",
      status: "active",
      startDate: new Date().toISOString().split('T')[0],
    });
    
    toast.success("Staff member added successfully");
  };

  const handleRemoveStaff = (id: string) => {
    setStaffMembers(staffMembers.filter(staff => staff.id !== id));
    toast.success("Staff member removed");
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "terminated":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project Staff & Contractors</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Staff/Contractor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Staff/Contractor</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input 
                    id="name"
                    value={newStaff.name || ""}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    placeholder="Full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select 
                    value={newStaff.role} 
                    onValueChange={(value) => setNewStaff({...newStaff, role: value})}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="contractor">Contractor</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="engineer">Engineer</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={newStaff.email || ""}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone"
                    value={newStaff.phone || ""}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input 
                    id="hourlyRate"
                    type="number"
                    value={newStaff.hourlyRate || ""}
                    onChange={(e) => setNewStaff({...newStaff, hourlyRate: parseFloat(e.target.value)})}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate"
                    type="date"
                    value={newStaff.startDate || ""}
                    onChange={(e) => setNewStaff({...newStaff, startDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input 
                    id="specialty"
                    value={newStaff.specialty || ""}
                    onChange={(e) => setNewStaff({...newStaff, specialty: e.target.value})}
                    placeholder="e.g., Electrical, Plumbing"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={newStaff.status} 
                    onValueChange={(value) => setNewStaff({...newStaff, status: value as "active" | "completed" | "terminated"})}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newStaff.notes || ""}
                  onChange={(e) => setNewStaff({...newStaff, notes: e.target.value})}
                  placeholder="Additional notes about this person..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStaff}>
                Add Staff Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {staffMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffMembers.map((staff) => (
            <Card key={staff.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <User size={18} />
                    </div>
                    <CardTitle className="text-lg">{staff.name}</CardTitle>
                  </div>
                  <Badge className={getStatusBadgeColor(staff.status)}>
                    {staff.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-sm">Role</p>
                    <p className="font-medium capitalize">{staff.role}</p>
                  </div>
                  
                  {staff.specialty && (
                    <div>
                      <p className="text-gray-500 text-sm">Specialty</p>
                      <p>{staff.specialty}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-gray-400" />
                    <span className="text-sm">Started on {staff.startDate}</span>
                  </div>
                  
                  {staff.hourlyRate && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-400" />
                      <span className="text-sm">${staff.hourlyRate}/hour</span>
                    </div>
                  )}
                  
                  {(staff.email || staff.phone) && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        {staff.email && (
                          <p className="text-sm text-gray-600">{staff.email}</p>
                        )}
                        {staff.phone && (
                          <p className="text-sm text-gray-600">{staff.phone}</p>
                        )}
                      </div>
                    </>
                  )}
                  
                  {staff.notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-gray-500 text-sm">Notes</p>
                        <p className="text-sm">{staff.notes}</p>
                      </div>
                    </>
                  )}
                  
                  <div className="pt-2">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full flex items-center justify-center gap-1"
                      onClick={() => handleRemoveStaff(staff.id)}
                    >
                      <Trash2 size={14} />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <User size={48} className="text-gray-300 mb-3" />
            <p className="text-xl font-medium text-gray-500">No staff or contractors yet</p>
            <p className="text-gray-400 mb-4">Add team members to this project</p>
            <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Staff/Contractor
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectStaffTab;
