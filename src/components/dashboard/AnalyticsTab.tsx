import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";
import { TrendingUp, TrendingDown, Users, Calendar, Clock, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

const performanceData = [
  { month: "Jan", calls: 450, jobs: 320 },
  { month: "Feb", calls: 520, jobs: 380 },
  { month: "Mar", calls: 480, jobs: 350 },
  { month: "Apr", calls: 610, jobs: 445 },
  { month: "May", calls: 580, jobs: 420 },
  { month: "Jun", calls: 670, jobs: 490 },
];

const customerMetrics = [
  { metric: "New Customers", value: "156", change: "+12%", trend: "up" as const, icon: Users },
  { metric: "Repeat Customers", value: "89", change: "+8%", trend: "up" as const, icon: Repeat },
  { metric: "Customer Retention", value: "87%", change: "-2%", trend: "down" as const, icon: TrendingDown },
  { metric: "Avg Response Time", value: "24h", change: "-15%", trend: "up" as const, icon: Clock },
];

const timeData = [
  { hour: "8AM", jobs: 12 },
  { hour: "10AM", jobs: 18 },
  { hour: "12PM", jobs: 25 },
  { hour: "2PM", jobs: 22 },
  { hour: "4PM", jobs: 15 },
  { hour: "6PM", jobs: 8 },
];

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
  color: "hsl(var(--popover-foreground))",
};

const highlightCards = [
  { label: "Conversion Rate", value: "73.2%", sub: "+2.1% from last month", icon: Users, gradient: "from-blue-500 to-blue-600", subColor: "text-blue-100" },
  { label: "Efficiency Score", value: "91.8%", sub: "+5.3% from last month", icon: TrendingUp, gradient: "from-emerald-500 to-emerald-600", subColor: "text-emerald-100" },
  { label: "Avg Booking Time", value: "2.4 days", sub: "-0.3 days improved", icon: Calendar, gradient: "from-violet-500 to-violet-600", subColor: "text-violet-100" },
];

const AnalyticsTab = () => {
  return (
    <div className="space-y-6">
      {/* Highlight cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {highlightCards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className={cn("border-0 text-white overflow-hidden bg-gradient-to-br shadow-md", c.gradient)}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn("text-xs uppercase tracking-wide", c.subColor)}>{c.label}</p>
                    <p className="text-3xl font-bold mt-1">{c.value}</p>
                    <p className={cn("text-xs mt-1", c.subColor)}>{c.sub}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/15 backdrop-blur">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Conversion area chart */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Calls vs Jobs Conversion</CardTitle>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="jobsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(160 84% 39%)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="calls" stroke="hsl(217 91% 60%)" strokeWidth={2} fill="url(#callsGrad)" name="Calls" />
                <Area type="monotone" dataKey="jobs" stroke="hsl(160 84% 39%)" strokeWidth={2} fill="url(#jobsGrad)" name="Jobs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer metrics */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Customer Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customerMetrics.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.metric} className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{m.metric}</p>
                        <p className="text-lg font-bold text-foreground">{m.value}</p>
                      </div>
                    </div>
                    <div className={cn("flex items-center gap-1 text-sm font-medium", m.trend === "up" ? "text-emerald-600" : "text-red-600")}>
                      {m.trend === "up" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      {m.change}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Peak hours */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Peak Hours Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(262 83% 58%)" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(262 83% 58%)" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
                  <Bar dataKey="jobs" fill="url(#peakGrad)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;
