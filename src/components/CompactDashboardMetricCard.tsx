
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type CompactDashboardMetricCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
  description?: string;
  dateRangeText?: string;
};

const CompactDashboardMetricCard = ({
  title,
  value,
  icon,
  trend,
  className,
  valueClassName,
  description,
  dateRangeText
}: CompactDashboardMetricCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden shadow-sm bg-white", 
      className
    )}>
      <CardContent className="p-3 pt-3">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
            {icon && (
              <div className="p-1.5 rounded-full flex items-center justify-center bg-gray-50">
                {icon}
              </div>
            )}
            {title}
          </h3>
        </div>
        
        <div className={cn(
          "text-xl font-bold", 
          valueClassName
        )}>
          {value}
        </div>
        
        {description && (
          <p className="text-xs text-gray-500 mt-1">
            {description}
          </p>
        )}
        
        <div className="mt-2 flex items-center justify-between">
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
              trend.isPositive 
                ? "bg-green-50 text-green-600" 
                : "bg-red-50 text-red-600"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {trend.value}
            </div>
          )}
          
          {dateRangeText && (
            <p className="text-[0.65rem] text-gray-400">
              {dateRangeText}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactDashboardMetricCard;
