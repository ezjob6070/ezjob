
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TopTechniciansCardProps = {
  topTechnicians: {
    name: string;
    jobs: number;
    revenue: number;
    rating: number;
  }[];
  formatCurrency: (amount: number) => string;
  openDetailDialog: (type: 'tasks' | 'leads' | 'clients' | 'revenue' | 'metrics', title: string, data: any[]) => void;
  detailedClientsData: any[];
};

const TopTechniciansCard = ({ 
  topTechnicians, 
  formatCurrency, 
  openDetailDialog,
  detailedClientsData
}: TopTechniciansCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Top Technicians</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topTechnicians.map((technician, index) => (
            <Card key={technician.name} className="border-none shadow-sm bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => openDetailDialog('clients', `${technician.name}'s Performance`, detailedClientsData.filter(c => c.name.includes(technician.name.split(' ')[0])))}>
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 rounded-full bg-blue-${index === 0 ? '600' : '500'} flex items-center justify-center text-white mr-3`}>
                    {technician.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium">{technician.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Rating: {technician.rating}/5
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Jobs</span>
                    <span className="font-bold">{technician.jobs}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-bold">{formatCurrency(technician.revenue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            className="text-blue-500"
            onClick={() => openDetailDialog('clients', 'All Technicians', detailedClientsData)}
          >
            View All Technicians
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopTechniciansCard;
