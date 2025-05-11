
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { DEFAULT_SUB_ROLES, TechnicianRole } from "@/types/technician";

interface TechnicianSubRoleFieldProps {
  control: Control<any>;
  setValue?: UseFormSetValue<any>;
  defaultValue?: string;
}

const TechnicianSubRoleField: React.FC<TechnicianSubRoleFieldProps> = ({
  control,
  setValue,
  defaultValue = "",
}) => {
  // Watch role field to determine sub-role options
  const role = useWatch({
    control,
    name: "role",
    defaultValue: "technician",
  }) as TechnicianRole;

  // Reset sub-role when role changes
  useEffect(() => {
    if (setValue) {
      setValue("subRole", "");
    }
  }, [role, setValue]);

  // Get sub-roles based on selected role
  const subRoles = DEFAULT_SUB_ROLES[role] || [];

  return (
    <FormField
      control={control}
      name="subRole"
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>Specific Role</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select specific role" />
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

export default TechnicianSubRoleField;
