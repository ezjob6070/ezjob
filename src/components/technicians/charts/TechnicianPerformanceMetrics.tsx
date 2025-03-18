
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { BriefcaseIcon, BarChartIcon, DollarSignIcon, StarIcon } from "lucide-react";

interface TechnicianPerformanceMetricsProps {
  technician: any;
  metrics: any;
}

const TechnicianPerformanceMetrics: React.FC<TechnicianPerformanceMetricsProps> = ({
  technician,
  metrics
}) => {
  if (!technician || !metrics) return null;

  const cards = [
    {
      title: "Completed Jobs",
      value: technician.completedJobs || 0,
      icon: <BriefcaseIcon className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-50 text-blue-700",
      iconColor: "bg-blue-100"
    },
    {
      title: "Rating",
      value: (technician.rating || 0).toFixed(1),
      suffix: "★",
      icon: <StarIcon className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-50 text-amber-700",
      iconColor: "bg-amber-100"
    },
    {
      title: "Average Job Value",
      value: formatCurrency(metrics.revenue ? metrics.revenue / (technician.completedJobs || 1) : 0),
      icon: <BarChartIcon className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-50 text-purple-700",
      iconColor: "bg-purple-100"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(metrics.revenue || 0),
      icon: <DollarSignIcon className="h-5 w-5 text-green-500" />,
      color: "bg-green-50 text-green-700",
      iconColor: "bg-green-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className={`border-l-4 border-l-${card.color.split(' ')[0].replace('bg-', '')}-400`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold mt-1">
                  {card.value}{card.suffix || ''}
                </p>
              </div>
              <div className={`p-2 rounded-full ${card.iconColor}`}>
                {card.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TechnicianPerformanceMetrics;
