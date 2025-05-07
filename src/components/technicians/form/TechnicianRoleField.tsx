
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TechnicianRoleFieldProps {
  control: Control<any>;
  defaultValue?: "technician" | "salesman";
}

export const TechnicianRoleField: React.FC<TechnicianRoleFieldProps> = ({
  control,
  defaultValue = "technician"
}) => {
  return (
    <FormField
      control={control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Role</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value || defaultValue}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="technician">Technician</SelectItem>
              <SelectItem value="salesman">Salesman</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TechnicianRoleField;
