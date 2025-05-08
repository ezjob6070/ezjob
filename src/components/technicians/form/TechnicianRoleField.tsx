
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { TechnicianRole } from "@/types/technician";

interface TechnicianRoleFieldProps {
  control: Control<any>;
  defaultValue?: TechnicianRole;
}

export const TechnicianRoleField: React.FC<TechnicianRoleFieldProps> = ({
  control,
  defaultValue = "technician",
}) => {
  return (
    <FormField
      control={control}
      name="role"
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem>
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
