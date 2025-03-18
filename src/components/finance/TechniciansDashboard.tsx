
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Technician } from '@/types/technician';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import PaymentBreakdownCards from '@/components/technicians/charts/PaymentBreakdownCards';
import TechnicianPerformanceMetrics from '@/components/technicians/charts/TechnicianPerformanceMetrics';

interface TechniciansDashboardProps {
  activeTechnicians: Technician[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TechniciansDashboard: React.FC<TechniciansDashboardProps> = ({
  activeTechnicians,
  searchQuery,
  setSearchQuery
}) => {
  const filteredTechnicians = activeTechnicians.filter(tech => 
    tech.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate total metrics for all displayed technicians
  const aggregateMetrics = {
    completedJobs: filteredTechnicians.reduce((sum, tech) => sum + (tech.completedJobs || 0), 0),
    cancelledJobs: filteredTechnicians.reduce((sum, tech) => sum + (tech.cancelledJobs || 0), 0),
    totalRevenue: filteredTechnicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0),
    revenue: filteredTechnicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0)
  };
  
  // Calculate technician earnings
  const technicianEarnings = filteredTechnicians.reduce((sum, tech) => {
    if (!tech.totalRevenue) return sum;
    return sum + (tech.paymentType === 'percentage'
      ? tech.totalRevenue * (tech.paymentRate / 100)
      : tech.completedJobs * tech.paymentRate);
  }, 0);
  
  // Simplified calculations for other financial metrics
  const expenses = aggregateMetrics.revenue * 0.2;
  const profit = aggregateMetrics.revenue - technicianEarnings - expenses;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl font-semibold">Technician Dashboard</h2>
          <p className="text-muted-foreground">Overview of technician financial performance</p>
        </div>
        
        <div className="w-full md:w-64 relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search technicians..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      {filteredTechnicians.length > 0 ? (
        <>
          <PaymentBreakdownCards
            revenue={aggregateMetrics.revenue}
            technicianEarnings={technicianEarnings}
            expenses={expenses}
            profit={profit}
            dateRangeText="Last 30 days"
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Technicians</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTechnicians
                  .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
                  .slice(0, 3)
                  .map(tech => {
                    // Calculate metrics for this technician
                    const metrics = {
                      completedJobs: tech.completedJobs || 0,
                      cancelledJobs: tech.cancelledJobs || 0,
                      totalRevenue: tech.totalRevenue || 0,
                      revenue: tech.totalRevenue || 0
                    };
                    
                    return (
                      <div key={tech.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <h3 className="text-lg font-medium mb-2">{tech.name}</h3>
                        <TechnicianPerformanceMetrics 
                          technician={tech}
                          metrics={metrics}
                        />
                      </div>
                    );
                  })
                }
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="flex justify-center items-center h-40 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No technicians found</p>
        </div>
      )}
    </div>
  );
};

export default TechniciansDashboard;
