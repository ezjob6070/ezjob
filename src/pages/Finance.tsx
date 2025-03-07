import { useState, useEffect } from "react";
import { format, subMonths, addMonths } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { FinancialTransaction, JobSource } from "@/types/finance";
import { sampleTransactions, generateFinancialReport, getDateRangeForTimeFrame } from "@/data/finances";
import JobSourceFinance from "@/components/finance/JobSourceFinance";

const Finance = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(sampleTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<FinancialTransaction[]>([]);
  const [jobSources, setJobSources] = useState<JobSource[]>([
    { id: "1", name: "Website" },
    { id: "2", name: "Referral" },
    { id: "3", name: "Google Ads" },
  ] as JobSource[]);
  const [filteredJobSources, setFilteredJobSources] = useState<JobSource[]>([]);
  const [timeFrame, setTimeFrame] = useState<"month" | "year" | "custom">("month");

  useEffect(() => {
    if (date?.from && date?.to) {
      const filtered = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= date.from && transactionDate <= date.to;
      });
      setFilteredTransactions(filtered);
    }
  }, [date, transactions]);

  useEffect(() => {
    // Simulate fetching job sources and their finances
    // In a real application, you would fetch this data from an API or database
    const simulatedJobSources: JobSource[] = [
      {
        id: "1",
        name: "Website",
        totalJobs: 120,
        totalRevenue: 55000,
        profit: 23000,
        createdAt: new Date(),
      } as JobSource,
      {
        id: "2",
        name: "Referral",
        totalJobs: 80,
        totalRevenue: 40000,
        profit: 18000,
        createdAt: new Date(),
      } as JobSource,
      {
        id: "3",
        name: "Google Ads",
        totalJobs: 150,
        totalRevenue: 70000,
        profit: 30000,
        createdAt: new Date(),
      } as JobSource,
    ];
    setFilteredJobSources(simulatedJobSources);
  }, []);

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Finance</h2>
          <p className="text-muted-foreground">
            Track your company finances and generate reports.
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={
                "w-[300px] justify-start text-left font-normal" +
                (date?.from ? "pl-3.5" : "")
              }
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <JobSourceFinance jobSources={filteredJobSources} transactions={filteredTransactions} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Revenue from all sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$55,000</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>Expenses across all categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$15,000</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
            <CardDescription>Revenue after expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$40,000</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(transaction.date, "MMM d, yyyy")}</TableCell>
                  <TableCell>{transaction.clientName}</TableCell>
                  <TableCell>{transaction.jobTitle}</TableCell>
                  <TableCell>${transaction.amount}</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Finance;
