
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, BriefcaseIcon, UsersIcon, DollarSign } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateRange } from "react-day-picker";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TechnicianPaymentsSectionProps {
  technicians: Technician[];
}

const TechnicianPaymentsSection: React.FC<TechnicianPaymentsSectionProps> = ({ technicians }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentType, setPaymentType] = useState<string>("all");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(),
  });

  // Filter technicians based on search, payment type and potentially date
  const filteredTechnicians = technicians.filter(tech => {
    const matchesSearch = 
      searchQuery === "" || 
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPaymentType = 
      paymentType === "all" || 
      tech.paymentType === paymentType;
    
    return matchesSearch && matchesPaymentType;
  });

  // Sort technicians by earnings (highest first)
  const sortedTechnicians = [...filteredTechnicians].sort((a, b) => {
    const aEarnings = a.totalRevenue * (a.paymentType === "percentage" ? a.paymentRate / 100 : 1);
    const bEarnings = b.totalRevenue * (b.paymentType === "percentage" ? b.paymentRate / 100 : 1);
    return bEarnings - aEarnings;
  });

  // Calculate total payments and metrics
  const totalPayments = sortedTechnicians.reduce((sum, tech) => {
    return sum + tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1);
  }, 0);
  
  const totalRevenue = sortedTechnicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);
  
  // Estimate expenses as 33% of revenue
  const totalExpenses = totalRevenue * 0.33;
  
  // Calculate net profit
  const netProfit = totalRevenue - totalPayments - totalExpenses;

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Technician Payments</CardTitle>
            <CardDescription>Manage and track technician payment details</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Payment Summary Cards - TOP SECTION (styled like JobStats) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <BriefcaseIcon className="h-5 w-5 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalExpenses + totalPayments)}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <UsersIcon className="h-5 w-5 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                  <p className="text-2xl font-bold">{formatCurrency(netProfit)}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <DollarSign className="h-5 w-5 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium mb-2">Filter by Definition</h3>
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="Search technicians..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select 
                value={paymentType} 
                onValueChange={setPaymentType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="flat">Flat Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium mb-2">Filter by Date Range</h3>
            <DateRangeSelector date={date} setDate={setDate} />
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Payments Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Technician</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Payment Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTechnicians.length > 0 ? (
              sortedTechnicians.map((tech) => {
                const paymentAmount = tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1);
                
                return (
                  <TableRow key={tech.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-2 text-xs">
                          {tech.initials}
                        </div>
                        <div>
                          <div>{tech.name}</div>
                          <div className="text-xs text-muted-foreground">{tech.specialty}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{tech.paymentType}</TableCell>
                    <TableCell>
                      {tech.paymentType === "percentage" 
                        ? `${tech.paymentRate}%` 
                        : formatCurrency(tech.paymentRate)}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(tech.totalRevenue)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(paymentAmount)}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">Details</Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TechnicianPaymentsSection;
