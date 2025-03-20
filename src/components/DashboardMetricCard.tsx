
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
  variant?: 'default' | 'glass' | 'outline' | 'gradient' | 'finance' | 'vibrant' | 'accent';
  accentColor?: string;
  dateRangeText?: string;
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
  variant = 'default',
  accentColor,
  dateRangeText
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
        return 'hover:shadow-md transition-all duration-300';
      case 'vibrant':
        return 'text-white hover:shadow-md transition-all duration-300 border-none';
      case 'accent':
        return `border-l-4 ${accentColor || 'border-l-blue-500'} hover:shadow-md transition-all duration-300`;
      default:
        return 'bg-white hover:shadow-md border border-gray-100';
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden shadow-sm", 
      getCardClass(),
      className
    )}>
      <CardHeader className={cn(
        "flex flex-row items-center justify-between space-y-0 pb-2 pt-4",
        variant === 'vibrant' && "border-b border-white/10"
      )}>
        <CardTitle className={cn(
          "text-sm font-medium",
          variant === 'vibrant' ? "text-white/90" : "text-gray-700"
        )}>
          {title}
        </CardTitle>
        {icon && (
          <div className={cn(
            "p-2 rounded-lg", 
            variant === 'vibrant' ? "bg-white/20" : "bg-white shadow-sm"
          )}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="py-3">
        {children}
        
        <div className={cn(
          "text-2xl font-bold mb-1", 
          variant === 'vibrant' ? "text-white" : "", 
          valueClassName
        )}>
          {value}
        </div>
        
        {description && (
          <p className={cn(
            "text-xs", 
            variant === 'vibrant' ? "text-white/80" : "text-muted-foreground"
          )}>
            {description}
          </p>
        )}
        
        {dateRangeText && (
          <p className={cn(
            "text-[0.65rem] mt-1", 
            variant === 'vibrant' ? "text-white/60" : "text-muted-foreground"
          )}>
            {dateRangeText}
          </p>
        )}
        
        {trend && (
          <div className="flex items-center mt-3">
            <div className={cn(
              "flex items-center p-1.5 rounded-md bg-opacity-10 w-fit",
              trend.isPositive 
                ? variant === 'vibrant' ? "bg-green-400/30 text-green-100" : "bg-green-100 text-green-600" 
                : variant === 'vibrant' ? "bg-red-400/30 text-red-100" : "bg-red-100 text-red-600"
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
            variant={variant === 'vibrant' ? "ghost" : "ghost"}
            size="sm" 
            className={cn(
              "mt-3 p-0 h-auto hover:bg-transparent group",
              variant === 'vibrant' ? "text-white/90 hover:text-white" : "text-blue-600 hover:text-blue-700"
            )}
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
