
import React from 'react';
import { Control, useController } from 'react-hook-form';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface TechnicianDateFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  description?: string;
}

// Changed the export to export a named constant instead of default export
export const TechnicianDateField: React.FC<TechnicianDateFieldProps> = ({
  control,
  name,
  label,
  description
}) => {
  const { field } = useController({
    name,
    control,
    defaultValue: '',
  });

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        type="date"
        id={name}
        {...field}
        className="w-full border rounded-md h-10 px-3"
      />
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
};
