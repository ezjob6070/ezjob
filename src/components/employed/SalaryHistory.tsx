
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isValid } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Calendar, DollarSign, PlusCircle, BadgeDollarSign } from "lucide-react";
import { SalaryHistory, Employee } from "@/types/employee";

interface SalaryHistoryProps {
  employee: Employee;
  onUpdateEmployee: (updatedEmployee: Employee) => void;
}

const SalaryHistoryComponent: React.FC<SalaryHistoryProps> = ({
  employee,
  onUpdateEmployee,
}) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [type, setType] = useState<"regular" | "bonus" | "commission" | "raise">("regular");

  const handleAddPayment = () => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Error",
        description: "Please enter a date",
        variant: "destructive",
      });
      return;
    }

    const newPayment: SalaryHistory = {
      id: `payment-${Date.now()}`,
      amount: Number(amount),
      date: new Date(date).toISOString(),
      notes: notes,
      type: type,
    };

    const updatedSalaryHistory = [...(employee.salaryHistory || []), newPayment];
    
    const updatedEmployee = {
      ...employee,
      salaryHistory: updatedSalaryHistory,
    };

    onUpdateEmployee(updatedEmployee);

    // Reset form
    setAmount("");
    setDate("");
    setNotes("");
    setType("regular");

    toast({
      title: "Payment Added",
      description: "Salary payment has been added successfully",
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, "MMM d, yyyy") : "Invalid date";
    } catch {
      return "Invalid date";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Add Salary Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={type} onValueChange={(value) => setType(value as any)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular Salary</SelectItem>
                    <SelectItem value="bonus">Bonus</SelectItem>
                    <SelectItem value="commission">Commission</SelectItem>
                    <SelectItem value="raise">Salary Raise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter payment notes (optional)"
                className="mt-1"
              />
            </div>
            <Button onClick={handleAddPayment}>Add Payment</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgeDollarSign className="h-5 w-5" />
            Salary History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {employee.salaryHistory && employee.salaryHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...(employee.salaryHistory || [])]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{formatDate(payment.date)}</TableCell>
                      <TableCell className="font-semibold text-green-700">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <span className={`capitalize ${
                          payment.type === 'bonus' ? 'text-blue-600' :
                          payment.type === 'commission' ? 'text-purple-600' :
                          payment.type === 'raise' ? 'text-amber-600' : 'text-gray-600'
                        }`}>
                          {payment.type}
                        </span>
                      </TableCell>
                      <TableCell>{payment.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No salary history recorded yet.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default SalaryHistoryComponent;
