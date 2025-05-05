
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, UserCheck, Calendar, XOctagon } from "lucide-react";

const CallTrackingSection: React.FC = () => {
  // Call tracking data
  const totalCalls = 154;
  const convertedCalls = 98;
  const scheduledCalls = 37;
  const missedCalls = 19;
  const conversionRate = 63;

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Call Tracking & Conversion</CardTitle>
        <p className="text-xs text-muted-foreground">Overview of incoming calls and customer conversion rate</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Total Calls</span>
              <Phone className="h-4 w-4 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold">{totalCalls}</h3>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Converted</span>
              <UserCheck className="h-4 w-4 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold">{convertedCalls}</h3>
            <p className="text-xs text-gray-500">New customers</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-md">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Scheduled</span>
              <Calendar className="h-4 w-4 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold">{scheduledCalls}</h3>
            <p className="text-xs text-gray-500">Follow-up</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Missed</span>
              <XOctagon className="h-4 w-4 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold">{missedCalls}</h3>
            <p className="text-xs text-gray-500">Opportunities</p>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <div>
              <h4 className="text-sm font-medium">Conversion Rate</h4>
              <p className="text-xs text-gray-500">Calls to customer conversion</p>
            </div>
            <span className="text-xl font-bold">{conversionRate}%</span>
          </div>
          
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${conversionRate}%` }}></div>
          </div>
          
          <div className="flex justify-between mt-1 text-xs">
            <div className="flex items-center text-orange-500">
              <span className="h-2 w-2 rounded-full bg-orange-500 mr-1"></span>
              <span>Needs improvement - 7% below target</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Target: 70%</span>
              <span className="ml-4 text-gray-500">100%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallTrackingSection;
