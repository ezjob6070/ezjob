
import { useState, useEffect } from "react";
import { format } from 'date-fns';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FinancialTransaction, JobSource } from "@/types/finance";
import { sampleTransactions, generateFinancialReport, getDateRangeForTimeFrame } from "@/data/finances";
import JobSourceFinance from "@/components/finance/JobSourceFinance";
import TransactionHistory from "@/components/payments/TransactionHistory";
import PaymentForm from "@/components/payments/PaymentForm";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { initialTechnicians } from "@/data/technicians";
import DashboardMetricCard from "@/components/DashboardMetricCard";

const Finance = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(sampleTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<FinancialTransaction[]>([]);
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [activeTechnicians, setActiveTechnicians] = useState(initialTechnicians.filter(tech => tech.status === "active"));

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
    // Prepare job sources with financial data
    const sources: JobSource[] = [
      {
        id: "js1",
        name: "Website",
        totalJobs: 120,
        totalRevenue: 55000,
        expenses: 12000,
        companyProfit: 23000,
        createdAt: new Date(),
      },
      {
        id: "js2", 
        name: "Referral",
        totalJobs: 80,
        totalRevenue: 40000,
        expenses: 8000,
        companyProfit: 18000,
        createdAt: new Date(),
      },
      {
        id: "js3",
        name: "Google Ads",
        totalJobs: 150,
        totalRevenue: 70000,
        expenses: 25000,
        companyProfit: 30000,
        createdAt: new Date(),
      },
      {
        id: "js4",
        name: "Social Media",
        totalJobs: 65,
        totalRevenue: 32000,
        expenses: 10000,
        companyProfit: 12000,
        createdAt: new Date(),
      },
      {
        id: "js5",
        name: "Direct Call",
        totalJobs: 95,
        totalRevenue: 48000,
        expenses: 9000,
        companyProfit: 22000,
        createdAt: new Date(),
      },
    ] as JobSource[];
    
    setJobSources(sources);
  }, []);

  // Calculate total metrics
  const totalRevenue = jobSources.reduce((sum, source) => sum + (source.totalRevenue || 0), 0);
  const totalExpenses = jobSources.reduce((sum, source) => sum + (source.expenses || 0), 0);
  const totalProfit = jobSources.reduce((sum, source) => sum + (source.companyProfit || 0), 0);

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

      {/* Overall Finance Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Overall Finance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>Revenue from all sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Expenses</CardTitle>
              <CardDescription>Expenses across all categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Net Profit</CardTitle>
              <CardDescription>Revenue after expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalProfit)}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Job Source Finance Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Job Source Finance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Source</TableHead>
                      <TableHead>Total Jobs</TableHead>
                      <TableHead>Total Revenue</TableHead>
                      <TableHead>Expenses</TableHead>
                      <TableHead>Profit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobSources.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">{source.name}</TableCell>
                        <TableCell>{source.totalJobs}</TableCell>
                        <TableCell>{formatCurrency(source.totalRevenue || 0)}</TableCell>
                        <TableCell>{formatCurrency(source.expenses || 0)}</TableCell>
                        <TableCell>{formatCurrency(source.companyProfit || 0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Technician Finance Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Technician Finance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Technician</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Completed Jobs</TableHead>
                      <TableHead>Total Revenue</TableHead>
                      <TableHead>Payment Type</TableHead>
                      <TableHead>Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTechnicians.map((tech) => (
                      <TableRow key={tech.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-2 text-xs">
                              {tech.initials}
                            </div>
                            <span>{tech.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{tech.specialty}</TableCell>
                        <TableCell>{tech.completedJobs}</TableCell>
                        <TableCell>{formatCurrency(tech.totalRevenue)}</TableCell>
                        <TableCell>{tech.paymentType === "percentage" ? `${tech.paymentRate}%` : "Flat"}</TableCell>
                        <TableCell>
                          {formatCurrency(tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
          <TransactionHistory 
            transactions={filteredTransactions.slice(0, 5).map(t => ({
              id: t.id,
              date: t.date,
              amount: t.amount,
              client: t.clientName,
              job: t.jobTitle,
              status: t.status
            }))} 
            formatCurrency={formatCurrency} 
          />
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-4">Process Payment</h3>
          <Card>
            <CardContent className="p-6">
              <PaymentForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Finance;
