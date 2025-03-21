
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
          <Card className="h-[110px] bg-gradient-to-br from-blue-50 via-blue-100/30 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-900">Total Revenue</h3>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                ${selectedTechnicianMetrics?.revenue || 0}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
                <div className="flex items-center bg-blue-100 text-blue-600 text-xs font-medium p-1 rounded">
                  <DollarSignIcon size={12} className="mr-1" />
                  <span>+7.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="h-[110px] bg-gradient-to-br from-red-50 via-red-100/30 to-rose-50 border-red-200">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-900">Technician Earnings</h3>
              <p className="text-2xl font-bold text-red-600 mt-1">
                -${selectedTechnicianMetrics?.earnings || 0}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
                <div className="flex items-center bg-red-100 text-red-600 text-xs font-medium p-1 rounded">
                  <DollarSignIcon size={12} className="mr-1" />
                  <span>+3.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="h-[110px] bg-gradient-to-br from-red-50 via-red-100/30 to-rose-50 border-red-200">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-900">Expenses</h3>
              <p className="text-2xl font-bold text-red-600 mt-1">
                -${selectedTechnicianMetrics?.expenses || 0}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
                <div className="flex items-center bg-red-100 text-red-600 text-xs font-medium p-1 rounded">
                  <DollarSignIcon size={12} className="mr-1" />
                  <span>+4.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="h-[110px] bg-gradient-to-br from-emerald-50 via-emerald-100/30 to-teal-50 border-emerald-200">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-900">Company Profit</h3>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                ${selectedTechnicianMetrics?.profit || 0}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
                <div className="flex items-center bg-emerald-100 text-emerald-600 text-xs font-medium p-1 rounded">
                  <DollarSignIcon size={12} className="mr-1" />
                  <span>+6.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        
          <Card className="h-[110px] bg-gradient-to-br from-indigo-50 via-indigo-100/30 to-purple-50 border-indigo-200">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-900">Total Jobs</h3>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{selectedTechnicianMetrics?.totalJobs || 0}</p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground mt-1">All assigned jobs</p>
                <div className="flex items-center bg-indigo-100 text-indigo-600 text-xs font-medium p-1 rounded">
                  <BriefcaseIcon size={12} className="mr-1" />
                  <span>+5.4%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="h-[110px] bg-gradient-to-br from-indigo-50 via-indigo-100/30 to-purple-50 border-indigo-200">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-900">Completed Jobs</h3>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{selectedTechnicianMetrics?.completedJobs || 0}</p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground mt-1">Successfully finished</p>
                <div className="flex items-center bg-indigo-100 text-indigo-600 text-xs font-medium p-1 rounded">
                  <BriefcaseIcon size={12} className="mr-1" />
                  <span>+5.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="h-[110px] bg-gradient-to-br from-red-50 via-red-100/30 to-rose-50 border-red-200">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-900">Cancelled Jobs</h3>
              <p className="text-2xl font-bold text-red-600 mt-1">{selectedTechnicianMetrics?.cancelledJobs || 0}</p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground mt-1">Jobs not completed</p>
                <div className="flex items-center bg-red-100 text-red-600 text-xs font-medium p-1 rounded">
                  <XIcon size={12} className="mr-1" />
                  <span>-2.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="h-[110px] bg-gradient-to-br from-blue-50 via-blue-100/30 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-900">Average Job Value</h3>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                ${selectedTechnicianMetrics?.revenue && selectedTechnicianMetrics?.totalJobs 
                  ? Math.round(selectedTechnicianMetrics.revenue / selectedTechnicianMetrics.totalJobs) 
                  : 0}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground mt-1">Per job revenue</p>
                <div className="flex items-center bg-blue-100 text-blue-600 text-xs font-medium p-1 rounded">
                  <BarChartIcon size={12} className="mr-1" />
                  <span>+3.1%</span>
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
