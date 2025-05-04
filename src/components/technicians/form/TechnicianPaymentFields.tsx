
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
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
import { INCENTIVE_TYPE, SALARY_BASIS, SALARY_BASIS_SELECT_OPTIONS, INCENTIVE_TYPE_SELECT_OPTIONS } from "@/types/employee";

interface TechnicianPaymentFieldsProps {
  paymentType: string;
  setPaymentType: (value: string) => void;
  paymentRate: number;
  setPaymentRate: (value: number) => void;
  hourlyRate: number;
  setHourlyRate: (value: number) => void;
  salaryBasis: string;
  setSalaryBasis: (value: string) => void;
  incentiveType: string;
  setIncentiveType: (value: string) => void;
  incentiveAmount: number;
  setIncentiveAmount: (value: number) => void;
  notes: string;
  setNotes: (value: string) => void;
}

const TechnicianPaymentFields = ({
  paymentType,
  setPaymentType,
  paymentRate,
  setPaymentRate,
  hourlyRate,
  setHourlyRate,
  salaryBasis,
  setSalaryBasis,
  incentiveType,
  setIncentiveType,
  incentiveAmount,
  setIncentiveAmount,
  notes,
  setNotes,
}: TechnicianPaymentFieldsProps) => {
  // In a real app, these would come from the backend or constants
  const paymentTypes = [
    { value: "percentage", label: "Percentage" },
    { value: "flat", label: "Flat Rate" },
    { value: "hourly", label: "Hourly" },
  ];

  // Handle payment rate based on selected type
  const handlePaymentTypeChange = (value: string) => {
    setPaymentType(value);
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="payment-type">Payment Type</Label>
            <Select
              value={paymentType}
              onValueChange={handlePaymentTypeChange}
            >
              <SelectTrigger id="payment-type" className="w-full">
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                {paymentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="payment-rate">
              {paymentType === "percentage"
                ? "Commission Percentage"
                : paymentType === "hourly"
                ? "Hourly Rate"
                : "Flat Rate"}
            </Label>
            <div className="flex">
              {paymentType === "percentage" && (
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  %
                </span>
              )}
              {(paymentType === "flat" || paymentType === "hourly") && (
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  $
                </span>
              )}
              <Input
                id="payment-rate"
                type="number"
                value={paymentRate || ""}
                onChange={(e) => setPaymentRate(parseFloat(e.target.value) || 0)}
                className="rounded-l-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="salary-basis">Salary Basis</Label>
            <Select value={salaryBasis} onValueChange={setSalaryBasis}>
              <SelectTrigger id="salary-basis" className="w-full">
                <SelectValue placeholder="Select salary basis" />
              </SelectTrigger>
              <SelectContent>
                {SALARY_BASIS_SELECT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="hourly-rate">Hourly Rate</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                $
              </span>
              <Input
                id="hourly-rate"
                type="number"
                value={hourlyRate || ""}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                className="rounded-l-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="incentive-type">Incentive Type</Label>
            <Select value={incentiveType} onValueChange={setIncentiveType}>
              <SelectTrigger id="incentive-type" className="w-full">
                <SelectValue placeholder="Select incentive type" />
              </SelectTrigger>
              <SelectContent>
                {INCENTIVE_TYPE_SELECT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="incentive-amount">Incentive Amount</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                $
              </span>
              <Input
                id="incentive-amount"
                type="number"
                value={incentiveAmount || ""}
                onChange={(e) =>
                  setIncentiveAmount(parseFloat(e.target.value) || 0)
                }
                className="rounded-l-none"
                disabled={incentiveType === INCENTIVE_TYPE.NONE}
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="payment-notes">Payment Notes</Label>
          <Textarea
            id="payment-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional payment details or notes"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianPaymentFields;
