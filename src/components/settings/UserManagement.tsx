
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserPermissionsForm } from "./UserPermissionsForm";
import { Technician, UserPermission } from "@/types/technician";
import { useTechniciansData } from "@/hooks/useTechniciansData";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export function UserManagement() {
  const { technicians = [] } = useTechniciansData();
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);

  const handleUpdatePermissions = (technicianId: string, data: { userPermission: UserPermission; canViewOwnJobsOnly: boolean }) => {
    // In a real app, this would call an API to update the user permissions
    console.log("Updating permissions for technician", technicianId, data);
    toast.success(`Updated permissions for user`);
    setSelectedTechnician(null);
  };

  const getPermissionBadgeColor = (permission?: UserPermission) => {
    switch (permission) {
      case "admin":
        return "bg-red-500 hover:bg-red-600";
      case "manager":
        return "bg-amber-500 hover:bg-amber-600";
      case "standard":
        return "bg-blue-500 hover:bg-blue-600";
      case "limited":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Configure permissions for users and technicians in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permission Level</TableHead>
                <TableHead>View Own Jobs Only</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.map((technician) => (
                <TableRow key={technician.id}>
                  <TableCell className="font-medium">{technician.name}</TableCell>
                  <TableCell>{technician.role || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={getPermissionBadgeColor(technician.userPermission)}>
                      {technician.userPermission || 'Standard'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {technician.canViewOwnJobsOnly ? 
                      <Check className="text-green-500" size={20} /> : 
                      <X className="text-red-500" size={20} />
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedTechnician(technician)}
                    >
                      Edit Permissions
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={!!selectedTechnician} onOpenChange={() => setSelectedTechnician(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Permissions</DialogTitle>
          </DialogHeader>
          {selectedTechnician && (
            <UserPermissionsForm 
              technician={selectedTechnician} 
              onSave={handleUpdatePermissions}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
