
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import TechnicianFinanceSection from "@/components/finance/TechnicianFinanceSection";

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
