
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface TechnicianCircleChartsProps {
  filteredTechnicians: Technician[];
}

const TechnicianCircleCharts: React.FC<TechnicianCircleChartsProps> = ({ 
  filteredTechnicians 
}) => {
  const [techSearchQuery, setTechSearchQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  
  // Calculate total revenue from technicians
  const totalRevenue = filteredTechnicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);
  
  // Calculate total technician payments
  const technicianEarnings = filteredTechnicians.reduce((sum, tech) => 
    sum + tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1), 0
  );
  
  // Estimate expenses as 33% of revenue
  const totalExpenses = totalRevenue * 0.33;
  
  // Calculate net profit
  const companyProfit = totalRevenue - technicianEarnings - totalExpenses;
  
  // Get unique specialties for filtering
  const specialties = [...new Set(filteredTechnicians.map(tech => tech.specialty))];
  
  // Filter technicians based on search query and specialties
  const searchFilteredTechnicians = filteredTechnicians.filter(tech => {
    const matchesSearch = 
      techSearchQuery === "" || 
      tech.name.toLowerCase().includes(techSearchQuery.toLowerCase()) ||
      tech.specialty.toLowerCase().includes(techSearchQuery.toLowerCase());
    
    const matchesSpecialty = 
      selectedSpecialties.length === 0 || 
      selectedSpecialties.includes(tech.specialty);
    
    return matchesSearch && matchesSpecialty;
  });
  
  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };
  
  const clearSpecialtyFilters = () => {
    setSelectedSpecialties([]);
  };
  
  return (
    <div className="space-y-6">
      {/* Search Bar with Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search technicians..."
            value={techSearchQuery}
            onChange={(e) => setTechSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={clearSpecialtyFilters}>
              Clear filters
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {specialties.map(specialty => (
              <DropdownMenuCheckboxItem
                key={specialty}
                checked={selectedSpecialties.includes(specialty)}
                onCheckedChange={() => toggleSpecialty(specialty)}
              >
                {specialty}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Payment Breakdown Simple Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Income</CardTitle>
            <CardDescription>Revenue from all technicians</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>Technician payments and costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(technicianEarnings + totalExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Company Profit</CardTitle>
            <CardDescription>Revenue after all expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(companyProfit)}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Technicians List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Technician Financial Performance</CardTitle>
          <CardDescription>Earnings and profit metrics for each technician</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technician</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Technician Earnings</TableHead>
                <TableHead>Company Earnings</TableHead>
                <TableHead>Profit Ratio</TableHead>
                <TableHead>Parts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchFilteredTechnicians.map((tech) => {
                const techEarnings = tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1);
                const companyEarnings = tech.totalRevenue - techEarnings - (tech.totalRevenue * 0.33);
                const profitRatio = ((companyEarnings / tech.totalRevenue) * 100).toFixed(1);
                const partsValue = tech.totalRevenue * 0.2; // Assuming parts are 20% of total revenue
                
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
                    <TableCell>{formatCurrency(tech.totalRevenue)}</TableCell>
                    <TableCell>{formatCurrency(techEarnings)}</TableCell>
                    <TableCell>{formatCurrency(companyEarnings)}</TableCell>
                    <TableCell>{profitRatio}%</TableCell>
                    <TableCell>{formatCurrency(partsValue)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianCircleCharts;
