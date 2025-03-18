
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Technician } from "@/types/technician";
import PaymentBreakdownCards from "@/components/technicians/charts/PaymentBreakdownCards";
import TechnicianPerformanceMetrics from "@/components/technicians/charts/TechnicianPerformanceMetrics";

interface TechnicianDetailPanelProps {
  selectedTechnician: Technician | null;
  selectedTechnicianMetrics: any;
  dateRangeText: string;
}

const TechnicianDetailPanel: React.FC<TechnicianDetailPanelProps> = ({
  selectedTechnician,
  selectedTechnicianMetrics,
  dateRangeText
}) => {
  if (!selectedTechnician) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Details: {selectedTechnician.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${selectedTechnicianMetrics?.revenue || 0}
                </span>
                <span className="text-xs text-muted-foreground mt-1">{dateRangeText}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Technician Earnings</span>
                <span className="text-2xl font-bold text-red-600">
                  -${selectedTechnicianMetrics?.earnings || 0}
                </span>
                <span className="text-xs text-muted-foreground mt-1">{dateRangeText}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Expenses</span>
                <span className="text-2xl font-bold text-red-600">
                  -${selectedTechnicianMetrics?.expenses || 0}
                </span>
                <span className="text-xs text-muted-foreground mt-1">{dateRangeText}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Company Profit</span>
                <span className="text-2xl font-bold text-green-600">
                  ${selectedTechnicianMetrics?.profit || 0}
                </span>
                <span className="text-xs text-muted-foreground mt-1">{dateRangeText}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Total Jobs</span>
                  <span className="text-2xl font-bold">{selectedTechnicianMetrics?.totalJobs || 0}</span>
                </div>
                
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Completed Jobs</span>
                  <span className="text-2xl font-bold">{selectedTechnicianMetrics?.completedJobs || 0}</span>
                </div>
                
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Cancelled Jobs</span>
                  <span className="text-2xl font-bold">{selectedTechnicianMetrics?.cancelledJobs || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianDetailPanel;
