
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedDonutChart from "@/components/EnhancedDonutChart";

const CallTrackingSection: React.FC = () => {
  const callData = [
    { name: "New Calls", value: 28, color: "#3b82f6", gradientFrom: "#3b82f6", gradientTo: "#60a5fa" },
    { name: "Answered", value: 42, color: "#22c55e", gradientFrom: "#22c55e", gradientTo: "#4ade80" },
    { name: "Missed", value: 12, color: "#ef4444", gradientFrom: "#ef4444", gradientTo: "#f87171" },
    { name: "Voicemail", value: 8, color: "#a855f7", gradientFrom: "#a855f7", gradientTo: "#c084fc" }
  ];

  return (
    <Card className="bg-white shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Call Tracking</CardTitle>
        <p className="text-xs text-muted-foreground">Call activity for this month</p>
      </CardHeader>
      <CardContent>
        <EnhancedDonutChart 
          data={callData}
          title="90"
          subtitle="Total Calls"
          size={240}
          thickness={40}
          animation={true}
          showLegend={true}
          legendPosition="right"
        />
      </CardContent>
    </Card>
  );
};

export default CallTrackingSection;
