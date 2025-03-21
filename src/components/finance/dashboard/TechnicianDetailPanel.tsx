
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Technician } from "@/types/technician";
import { BriefcaseIcon, BarChartIcon, DollarSignIcon, XIcon } from "lucide-react";
import PaymentBreakdownCards from "@/components/technicians/charts/PaymentBreakdownCards";

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
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <DollarSignIcon className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${selectedTechnicianMetrics?.revenue || 0}
                  </p>
                  <span className="text-xs text-muted-foreground mt-1">{dateRangeText}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <DollarSignIcon className="h-5 w-5 text-red-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Technician Earnings</p>
                  <p className="text-2xl font-bold text-red-600">
                    -${selectedTechnicianMetrics?.earnings || 0}
                  </p>
                  <span className="text-xs text-muted-foreground mt-1">{dateRangeText}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <DollarSignIcon className="h-5 w-5 text-red-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    -${selectedTechnicianMetrics?.expenses || 0}
                  </p>
                  <span className="text-xs text-muted-foreground mt-1">{dateRangeText}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <DollarSignIcon className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company Profit</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ${selectedTechnicianMetrics?.profit || 0}
                  </p>
                  <span className="text-xs text-muted-foreground mt-1">{dateRangeText}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <BriefcaseIcon className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="text-2xl font-bold">{selectedTechnicianMetrics?.totalJobs || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <BriefcaseIcon className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed Jobs</p>
                  <p className="text-2xl font-bold">{selectedTechnicianMetrics?.completedJobs || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <XIcon className="h-5 w-5 text-red-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cancelled Jobs</p>
                  <p className="text-2xl font-bold">{selectedTechnicianMetrics?.cancelledJobs || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <DollarSignIcon className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Job Value</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${selectedTechnicianMetrics?.revenue && selectedTechnicianMetrics?.totalJobs 
                      ? Math.round(selectedTechnicianMetrics.revenue / selectedTechnicianMetrics.totalJobs) 
                      : 0}
                  </p>
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
