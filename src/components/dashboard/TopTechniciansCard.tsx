
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Award, TrendingUp } from "lucide-react";

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
  const getAvatarColorClass = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-amber-500 to-amber-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <Award className="h-5 w-5 mr-2 text-blue-500" />
          Top Technicians
        </CardTitle>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          This Month
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topTechnicians.map((technician, index) => (
            <Card key={technician.name} className="border shadow-sm bg-white hover:shadow-md transition-all cursor-pointer"
                  onClick={() => openDetailDialog('clients', `${technician.name}'s Performance`, detailedClientsData.filter(c => c.name.includes(technician.name.split(' ')[0])))}>
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 ${getAvatarColorClass(index)}`}>
                    {technician.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium">{technician.name}</div>
                    <div className="flex items-center text-sm text-amber-500">
                      <Star className="h-3 w-3 mr-1 fill-amber-500" />
                      {technician.rating}/5
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                  <div className="flex flex-col p-2 bg-gray-50 rounded-md">
                    <span className="text-xs text-muted-foreground">Jobs</span>
                    <span className="font-bold">{technician.jobs}</span>
                  </div>
                  <div className="flex flex-col p-2 bg-blue-50 rounded-md">
                    <span className="text-xs text-muted-foreground">Revenue</span>
                    <span className="font-bold text-blue-700">{formatCurrency(technician.revenue)}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>12% increase from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
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
