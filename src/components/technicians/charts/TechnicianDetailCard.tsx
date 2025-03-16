
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import { 
  CheckCircle, XCircle, DollarSign, 
  Tool, ArrowUp, ArrowDown, Star 
} from "lucide-react";

interface TechnicianDetailCardProps {
  technician: Technician;
  metrics: {
    completedJobs: number;
    cancelledJobs: number;
    totalRevenue: number;
    rating: number;
    revenue?: number;
    earnings?: number;
    expenses?: number;
    profit?: number;
    partsValue?: number;
  };
  dateRangeText: string;
}

const TechnicianDetailCard: React.FC<TechnicianDetailCardProps> = ({
  technician,
  metrics,
  dateRangeText
}) => {
  const completionRate = technician.completedJobs + technician.cancelledJobs > 0
    ? (technician.completedJobs / (technician.completedJobs + technician.cancelledJobs) * 100).toFixed(1)
    : "0";

  const statusColorMap = {
    active: "bg-green-500",
    inactive: "bg-gray-500",
    onLeave: "bg-amber-500"
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Technician Details</span>
          {dateRangeText && (
            <span className="text-sm font-normal text-muted-foreground">{dateRangeText}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row">
          <div className="flex items-start space-x-4 mb-4 md:mb-0 md:w-1/3">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src={technician.imageUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {technician.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{technician.name}</h3>
              <p className="text-sm text-muted-foreground">{technician.specialty}</p>
              <div className="flex items-center mt-1 space-x-2">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <div className={`h-2 w-2 rounded-full ${statusColorMap[technician.status]}`}></div>
                  <span className="capitalize">{technician.status}</span>
                </Badge>
                <div className="flex items-center">
                  <Star className="w-3.5 h-3.5 text-yellow-400 mr-1 fill-yellow-400" />
                  <span className="text-sm">{metrics.rating}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:w-2/3">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Completed Jobs</div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1.5 text-green-500" />
                <span className="text-lg font-semibold">{metrics.completedJobs}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Cancelled Jobs</div>
              <div className="flex items-center">
                <XCircle className="h-4 w-4 mr-1.5 text-red-500" />
                <span className="text-lg font-semibold">{metrics.cancelledJobs}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Completion Rate</div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-1.5 text-blue-500" />
                <span className="text-lg font-semibold">{completionRate}%</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Total Revenue</div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1.5 text-green-500" />
                <span className="text-lg font-semibold">{formatCurrency(metrics.totalRevenue)}</span>
              </div>
            </div>
            
            {metrics.earnings !== undefined && (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Technician Earnings</div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1.5 text-indigo-500" />
                  <span className="text-lg font-semibold">{formatCurrency(metrics.earnings)}</span>
                </div>
              </div>
            )}
            
            {metrics.partsValue !== undefined && (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Parts & Materials</div>
                <div className="flex items-center">
                  <Tool className="h-4 w-4 mr-1.5 text-amber-500" />
                  <span className="text-lg font-semibold">{formatCurrency(metrics.partsValue)}</span>
                </div>
              </div>
            )}
            
            {metrics.profit !== undefined && (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Net Profit</div>
                <div className="flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1.5 text-emerald-500" />
                  <span className="text-lg font-semibold">{formatCurrency(metrics.profit)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianDetailCard;
