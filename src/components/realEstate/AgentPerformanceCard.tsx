
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp } from "lucide-react";

type AgentType = {
  name: string;
  listings: number;
  sales: number;
  revenue: number;
  rating: number;
};

type AgentPerformanceCardProps = {
  agents: AgentType[];
  formatCurrency: (amount: number) => string;
};

const AgentPerformanceCard = ({ agents, formatCurrency }: AgentPerformanceCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('');
  };

  const getRandomColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500"
    ];
    
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center border-b pb-4">
        <div className="flex items-center">
          <Award className="h-5 w-5 text-yellow-500 mr-2" />
          <CardTitle>Top Performing Agents</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {agents.map((agent, index) => (
            <div 
              key={agent.name} 
              className={`flex flex-col p-4 rounded-lg ${
                index === 0 
                  ? "bg-gradient-to-br from-yellow-50 to-amber-100 border border-yellow-200" 
                  : "bg-gray-50"
              }`}
            >
              <div className="flex items-center mb-3">
                <Avatar className={`h-10 w-10 mr-3 ${index === 0 ? "ring-2 ring-yellow-500" : ""}`}>
                  <AvatarFallback className={getRandomColor(agent.name)}>
                    {getInitials(agent.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{agent.name}</div>
                  <div className="flex items-center">
                    {index === 0 && (
                      <Badge className="mr-1.5 bg-yellow-500">Top Agent</Badge>
                    )}
                    <div className="flex items-center text-sm text-yellow-600">
                      <span className="mr-1">★</span>
                      <span>{agent.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500">Listings</div>
                  <div className="text-lg font-semibold">{agent.listings}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500">Sales</div>
                  <div className="text-lg font-semibold">{agent.sales}</div>
                </div>
                <div className="col-span-2 space-y-1">
                  <div className="text-xs font-medium text-gray-500">Revenue</div>
                  <div className="text-lg font-semibold flex items-center">
                    {formatCurrency(agent.revenue)}
                    <TrendingUp className="h-4 w-4 ml-1 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentPerformanceCard;
