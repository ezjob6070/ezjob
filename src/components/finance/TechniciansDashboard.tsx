
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import TechnicianCircleCharts from "@/components/technicians/TechnicianCircleCharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TechnicianFiltersPanel from "@/components/finance/TechnicianFiltersPanel";
import { DateRange } from "react-day-picker";
import TechnicianInvoiceSection from "@/components/finance/TechnicianInvoiceSection";
import CompactDateRangeSelector from "@/components/finance/CompactDateRangeSelector";
import CategoryFilter from "@/components/finance/technician-filters/CategoryFilter";

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
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([
    "Garage Door", "HVAC", "Electrical", "Plumbing", "Construction", "Others"
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

    const matchesCategory = 
      selectedCategories.length === 0 || 
      (tech.category && selectedCategories.includes(tech.category)) ||
      (!tech.category && selectedCategories.includes("Others"));
    
    return matchesSearch && matchesSelectedTechnicians && matchesCategory;
  });

  const totalRevenue = filteredTechnicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);
  const technicianEarnings = filteredTechnicians.reduce((sum, tech) => 
    sum + tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1), 0
  );
  const totalExpenses = totalRevenue * 0.33;
  const companyProfit = totalRevenue - technicianEarnings - totalExpenses;
  const netProfit = totalRevenue - totalExpenses;

  const expenseCategories = [
    { name: "Equipment", value: totalExpenses * 0.4, color: "#ef4444" },
    { name: "Travel", value: totalExpenses * 0.3, color: "#10b981" },
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

  const filteredTopTechnicians = topTechnicians;

  const toggleTechnician = (techName: string) => {
    setSelectedTechnicians(prev => 
      prev.includes(techName) 
        ? prev.filter(t => t !== techName)
        : [...prev, techName]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addCategory = (category: string) => {
    setCategories(prev => [...prev, category]);
  };

  const selectAllTechnicians = () => {
    setSelectedTechnicians([...technicianNames]);
  };

  const deselectAllTechnicians = () => {
    setSelectedTechnicians([]);
  };

  const clearFilters = () => {
    setSelectedTechnicians([]);
    setSelectedCategories([]);
    setDate(undefined);
    setAppliedFilters(false);
  };

  const applyFilters = () => {
    setAppliedFilters(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryFilter 
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            categories={categories}
            addCategory={addCategory}
          />
          
          <TechnicianFiltersPanel 
            showFilters={true}
            technicianNames={technicianNames}
            selectedTechnicians={selectedTechnicians}
            toggleTechnician={toggleTechnician}
            clearFilters={clearFilters}
            applyFilters={applyFilters}
            date={date}
            setDate={setDate}
            selectAllTechnicians={selectAllTechnicians}
            deselectAllTechnicians={deselectAllTechnicians}
            compact={true}
          />
          
          <CompactDateRangeSelector date={date} setDate={setDate} />
        </div>
        
        {(selectedTechnicians.length > 0 || selectedCategories.length > 0) && (
          <div className="text-sm text-muted-foreground">
            Showing {filteredTechnicians.length} of {activeTechnicians.length} technicians
          </div>
        )}
      </div>
      
      <TechnicianCircleCharts 
        filteredTechnicians={filteredTechnicians} 
        dateRange={date}
      />
      
      <TechnicianInvoiceSection 
        activeTechnicians={filteredTechnicians} 
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Technician Performance</CardTitle>
            <CardDescription>Financial metrics for technicians</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedCategories.length > 0 && (
              <div className="text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {selectedCategories.length === 1 
                  ? `Category: ${selectedCategories[0]}` 
                  : `${selectedCategories.length} categories`}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technician</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Completed Jobs</TableHead>
                <TableHead className="text-right">Revenue Generated</TableHead>
                <TableHead className="text-right">Parts</TableHead>
                <TableHead className="text-right">Earnings</TableHead>
                <TableHead className="text-right">Profit Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTechnicians.map((tech) => {
                const earnings = tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1);
                const profitMargin = ((tech.totalRevenue - earnings) / tech.totalRevenue * 100).toFixed(1);
                const partsValue = tech.totalRevenue * 0.2;
                
                return (
                  <TableRow key={tech.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 mr-2 text-xs">
                          {tech.initials}
                        </div>
                        <span>{tech.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tech.specialty}</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {tech.category || "Others"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{tech.completedJobs}</TableCell>
                    <TableCell className="text-right text-sky-600">{formatCurrency(tech.totalRevenue)}</TableCell>
                    <TableCell className="text-right text-red-600">-{formatCurrency(partsValue)}</TableCell>
                    <TableCell className="text-right text-emerald-600">{formatCurrency(earnings)}</TableCell>
                    <TableCell className="text-right">{profitMargin}%</TableCell>
                  </TableRow>
                );
              })}
              
              {filteredTechnicians.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No technicians match the selected filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechniciansDashboard;
