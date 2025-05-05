
import React from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TopTechniciansCardProps {
  topTechnicians: Array<{
    id: string;
    name: string;
    avatar?: string;
    initials: string;
    completedJobs: number;
    revenue: number;
    rating: number;
    status: "available" | "busy" | "offline";
  }>;
  formatCurrency: (value: number) => string;
  detailedClientsData?: any[];
  dateRange?: DateRange | undefined;
}

const TopTechniciansCard = ({ 
  topTechnicians, 
  formatCurrency,
  detailedClientsData,
  dateRange
}: TopTechniciansCardProps) => {
  const formatDateRange = () => {
    if (!dateRange?.from) return "All Time";
    
    if (dateRange.to) {
      if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
        return format(dateRange.from, "MMM d, yyyy");
      }
      return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    
    return format(dateRange.from, "MMM d, yyyy");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-amber-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          Top Technicians
          {dateRange?.from && (
            <span className="text-xs font-normal text-muted-foreground">
              {formatDateRange()}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topTechnicians.map((technician) => (
            <div key={technician.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    {technician.avatar && (
                      <AvatarImage src={technician.avatar} alt={technician.name} />
                    )}
                    <AvatarFallback>{technician.initials}</AvatarFallback>
                  </Avatar>
                  <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(technician.status)}`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium">{technician.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {technician.completedJobs} jobs
                    </span>
                    <span className="text-xs">•</span>
                    <span className="text-xs text-yellow-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      {technician.rating}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="font-normal text-xs">
                {formatCurrency(technician.revenue)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopTechniciansCard;
