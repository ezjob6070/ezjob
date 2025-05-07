
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface TechnicianRoleFieldProps {
  control: Control<any>;
}

export function TechnicianRoleField({ control }: TechnicianRoleFieldProps) {
  return (
    <FormField
      control={control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Staff Role</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value || "technician"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
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
}
