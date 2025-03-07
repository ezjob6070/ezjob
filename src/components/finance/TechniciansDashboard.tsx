import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import TechnicianFinanceSection from "@/components/finance/TechnicianFinanceSection";
import TechnicianCircleCharts from "@/components/technicians/TechnicianCircleCharts";
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

  const technicianNames = activeTechnicians.map(tech => tech.name);

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

  const totalRevenue = filteredTechnicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);
  const technicianEarnings = filteredTechnicians.reduce((sum, tech) => 
    sum + tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1), 0
  );
  const totalExpenses = totalRevenue * 0.33;
  const companyProfit = totalRevenue - technicianEarnings - totalExpenses;
  const netProfit = totalRevenue - totalExpenses;

  const expenseCategories = [
    { name: "Equipment", value: totalExpenses * 0.4, color: "#f87171" },
    { name: "Travel", value: totalExpenses * 0.3, color: "#22c55e" },
    { name: "Training", value: totalExpenses * 0.15, color: "#f97316" },
    { name: "Insurance", value: totalExpenses * 0.1, color: "#3b82f6" },
    { name: "Other", value: totalExpenses * 0.05, color: "#8b5cf6" },
  ];

  const revenueBreakdown = [
    { name: "Service Revenue", value: totalRevenue * 0.75, color: "#0ea5e9" },
    { name: "Parts & Materials", value: totalRevenue * 0.20, color: "#ec4899" },
    { name: "Diagnostic Fees", value: totalRevenue * 0.05, color: "#6366f1" },
  ];

  const profitBreakdown = [
    { name: "Operating Costs", value: companyProfit * 0.3, color: "#3b82f6" },
    { name: "Reinvestment", value: companyProfit * 0.25, color: "#10b981" },
    { name: "Owner Dividends", value: companyProfit * 0.30, color: "#f59e0b" },
    { name: "Taxes", value: companyProfit * 0.15, color: "#ef4444" },
  ];

  const topTechnicians = [...filteredTechnicians]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  const filteredTopTechnicians = topTechnicians.filter(tech => 
    profitSearchQuery === "" || 
    tech.name.toLowerCase().includes(profitSearchQuery.toLowerCase()) ||
    tech.specialty.toLowerCase().includes(profitSearchQuery.toLowerCase())
  );

  const toggleTechnician = (techName: string) => {
    setSelectedTechnicians(prev => 
      prev.includes(techName) 
        ? prev.filter(t => t !== techName)
        : [...prev, techName]
    );
  };

  const clearFilters = () => {
    setSelectedTechnicians([]);
    setDate({
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
      to: new Date(),
    });
    setAppliedFilters(false);
  };

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
      
      <TechnicianCircleCharts filteredTechnicians={filteredTechnicians} />
      
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
