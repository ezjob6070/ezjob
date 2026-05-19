import React from "react";
import { Lead } from "@/types/lead";

interface LeadValueStatsProps {
  leads: Lead[];
}

const LeadValueStats: React.FC<LeadValueStatsProps> = ({ leads }) => {
  const now = new Date();
  const thisMonthCount = leads.filter((lead) => {
    const d = new Date(lead.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const convertedCount = leads.filter((lead) => lead.status === "converted").length;
  const conversionRate = leads.length
    ? Math.round((convertedCount / leads.length) * 100)
    : 0;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border pb-3 mb-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Total leads</span>
        <span className="font-semibold text-foreground">{leads.length}</span>
      </div>
      <span className="hidden sm:inline text-border">|</span>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-blue-500" />
        <span className="text-muted-foreground">New this month</span>
        <span className="font-semibold text-foreground">{thisMonthCount}</span>
      </div>
      <span className="hidden sm:inline text-border">|</span>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-muted-foreground">Converted</span>
        <span className="font-semibold text-foreground">{convertedCount}</span>
        <span className="text-xs text-muted-foreground">({conversionRate}%)</span>
      </div>
    </div>
  );
};

export default LeadValueStats;
