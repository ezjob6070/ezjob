
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SalaryBasis, IncentiveType, SALARY_BASIS_OPTIONS, INCENTIVE_TYPE_OPTIONS } from "@/types/employee";
import { Control } from "react-hook-form";
import { TechnicianEditFormValues } from "@/lib/validations/technicianEdit";

interface TechnicianPaymentFieldsProps {
  control: Control<TechnicianEditFormValues>;
  defaultSalaryBasis?: SalaryBasis;
  defaultIncentiveType?: IncentiveType;
}

export function TechnicianPaymentFields({ 
  control, 
  defaultSalaryBasis, 
  defaultIncentiveType 
}: TechnicianPaymentFieldsProps) {
  return (
    <>
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
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
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
      <FormField
        control={control}
        name="salaryBasis"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salary Basis</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value as SalaryBasis);
              }}
              defaultValue={defaultSalaryBasis}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select salary basis" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SALARY_BASIS_OPTIONS.map((option) => (
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
              <Input placeholder="Hourly Rate" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="incentiveType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Incentive Type</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value as IncentiveType);
              }}
              defaultValue={defaultIncentiveType}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select incentive type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {INCENTIVE_TYPE_OPTIONS.map((option) => (
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
              <Input placeholder="Incentive Amount" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
