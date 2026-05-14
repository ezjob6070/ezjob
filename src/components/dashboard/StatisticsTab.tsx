import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { DollarSign, Briefcase, TrendingUp, Smile, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const monthlyRevenue = [
  { month: "Jan", revenue: 45000, jobs: 120 },
  { month: "Feb", revenue: 52000, jobs: 135 },
  { month: "Mar", revenue: 48000, jobs: 128 },
  { month: "Apr", revenue: 61000, jobs: 152 },
  { month: "May", revenue: 55000, jobs: 145 },
  { month: "Jun", revenue: 67000, jobs: 168 },
];

const jobTypes = [
  { name: "Repair", value: 45 },
  { name: "Installation", value: 30 },
  { name: "Maintenance", value: 20 },
  { name: "Emergency", value: 5 },
];

const regionData = [
  { region: "North", jobs: 85, revenue: 42000 },
  { region: "South", jobs: 78, revenue: 38000 },
  { region: "East", jobs: 92, revenue: 45000 },
  { region: "West", jobs: 67, revenue: 32000 },
];

const PIE_COLORS = ["hsl(217 91% 60%)", "hsl(160 84% 39%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)"];

const kpis = [
  { label: "Monthly Revenue", value: "$67,000", delta: "+12.4%", up: true, icon: DollarSign, tint: "from-blue-500/10 to-blue-500/0", iconClass: "text-blue-600 bg-blue-500/10" },
  { label: "Jobs Completed", value: "168", delta: "+8.2%", up: true, icon: Briefcase, tint: "from-emerald-500/10 to-emerald-500/0", iconClass: "text-emerald-600 bg-emerald-500/10" },
  { label: "Avg Job Value", value: "$399", delta: "+3.1%", up: true, icon: TrendingUp, tint: "from-amber-500/10 to-amber-500/0", iconClass: "text-amber-600 bg-amber-500/10" },
  { label: "Satisfaction", value: "94%", delta: "-0.5%", up: false, icon: Smile, tint: "from-violet-500/10 to-violet-500/0", iconClass: "text-violet-600 bg-violet-500/10" },
];

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
  color: "hsl(var(--popover-foreground))",
};

const StatisticsTab = () => {
  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card
              key={k.label}
              className="group relative overflow-hidden border-border/60 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none transition-opacity duration-300 group-hover:opacity-150", k.tint)} />
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-5 relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{k.label}</p>
                    <p className="text-2xl font-bold mt-2 text-foreground transition-transform duration-300 group-hover:scale-110 origin-left">{k.value}</p>
                  </div>
                  <div className={cn("p-2 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3", k.iconClass)}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className={cn("flex items-center gap-1 mt-3 text-xs font-medium", k.up ? "text-emerald-600" : "text-red-600")}>
                  {k.up ? <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /> : <ArrowDownRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />}
                  {k.delta}
                  <span className="text-muted-foreground font-normal ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue trend */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Revenue & Jobs Trend</CardTitle>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number, name) => [name === "revenue" ? `$${value.toLocaleString()}` : value, name === "revenue" ? "Revenue" : "Jobs"]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(217 91% 60%)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Revenue" />
                <Line yAxisId="right" type="monotone" dataKey="jobs" stroke="hsl(160 84% 39%)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Jobs" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Types */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Job Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie data={jobTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value">
                    {jobTypes.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} stroke="hsl(var(--background))" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {jobTypes.map((t, i) => (
                  <div key={t.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <span className="text-foreground">{t.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{t.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regional */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Regional Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="region" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
                  <Bar dataKey="jobs" fill="url(#barGrad)" radius={[6, 6, 0, 0]} name="Jobs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsTab;
