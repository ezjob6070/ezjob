
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { IncentiveType, INCENTIVE_TYPE } from "@/types/employee";
import { SalaryBasis } from "@/types/technician";

interface TechnicianPaymentFieldsProps {
  control: Control<any>;
  defaultSalaryBasis?: SalaryBasis;
  defaultIncentiveType?: IncentiveType;
}

const TechnicianPaymentFields: React.FC<TechnicianPaymentFieldsProps> = ({
  control,
  defaultSalaryBasis,
  defaultIncentiveType
}) => {
  // In a real app, these would come from the backend or constants
  const paymentTypes = [
    { value: "percentage", label: "Percentage" },
    { value: "flat", label: "Flat Rate" },
    { value: "hourly", label: "Hourly" },
  ];

  const SALARY_BASIS_SELECT_OPTIONS = [
    { value: "hourly", label: "Hourly" },
    { value: "annual", label: "Annual" },
    { value: "commission", label: "Commission" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  const INCENTIVE_TYPE_SELECT_OPTIONS = [
    { value: "bonus", label: "Bonus" },
    { value: "commission", label: "Commission" },
    { value: "none", label: "None" },
    { value: "hourly", label: "Hourly" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="paymentRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Rate</FormLabel>
                <FormControl>
                  <Input placeholder="Payment Rate" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="salaryBasis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Basis</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value || defaultSalaryBasis}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select salary basis" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SALARY_BASIS_SELECT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate</FormLabel>
                <FormControl>
                  <Input placeholder="Hourly Rate" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="incentiveType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Incentive Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value || defaultIncentiveType}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select incentive type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INCENTIVE_TYPE_SELECT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="incentiveAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Incentive Amount</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Incentive Amount" 
                    type="text" 
                    {...field} 
                    disabled={field.value === "none"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional payment details or notes" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default TechnicianPaymentFields;
