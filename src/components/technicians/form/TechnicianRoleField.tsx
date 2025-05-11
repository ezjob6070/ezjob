
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { TechnicianRole, TechnicianSubRoles, DEFAULT_SUB_ROLES } from "@/types/technician";

interface TechnicianRoleFieldProps {
  control: Control<any>;
  defaultValue?: TechnicianRole;
}

export const TechnicianRoleField: React.FC<TechnicianRoleFieldProps> = ({
  control,
  defaultValue = "technician",
}) => {
  // Try to load custom roles from localStorage
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

  return (
    <FormField
      control={control}
      name="role"
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>Role</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technician">Technician</SelectItem>
                <SelectItem value="salesman">Salesman</SelectItem>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
