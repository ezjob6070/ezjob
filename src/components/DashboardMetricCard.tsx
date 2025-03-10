
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
  variant?: 'default' | 'glass' | 'outline' | 'gradient';
};

const DashboardMetricCard = ({
  title,
  value,
  description,
  icon,
  trend,
  onClick,
  className,
  children,
  variant = 'default'
}: DashboardMetricCardProps) => {
  const getCardClass = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/70 backdrop-blur-md border-white/20 hover:bg-white/80';
      case 'outline':
        return 'bg-transparent border-2 hover:border-primary/50';
      case 'gradient':
        return 'bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100';
      default:
        return 'bg-white hover:shadow-md';
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300", 
      getCardClass(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        
        {trend && (
          <div className="flex items-center mt-2 p-1.5 rounded-md bg-gray-50 w-fit">
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
            className="mt-3 p-0 h-auto text-blue-600 hover:text-blue-700 hover:bg-transparent group"
            onClick={onClick}
          >
            <span className="text-xs">View Details</span>
            <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardMetricCard;
