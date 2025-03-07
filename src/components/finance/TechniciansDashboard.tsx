
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import TechnicianFinanceSection from "@/components/finance/TechnicianFinanceSection";
import { DonutChart } from "@/components/DonutChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TechniciansDashboardProps {
  activeTechnicians: Technician[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TechniciansDashboard: React.FC<TechniciansDashboardProps> = ({
  activeTechnicians,
  searchQuery,
  setSearchQuery
}) => {
  const filteredTechnicians = activeTechnicians.filter(tech => 
    searchQuery === "" || 
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate total earnings for technicians
  const totalRevenue = filteredTechnicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);
  const technicianEarnings = filteredTechnicians.reduce((sum, tech) => 
    sum + tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1), 0
  );
  const companyProfit = totalRevenue - technicianEarnings;
  
  // Calculate expense categories
  const expenseCategories = [
    { name: "Technician Payments", value: technicianEarnings, color: "#8b5cf6" },
    { name: "Equipment", value: totalRevenue * 0.15, color: "#ec4899" },
    { name: "Travel", value: totalRevenue * 0.1, color: "#f97316" },
    { name: "Training", value: totalRevenue * 0.05, color: "#22c55e" },
    { name: "Other", value: totalRevenue * 0.03, color: "#3b82f6" },
  ];
  
  // Sort technicians by revenue for top performers
  const topTechnicians = [...filteredTechnicians]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Technician Performance</CardTitle>
          <CardDescription>Financial metrics for technicians</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              className="mb-4"
              placeholder="Search technicians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <TechnicianFinanceSection 
              activeTechnicians={filteredTechnicians} 
            />
          </div>
          
          <Separator className="my-6" />
          
          {/* Profit and Expense Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-medium mb-4">Profit Breakdown</h3>
              <DonutChart
                data={[
                  { name: "Company Profit", value: companyProfit, color: "#22c55e" },
                  { name: "Technician Earnings", value: technicianEarnings, color: "#8b5cf6" },
                ]}
                title={formatCurrency(totalRevenue)}
                subtitle="Total Revenue"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Expense Breakdown</h3>
              <DonutChart
                data={expenseCategories}
                title={formatCurrency(expenseCategories.reduce((sum, cat) => sum + cat.value, 0))}
                subtitle="Total Expenses"
              />
            </div>
          </div>
          
          {/* Top Technicians Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Top Performing Technicians</h3>
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Technician</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead className="text-right">Completed Jobs</TableHead>
                      <TableHead className="text-right">Revenue Generated</TableHead>
                      <TableHead className="text-right">Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topTechnicians.map((tech) => (
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
                        <TableCell className="text-right">{tech.completedJobs}</TableCell>
                        <TableCell className="text-right">{formatCurrency(tech.totalRevenue)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Technician Expense Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeTechnicians.slice(0, 3).map(tech => (
                <Card key={tech.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{tech.name}</CardTitle>
                    <CardDescription>{tech.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Revenue:</span>
                      <span className="font-medium">{formatCurrency(tech.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Expenses:</span>
                      <span className="font-medium">{formatCurrency(tech.totalRevenue * 0.35)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Profit:</span>
                      <span className="font-medium">{formatCurrency(tech.totalRevenue * 0.65)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="w-full">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechniciansDashboard;
