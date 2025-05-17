
import React, { useEffect } from "react";
import { Control, useWatch, UseFormSetValue } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_SUB_ROLES, TechnicianRole } from "@/types/technician";

export interface TechnicianSubRoleFieldProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  defaultValue?: string;
}

export const TechnicianSubRoleField: React.FC<TechnicianSubRoleFieldProps> = ({
  control,
  setValue,
  defaultValue
}) => {
  // Watch for role changes to update sub-role options
  const role = useWatch({
    control,
    name: "role",
    defaultValue: "technician"
  }) as TechnicianRole;

  // Reset sub-role when role changes
  useEffect(() => {
    if (!defaultValue) {
      setValue("subRole", "");
    }
  }, [role, setValue, defaultValue]);

  // Get available sub-roles based on selected role
  const getSubRolesForRole = (selectedRole: TechnicianRole) => {
    return DEFAULT_SUB_ROLES[selectedRole] || [];
  };

  const subRoles = getSubRolesForRole(role);

  return (
    <FormField
      control={control}
      name="subRole"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>Specialty/Sub-Role</FormLabel>
          <Select
            value={field.value || ""}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {subRoles.map((subRole) => (
                <SelectItem key={subRole} value={subRole}>
                  {subRole}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TechnicianSubRoleField;
