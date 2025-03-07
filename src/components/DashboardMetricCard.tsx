
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardMetricCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
};

const DashboardMetricCard = ({
  title,
  value,
  description,
  icon,
  trend,
  onClick,
  className,
  children
}: DashboardMetricCardProps) => {
  return (
    <Card className={cn("overflow-hidden hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        
        {trend && (
          <div className="flex items-center mt-1">
            <span className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </span>
          </div>
        )}
        
        {children}
        
        {onClick && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 p-0 h-auto text-blue-500 hover:text-blue-600 hover:bg-transparent"
            onClick={onClick}
          >
            <span className="text-xs">View Details</span>
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardMetricCard;
