
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, Trash2, Edit } from "lucide-react";
import { TechnicianRole, TechnicianSubRoles, DEFAULT_SUB_ROLES } from "@/types/technician";
import { toast } from "@/components/ui/use-toast";

interface EditRolesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveRoles: (roles: TechnicianSubRoles) => void;
  currentRoles: TechnicianSubRoles;
}

const EditRolesModal: React.FC<EditRolesModalProps> = ({
  open,
  onOpenChange,
  onSaveRoles,
  currentRoles = DEFAULT_SUB_ROLES,
}) => {
  const [roles, setRoles] = useState<TechnicianSubRoles>(currentRoles);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedRoleType, setSelectedRoleType] = useState<TechnicianRole>("technician");

  const handleAddRole = () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Error",
        description: "Role name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Check if role already exists
    if (roles[selectedRoleType].includes(newRoleName.trim())) {
      toast({
        title: "Error",
        description: "Role already exists",
        variant: "destructive",
      });
      return;
    }

    setRoles(prevRoles => ({
      ...prevRoles,
      [selectedRoleType]: [...prevRoles[selectedRoleType], newRoleName.trim()]
    }));

    setNewRoleName("");
  };

  const handleRemoveRole = (roleType: TechnicianRole, roleName: string) => {
    setRoles(prevRoles => ({
      ...prevRoles,
      [roleType]: prevRoles[roleType].filter(r => r !== roleName)
    }));
  };

  const handleSave = () => {
    onSaveRoles(roles);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Staff Roles</DialogTitle>
          <DialogDescription>
            Add, edit, or remove staff roles for your team members.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor="roleType">Role Type</Label>
              <select
                id="roleType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedRoleType}
                onChange={(e) => setSelectedRoleType(e.target.value as TechnicianRole)}
              >
                <option value="technician">Technician</option>
                <option value="salesman">Salesman</option>
                <option value="employed">Employed</option>
                <option value="contractor">Contractor</option>
              </select>
            </div>
            <div className="flex-1">
              <Label htmlFor="roleName">New Role Name</Label>
              <Input
                id="roleName"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>
            <Button onClick={handleAddRole} size="sm" className="mb-[1px]">
              <PlusIcon className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          {/* Role Lists */}
          <div className="space-y-6">
            {Object.entries(roles).map(([roleType, roleNames]) => (
              <div key={roleType} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 capitalize">{roleType} Roles</h3>
                <div className="border rounded-md divide-y">
                  {roleNames.length === 0 ? (
                    <p className="text-sm text-gray-500 p-3">No roles defined</p>
                  ) : (
                    roleNames.map((roleName, index) => (
                      <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50">
                        <span className="text-sm">{roleName}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRole(roleType as TechnicianRole, roleName)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRolesModal;
