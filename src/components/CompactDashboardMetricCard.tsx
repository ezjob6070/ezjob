
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
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
  isNegative?: boolean;
};

const CompactDashboardMetricCard = ({
  title,
  value,
  icon,
  trend,
  className,
  valueClassName,
  description,
  dateRangeText,
  isNegative
}: CompactDashboardMetricCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden shadow-sm bg-white border border-gray-100", 
      className
    )}>
      <CardContent className="px-3 py-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          {icon && (
            <div className="h-6 w-6 flex items-center justify-center bg-gray-50 rounded p-1">
              {icon}
            </div>
          )}
        </div>
        
        <div className={cn(
          "text-xl font-bold", 
          isNegative ? "text-destructive flex items-center" : "",
          valueClassName
        )}>
          {isNegative && <Minus className="h-4 w-4 mr-1" />}
          {value}
        </div>
        
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">
            {description}
          </p>
        )}
        
        {dateRangeText && (
          <p className="text-[0.65rem] text-gray-400 mt-0.5">
            {dateRangeText}
          </p>
        )}
        
        {trend && (
          <div className="flex items-center mt-1.5">
            <div className={cn(
              "flex items-center px-1.5 py-0.5 rounded text-xs",
              trend.isPositive 
                ? "bg-green-50 text-green-600" 
                : "bg-red-50 text-red-600"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              <span className="text-xs">
                {trend.value}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactDashboardMetricCard;
