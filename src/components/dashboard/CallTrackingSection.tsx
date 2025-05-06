
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, UserCheck, Calendar, XOctagon } from "lucide-react";

interface CallTrackingSectionProps {
  dateRangeText?: string;
}

const CallTrackingSection: React.FC<CallTrackingSectionProps> = ({
  dateRangeText = "Custom Range"
}) => {
  // Call tracking data
  const totalCalls = 154;
  const convertedCalls = 98;
  const scheduledCalls = 37;
  const missedCalls = 19;
  const conversionRate = 63;

  return (
    <Card className="bg-white shadow-sm h-full">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-base">Call Tracking & Conversion</CardTitle>
        <p className="text-xs text-muted-foreground">Overview of incoming calls • {dateRangeText}</p>
      </CardHeader>
      <CardContent className="pt-0 p-3">
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="flex justify-between mb-0.5">
              <span className="text-xs text-gray-500">Total</span>
              <Phone className="h-3 w-3 text-blue-500" />
            </div>
            <h3 className="text-sm font-bold">{totalCalls}</h3>
          </div>
          
          <div className="bg-green-50 p-2 rounded-md">
            <div className="flex justify-between mb-0.5">
              <span className="text-xs text-gray-500">Converted</span>
              <UserCheck className="h-3 w-3 text-green-500" />
            </div>
            <h3 className="text-sm font-bold">{convertedCalls}</h3>
          </div>
          
          <div className="bg-yellow-50 p-2 rounded-md">
            <div className="flex justify-between mb-0.5">
              <span className="text-xs text-gray-500">Scheduled</span>
              <Calendar className="h-3 w-3 text-yellow-500" />
            </div>
            <h3 className="text-sm font-bold">{scheduledCalls}</h3>
          </div>
          
          <div className="bg-red-50 p-2 rounded-md">
            <div className="flex justify-between mb-0.5">
              <span className="text-xs text-gray-500">Missed</span>
              <XOctagon className="h-3 w-3 text-red-500" />
            </div>
            <h3 className="text-sm font-bold">{missedCalls}</h3>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <div>
              <h4 className="text-xs font-medium">Conversion Rate</h4>
              <p className="text-xs text-gray-500">Calls to customer conversion</p>
            </div>
            <span className="text-base font-bold">{conversionRate}%</span>
          </div>
          
          <div className="w-full bg-gray-200 h-1.5 rounded-full">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${conversionRate}%` }}></div>
          </div>
          
          <div className="flex justify-between mt-1 text-xs">
            <div className="flex items-center text-orange-500">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mr-1"></span>
              <span className="text-[10px]">7% below target</span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>Target: 70%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallTrackingSection;
