
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CallTrackingSection: React.FC = () => {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Call Tracking & Conversion</CardTitle>
        <p className="text-xs text-muted-foreground">Overview of incoming calls and customer conversion rate</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-md p-3 flex flex-col">
            <div className="text-xs text-blue-700 mb-1">Total Calls</div>
            <div className="text-2xl font-bold text-blue-900">154</div>
            <div className="text-xs text-blue-600 mt-auto">Last 30 days</div>
          </div>
          
          <div className="bg-green-50 rounded-md p-3 flex flex-col">
            <div className="text-xs text-green-700 mb-1">Converted</div>
            <div className="text-2xl font-bold text-green-900">98</div>
            <div className="text-xs text-green-600 mt-auto">New customers</div>
          </div>
          
          <div className="bg-amber-50 rounded-md p-3 flex flex-col">
            <div className="text-xs text-amber-700 mb-1">Scheduled</div>
            <div className="text-2xl font-bold text-amber-900">37</div>
            <div className="text-xs text-amber-600 mt-auto">Follow-up</div>
          </div>
          
          <div className="bg-red-50 rounded-md p-3 flex flex-col">
            <div className="text-xs text-red-700 mb-1">Missed</div>
            <div className="text-2xl font-bold text-red-900">19</div>
            <div className="text-xs text-red-600 mt-auto">Opportunities</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm font-medium">Conversion Rate</div>
            <div className="text-xl font-bold">63%</div>
          </div>
          <div className="text-xs text-muted-foreground mb-2">Calls to customer conversion</div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: "63%" }}></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0%</span>
            <span>Target: 70%</span>
            <span>100%</span>
          </div>
          <div className="flex items-center mt-2 text-xs text-amber-600">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Needs improvement - 7% below target
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallTrackingSection;
