
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";

interface TechnicianMetrics {
  revenue: number;
  earnings: number;
  expenses: number;
  profit: number;
  partsValue: number;
}

interface TechnicianDetailCardProps {
  technician: Technician;
  metrics: TechnicianMetrics;
  dateRangeText?: string;
}

const TechnicianDetailCard: React.FC<TechnicianDetailCardProps> = ({
  technician,
  metrics,
  dateRangeText
}) => {
  return (
    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-3">
          {technician.initials}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{technician.name}</h3>
          <p className="text-sm text-slate-500">
            {technician.specialty} • {technician.paymentType === "percentage" 
              ? `${technician.paymentRate}% commission` 
              : `Flat rate: ${formatCurrency(technician.paymentRate)}`}
          </p>
        </div>
        <div className="ml-auto text-sm text-slate-500">
          {dateRangeText || "All time"}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-500 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-sky-600">{formatCurrency(metrics.revenue)}</div>
            <div className="text-xs text-slate-400 mt-1">From {technician.completedJobs} completed jobs</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-500 mb-1">Total Expenses</div>
            <div className="text-2xl font-bold text-red-600">
              -{formatCurrency(metrics.earnings + metrics.expenses - metrics.partsValue)}
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Technician: -{formatCurrency(metrics.earnings)}</span>
              <span>Parts: -{formatCurrency(metrics.partsValue)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-500 mb-1">Company Profit</div>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(metrics.profit)}</div>
            <div className="text-xs text-slate-400 mt-1">
              Profit margin: {((metrics.profit / metrics.revenue) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianDetailCard;
