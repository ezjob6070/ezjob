
import { Technician } from "@/types/technician";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UsersRound, DollarSign, Award, Clock } from "lucide-react";

interface TechnicianStatsProps {
  technicians: Technician[];
  showSalaryStats?: boolean;
}

const TechnicianStats = ({ technicians, showSalaryStats = false }: TechnicianStatsProps) => {
  const totalTechnicians = technicians.length;
  const activeTechnicians = technicians.filter(tech => tech.status === "active").length;
  const totalRevenue = technicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
            {showSalaryStats ? "Average Hourly Rate" : "Total Revenue"}
          </CardTitle>
          {showSalaryStats 
            ? <Clock className="h-4 w-4 text-muted-foreground" />
            : <DollarSign className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {showSalaryStats 
              ? formatHourlyRate(averageHourlyRate)
              : formatCurrency(totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {showSalaryStats 
              ? "Per hour across all technicians"
              : "Revenue from all jobs"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {showSalaryStats ? "Technicians with Incentives" : "Average Rating"}
          </CardTitle>
          {showSalaryStats 
            ? <DollarSign className="h-4 w-4 text-muted-foreground" />
            : <Award className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {showSalaryStats 
              ? techniciansWithIncentives.length
              : averageRating.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {showSalaryStats 
              ? `${techniciansWithIncentives.length} of ${totalTechnicians} technicians`
              : "Average customer rating"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {showSalaryStats ? "Average Incentive Amount" : "Active Technicians"}
          </CardTitle>
          {showSalaryStats 
            ? <Award className="h-4 w-4 text-muted-foreground" />
            : <Badge variant="outline" className={activeTechnicians === totalTechnicians ? "bg-green-50" : ""}>
                {activeTechnicians} of {totalTechnicians}
              </Badge>}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {showSalaryStats 
              ? formatHourlyRate(averageIncentive)
              : `${Math.round((activeTechnicians / totalTechnicians) * 100)}%`}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {showSalaryStats 
              ? "Average incentive per technician"
              : "Technician availability"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianStats;
