
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { PERMISSION_DESCRIPTIONS, Technician, UserPermission } from "@/types/technician";
import { toast } from "sonner";

const formSchema = z.object({
  userPermission: z.enum(["admin", "manager", "standard", "limited"] as const),
  canViewOwnJobsOnly: z.boolean().default(false)
});

type UserPermissionsFormProps = {
  technician: Technician;
  onSave: (technicianId: string, data: { userPermission: UserPermission; canViewOwnJobsOnly: boolean }) => void;
};

export function UserPermissionsForm({ technician, onSave }: UserPermissionsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userPermission: (technician.userPermission || "standard") as UserPermission,
      canViewOwnJobsOnly: technician.canViewOwnJobsOnly || false
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(technician.id, values);
    toast.success("User permissions updated successfully");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Permissions</CardTitle>
        <CardDescription>
          Configure access permissions for {technician.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userPermission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permission Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select permission level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {field.value && PERMISSION_DESCRIPTIONS[field.value]}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="canViewOwnJobsOnly"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">View Own Jobs Only</FormLabel>
                    <FormDescription>
                      When enabled, this user can only see jobs assigned to them
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Save Permissions</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
