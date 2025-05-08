
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { DEFAULT_SUB_ROLES, TechnicianRole } from "@/types/technician";

interface TechnicianSubRoleFieldProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  defaultValue?: string;
}

export const TechnicianSubRoleField: React.FC<TechnicianSubRoleFieldProps> = ({
  control,
  setValue,
  defaultValue,
}) => {
  const selectedRole = useWatch({
    control,
    name: "role",
    defaultValue: "technician"
  }) as TechnicianRole;
  
  const subRoles = DEFAULT_SUB_ROLES[selectedRole] || [];
  
  // Reset sub-role when role changes
  useEffect(() => {
    // Only reset if no default value is provided
    if (!defaultValue) {
      setValue("subRole", "");
    }
  }, [selectedRole, setValue, defaultValue]);

  return (
    <FormField
      control={control}
      name="subRole"
      defaultValue={defaultValue || ""}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>Industry/Department</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry/department (optional)" />
              </SelectTrigger>
              <SelectContent>
                {subRoles.map((subRole) => (
                  <SelectItem key={subRole} value={subRole}>
                    {subRole}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
