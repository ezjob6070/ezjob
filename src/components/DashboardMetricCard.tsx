
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
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
  valueClassName?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'glass' | 'outline' | 'gradient' | 'finance';
};

const DashboardMetricCard = ({
  title,
  value,
  description,
  icon,
  trend,
  onClick,
  className,
  valueClassName,
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
        return 'bg-gradient-to-br from-white to-blue-50/50 hover:shadow-md transition-all duration-300';
      case 'finance':
        return 'bg-white border-none hover:shadow-md transition-all duration-300';
      default:
        return 'bg-white hover:shadow-md';
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden shadow-sm border border-gray-100", 
      getCardClass(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary shadow-sm">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="py-3">
        {children}
        
        <div className={cn("text-2xl font-bold mb-1", valueClassName)}>{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        
        {trend && (
          <div className="flex items-center mt-3">
            <div className={cn(
              "flex items-center p-1.5 rounded-md bg-opacity-10 w-fit",
              trend.isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="mr-1.5 h-3.5 w-3.5" />
              )}
              <span className="text-xs font-medium">
                {trend.value}
              </span>
            </div>
          </div>
        )}
        
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
