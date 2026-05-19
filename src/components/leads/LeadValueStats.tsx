import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "@/types/lead";
import { CalendarRange, CheckCircle2 } from "lucide-react";

interface LeadValueStatsProps {
  leads: Lead[];
}

const LeadValueStats: React.FC<LeadValueStatsProps> = ({ leads }) => {
  const now = new Date();
  const thisMonthLeads = leads.filter((lead) => {
    const d = new Date(lead.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const convertedLeads = leads.filter((lead) => lead.status === "converted");
  const convertedThisMonth = convertedLeads.filter((lead) => {
    const d = new Date(lead.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const conversionRate = leads.length
    ? Math.round((convertedLeads.length / leads.length) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            New This Month
          </CardTitle>
          <div className="rounded-md bg-blue-50 p-2">
            <CalendarRange className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{thisMonthLeads.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            New leads added in {now.toLocaleString("en-US", { month: "long" })}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Converted
          </CardTitle>
          <div className="rounded-md bg-green-50 p-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{convertedLeads.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {conversionRate}% conversion rate · {convertedThisMonth} this month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadValueStats;
