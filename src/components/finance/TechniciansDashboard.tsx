import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import TechnicianFinanceSection from "@/components/finance/TechnicianFinanceSection";
import { DonutChart } from "@/components/DonutChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TechnicianFiltersPanel from "@/components/finance/TechnicianFiltersPanel";
import { DateRange } from "react-day-picker";

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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [profitSearchQuery, setProfitSearchQuery] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [appliedFilters, setAppliedFilters] = useState(false);

  // Get all technician names
  const technicianNames = activeTechnicians.map(tech => tech.name);

  // Filter technicians based on search query and selected technicians
  const filteredTechnicians = activeTechnicians.filter(tech => {
    const matchesSearch = 
      searchQuery === "" || 
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSelectedTechnicians = 
      !appliedFilters || 
      selectedTechnicians.length === 0 || 
      selectedTechnicians.includes(tech.name);
    
    return matchesSearch && matchesSelectedTechnicians;
  });
  
  // Calculate total earnings for technicians
  const totalRevenue = filteredTechnicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);
  const technicianEarnings = filteredTechnicians.reduce((sum, tech) => 
    sum + tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1), 0
  );
  const totalExpenses = totalRevenue * 0.33; // Estimate expenses as 33% of revenue
  const companyProfit = totalRevenue - technicianEarnings - totalExpenses;
  const netProfit = totalRevenue - totalExpenses;
  
  // Calculate expense categories
  const expenseCategories = [
    { name: "Equipment", value: totalExpenses * 0.4, color: "#f87171" },
    { name: "Travel", value: totalExpenses * 0.3, color: "#22c55e" },
    { name: "Training", value: totalExpenses * 0.15, color: "#f97316" },
    { name: "Insurance", value: totalExpenses * 0.1, color: "#3b82f6" },
    { name: "Other", value: totalExpenses * 0.05, color: "#8b5cf6" },
  ];

  // Revenue breakdown data
  const revenueBreakdown = [
    { name: "Service Revenue", value: totalRevenue * 0.75, color: "#0ea5e9" }, // sky blue
    { name: "Parts & Materials", value: totalRevenue * 0.20, color: "#ec4899" }, // pink
    { name: "Diagnostic Fees", value: totalRevenue * 0.05, color: "#6366f1" },  // indigo
  ];

  // Net profit breakdown data
  const profitBreakdown = [
    { name: "Operating Costs", value: companyProfit * 0.3, color: "#3b82f6" }, // blue
    { name: "Reinvestment", value: companyProfit * 0.25, color: "#10b981" },   // green
    { name: "Owner Dividends", value: companyProfit * 0.30, color: "#f59e0b" }, // amber
    { name: "Taxes", value: companyProfit * 0.15, color: "#ef4444" },          // red
  ];
  
  // Sort technicians by revenue for top performers
  const topTechnicians = [...filteredTechnicians]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  // Further filter top technicians by profit search query
  const filteredTopTechnicians = topTechnicians.filter(tech => 
    profitSearchQuery === "" || 
    tech.name.toLowerCase().includes(profitSearchQuery.toLowerCase()) ||
    tech.specialty.toLowerCase().includes(profitSearchQuery.toLowerCase())
  );
  
  // Toggle technician selection
  const toggleTechnician = (techName: string) => {
    setSelectedTechnicians(prev => 
      prev.includes(techName) 
        ? prev.filter(t => t !== techName)
        : [...prev, techName]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTechnicians([]);
    setDate({
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
      to: new Date(),
    });
    setAppliedFilters(false);
  };

  // Apply filters
  const applyFilters = () => {
    setAppliedFilters(true);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search technicians..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-muted" : ""}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Technician Filters Panel */}
      <TechnicianFiltersPanel 
        showFilters={showFilters}
        technicianNames={technicianNames}
        selectedTechnicians={selectedTechnicians}
        toggleTechnician={toggleTechnician}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
        date={date}
        setDate={setDate}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Breakdown Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Source of revenue streams</CardDescription>
            <div className="mt-2">
              <Input
                placeholder="Search in revenue breakdown..."
                value={profitSearchQuery}
                onChange={(e) => setProfitSearchQuery(e.target.value)}
                className="text-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={revenueBreakdown}
              title={formatCurrency(totalRevenue)}
              subtitle="Total Revenue"
            />
          </CardContent>
        </Card>

        {/* Expense Breakdown Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Distribution of expenses by type</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={expenseCategories}
              title={formatCurrency(totalExpenses)}
              subtitle="Total Expenses"
            />
          </CardContent>
        </Card>

        {/* Net Profit Breakdown Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Net Profit Breakdown</CardTitle>
            <CardDescription>How profit is distributed</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={profitBreakdown}
              title={formatCurrency(companyProfit)}
              subtitle="Net Profit"
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Total Net Profit</p>
              <p className="text-xl font-bold">{formatCurrency(netProfit)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Technicians Table */}
      <Card>
        <CardHeader>
          <CardTitle>Technician Performance</CardTitle>
          <CardDescription>Financial metrics for technicians</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technician</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead className="text-right">Completed Jobs</TableHead>
                <TableHead className="text-right">Revenue Generated</TableHead>
                <TableHead className="text-right">Earnings</TableHead>
                <TableHead className="text-right">Profit Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTechnicians.map((tech) => {
                const earnings = tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1);
                const profitMargin = ((tech.totalRevenue - earnings) / tech.totalRevenue * 100).toFixed(1);
                
                return (
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
                    <TableCell className="text-right">{formatCurrency(earnings)}</TableCell>
                    <TableCell className="text-right">{profitMargin}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <TechnicianFinanceSection 
        activeTechnicians={filteredTechnicians} 
      />
    </div>
  );
};

export default TechniciansDashboard;
