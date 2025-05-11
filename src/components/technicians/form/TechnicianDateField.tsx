
import React from 'react';
import { Control, useController } from 'react-hook-form';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface TechnicianDateFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  defaultValue?: string;
}

const TechnicianDateField: React.FC<TechnicianDateFieldProps> = ({
  control,
  name,
  label,
  defaultValue
}) => {
  const { field } = useController({
    name,
    control,
    defaultValue: defaultValue || '',
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
    </div>
  );
};

export default TechnicianDateField;
