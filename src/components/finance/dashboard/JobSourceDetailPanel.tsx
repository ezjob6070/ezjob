
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobSource } from "@/types/finance";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import FinancialMetricsCards from "../FinancialMetricsCards";

interface JobSourceDetailPanelProps {
  selectedJobSource: JobSource;
  dateRangeText: string;
}

const JobSourceDetailPanel: React.FC<JobSourceDetailPanelProps> = ({
  selectedJobSource,
  dateRangeText
}) => {
  // Create a finance report object to match the expected props format for FinancialMetricsCards
  const jobSourceReport = {
    totalRevenue: selectedJobSource.totalRevenue || 0,
    totalExpenses: selectedJobSource.expenses || 0,
    companyProfit: selectedJobSource.companyProfit || 0,
    technicianPayments: 0, // Job sources don't have technician payments directly
    transactions: [] // Job sources don't have direct transactions in this structure
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 mr-1 text-xs">
            {selectedJobSource.name.substring(0, 2).toUpperCase()}
          </div>
          {selectedJobSource.name} Details
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Financial performance for {dateRangeText}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <FinancialMetricsCards report={jobSourceReport} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-2">Job Source Information</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Total Jobs:</span>
                  <span className="font-medium">{selectedJobSource.totalJobs || 0}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{selectedJobSource.category || "Others"}</span>
                </div>
                {selectedJobSource.website && (
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Website:</span>
                    <a href={selectedJobSource.website} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline truncate">
                      {selectedJobSource.website}
                    </a>
                  </div>
                )}
                {selectedJobSource.createdAt && (
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">
                      {new Date(selectedJobSource.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-2">Financial Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Revenue:</span>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(selectedJobSource.totalRevenue || 0)}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Expenses:</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(selectedJobSource.expenses || 0)}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Profit:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(selectedJobSource.companyProfit || 0)}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Profit Margin:</span>
                  <span className="font-medium">
                    {selectedJobSource.totalRevenue ? 
                      ((selectedJobSource.companyProfit || 0) / selectedJobSource.totalRevenue * 100).toFixed(1) : "0.0"}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-2">Performance Metrics</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Avg. Revenue/Job:</span>
                  <span className="font-medium">
                    {formatCurrency(selectedJobSource.totalJobs && selectedJobSource.totalRevenue 
                      ? selectedJobSource.totalRevenue / selectedJobSource.totalJobs 
                      : 0)}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Avg. Profit/Job:</span>
                  <span className="font-medium">
                    {formatCurrency(selectedJobSource.totalJobs && selectedJobSource.companyProfit 
                      ? (selectedJobSource.companyProfit || 0) / selectedJobSource.totalJobs 
                      : 0)}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Cost Per Job:</span>
                  <span className="font-medium">
                    {formatCurrency(selectedJobSource.totalJobs && selectedJobSource.expenses 
                      ? (selectedJobSource.expenses || 0) / selectedJobSource.totalJobs 
                      : 0)}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">% of Total Revenue:</span>
                  <span className="font-medium">
                    {/* Placeholder - would need total company revenue to calculate */}
                    ~12.5%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSourceDetailPanel;
