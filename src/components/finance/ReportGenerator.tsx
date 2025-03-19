
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Download, FileText, FilePieChart, Printer, FileSpreadsheet } from "lucide-react";

interface ReportGeneratorProps {
  dateRange: DateRange | undefined;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ dateRange }) => {
  const formatDateRange = () => {
    if (!dateRange?.from) return "All time";
    
    const from = dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const to = dateRange.to 
      ? dateRange.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : from;
    
    return `${from} - ${to}`;
  };

  return (
    <Card className="shadow-sm border-muted bg-gradient-to-br from-slate-50 to-blue-50">
      <CardHeader>
        <CardTitle className="text-lg">Generate Financial Reports</CardTitle>
        <CardDescription>Export comprehensive reports for selected period: {formatDateRange()}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button variant="outline" className="border-blue-200 bg-white hover:bg-blue-50 flex items-center gap-2 h-auto py-3">
            <FilePieChart className="h-4 w-4 text-blue-600" />
            <div className="text-left">
              <div className="font-medium">Profit & Loss</div>
              <div className="text-xs text-muted-foreground">Full P&L Statement</div>
            </div>
          </Button>
          
          <Button variant="outline" className="border-violet-200 bg-white hover:bg-violet-50 flex items-center gap-2 h-auto py-3">
            <FileText className="h-4 w-4 text-violet-600" />
            <div className="text-left">
              <div className="font-medium">Tax Report</div>
              <div className="text-xs text-muted-foreground">For accounting purposes</div>
            </div>
          </Button>
          
          <Button variant="outline" className="border-emerald-200 bg-white hover:bg-emerald-50 flex items-center gap-2 h-auto py-3">
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <div className="text-left">
              <div className="font-medium">CSV Export</div>
              <div className="text-xs text-muted-foreground">Raw transaction data</div>
            </div>
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 gap-2 text-white shadow-sm">
          <Printer className="h-4 w-4" />
          Print Financial Summary
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportGenerator;
