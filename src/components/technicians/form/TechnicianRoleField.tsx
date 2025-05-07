
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Wrench, Briefcase, UserCheck } from "lucide-react";

interface TechnicianRoleFieldProps {
  control: Control<any>;
  defaultValue?: "technician" | "salesman" | "employed";
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
        <FormItem className="space-y-3">
          <FormLabel>Role</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="technician"
                  id="technician"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="technician"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-primary"
                >
                  <Wrench className="mb-2 h-5 w-5 text-blue-600" />
                  Technician
                </Label>
              </div>
              
              <div>
                <RadioGroupItem
                  value="salesman"
                  id="salesman"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="salesman"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-50 [&:has([data-state=checked])]:border-primary"
                >
                  <Briefcase className="mb-2 h-5 w-5 text-green-600" />
                  Salesman
                </Label>
              </div>
              
              <div>
                <RadioGroupItem
                  value="employed"
                  id="employed"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="employed"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-50 [&:has([data-state=checked])]:border-primary"
                >
                  <UserCheck className="mb-2 h-5 w-5 text-purple-600" />
                  Employed
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
