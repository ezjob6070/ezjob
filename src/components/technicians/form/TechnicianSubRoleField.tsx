
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { TechnicianRole, TechnicianSubRoles, DEFAULT_SUB_ROLES } from "@/types/technician";

interface TechnicianSubRoleFieldProps {
  control: Control<any>;
  selectedRole: TechnicianRole;
}

export const TechnicianSubRoleField: React.FC<TechnicianSubRoleFieldProps> = ({
  control,
  selectedRole = "technician"
}) => {
  const [customRoles, setCustomRoles] = useState<TechnicianSubRoles>(DEFAULT_SUB_ROLES);
  
  useEffect(() => {
    const savedRoles = localStorage.getItem('customRoles');
    if (savedRoles) {
      try {
        setCustomRoles(JSON.parse(savedRoles));
      } catch (e) {
        console.error('Failed to parse saved roles:', e);
      }
    }
  }, []);

  const subRoles = customRoles[selectedRole] || DEFAULT_SUB_ROLES[selectedRole];

  return (
    <FormField
      control={control}
      name="subRole"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>Specialty</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select specialty" />
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
