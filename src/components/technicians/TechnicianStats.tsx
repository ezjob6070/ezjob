
import { Technician } from "@/types/technician";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UsersRound, Award, Clock } from "lucide-react";

interface TechnicianStatsProps {
  technicians: Technician[];
  showSalaryStats?: boolean;
}

const TechnicianStats = ({ technicians, showSalaryStats = false }: TechnicianStatsProps) => {
  const totalTechnicians = technicians.length;
  const activeTechnicians = technicians.filter(tech => tech.status === "active").length;
  const averageRating = technicians.reduce((sum, tech) => sum + tech.rating, 0) / totalTechnicians || 0;
  
  // Salary stats
  const techniciansWithHourlyRate = technicians.filter(tech => tech.hourlyRate !== undefined && tech.hourlyRate > 0);
  const averageHourlyRate = techniciansWithHourlyRate.length > 0
    ? techniciansWithHourlyRate.reduce((sum, tech) => sum + (tech.hourlyRate || 0), 0) / techniciansWithHourlyRate.length
    : 0;
  
  const techniciansWithIncentives = technicians.filter(tech => tech.incentiveAmount !== undefined && tech.incentiveAmount > 0);
  const averageIncentive = techniciansWithIncentives.length > 0
    ? techniciansWithIncentives.reduce((sum, tech) => sum + (tech.incentiveAmount || 0), 0) / techniciansWithIncentives.length
    : 0;

  // Format number as currency with 2 decimals for hourly rates
  const formatHourlyRate = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {showSalaryStats ? "Technicians with Hourly Rates" : "Total Technicians"}
          </CardTitle>
          <UsersRound className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {showSalaryStats ? techniciansWithHourlyRate.length : totalTechnicians}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {showSalaryStats 
              ? `${techniciansWithHourlyRate.length} of ${totalTechnicians} technicians`
              : `${activeTechnicians} active, ${totalTechnicians - activeTechnicians} inactive`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {showSalaryStats ? "Average Hourly Rate" : "Average Rating"}
          </CardTitle>
          {showSalaryStats 
            ? <Clock className="h-4 w-4 text-muted-foreground" />
            : <Award className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {showSalaryStats 
              ? formatHourlyRate(averageHourlyRate)
              : averageRating.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {showSalaryStats 
              ? "Per hour across all technicians"
              : "Average customer rating"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {showSalaryStats ? "Technicians with Incentives" : "Active Technicians"}
          </CardTitle>
          <Badge variant="outline" className={activeTechnicians === totalTechnicians ? "bg-green-50" : ""}>
            {activeTechnicians} of {totalTechnicians}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {showSalaryStats 
              ? techniciansWithIncentives.length
              : `${Math.round((activeTechnicians / totalTechnicians) * 100)}%`}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {showSalaryStats 
              ? `${techniciansWithIncentives.length} of ${totalTechnicians} technicians`
              : "Technician availability"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianStats;
