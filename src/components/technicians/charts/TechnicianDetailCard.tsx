
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon, PackageIcon, BanIcon, DollarSign } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";

export interface TechnicianDetailCardProps {
  technician: Technician;
  metrics: {
    completedJobs: number;
    cancelledJobs: number;
    totalRevenue: number;
    rating: number;
  };
}

const TechnicianDetailCard: React.FC<TechnicianDetailCardProps> = ({ technician, metrics }) => {
  // Calculate completion rate
  const totalJobs = metrics.completedJobs + metrics.cancelledJobs;
  const completionRate = totalJobs > 0 
    ? ((metrics.completedJobs / totalJobs) * 100).toFixed(1) 
    : "0.0";
    
  // Calculate average revenue per job
  const avgRevenue = metrics.completedJobs > 0 
    ? metrics.totalRevenue / metrics.completedJobs 
    : 0;
    
  // Calculate technician earnings
  const technicianEarnings = technician.paymentType === "percentage"
    ? metrics.totalRevenue * (technician.paymentRate / 100)
    : technician.paymentType === "hourly"
    ? technician.paymentRate * (metrics.completedJobs * 3) // Assuming average 3 hours per job
    : technician.paymentRate * metrics.completedJobs; // Flat rate per job
    
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Overall technician performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <PackageIcon className="mr-2 h-4 w-4" />
              <span>Completed Jobs</span>
            </div>
            <p className="text-2xl font-semibold">{metrics.completedJobs} <span className="text-sm font-normal text-muted-foreground">({completionRate}%)</span></p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <BanIcon className="mr-2 h-4 w-4" />
              <span>Cancelled Jobs</span>
            </div>
            <p className="text-2xl font-semibold">{metrics.cancelledJobs}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Total Revenue</span>
            </div>
            <p className="text-2xl font-semibold">{formatCurrency(metrics.totalRevenue)}</p>
            <p className="text-sm text-muted-foreground">Avg: {formatCurrency(avgRevenue)}/job</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <StarIcon className="mr-2 h-4 w-4" />
              <span>Customer Rating</span>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold">{metrics.rating.toFixed(1)}</p>
              <div className="ml-2 flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(metrics.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : i < metrics.rating
                        ? "fill-yellow-400 text-yellow-400 opacity-50"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Technician Earnings:</span>
            <span className="font-medium">{formatCurrency(technicianEarnings)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-muted-foreground">Payment Structure:</span>
            <span className="font-medium">
              {technician.paymentType === "percentage"
                ? `${technician.paymentRate}% of job revenue`
                : technician.paymentType === "hourly"
                ? `$${technician.paymentRate}/hour`
                : `$${technician.paymentRate} per job`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianDetailCard;
