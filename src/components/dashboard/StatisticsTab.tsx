import React, { useMemo, useState } from "react";
import { format, subMonths, startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  CalendarIcon, Users as UsersIcon, MapPin as MapPinIcon,
  Briefcase, Check, ChevronDown, X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// ---------- Mock data ----------
const TECHNICIANS = [
  "Los Angeles Team", "Atlanta Crew", "Kansas City Unit",
  "Dallas / Austin Team", "Chicago Squad", "Philadelphia Team",
  "Garage Door America", "Virginia & DC Team", "Denver Crew",
  "Houston Team",
];
const SOURCES = [
  "Google Ads", "Website", "Referrals", "Yelp", "Facebook",
  "Bing Ads", "Direct Call", "Partner Network", "Open Phone", "Other",
];
const AREAS = [
  "Texas", "Tennessee", "Missouri", "Arizona", "California",
  "Virginia", "Florida", "Georgia", "North Carolina",
];

type MockJob = {
  id: string; technician: string; source: string; area: string;
  status: "completed" | "cancelled" | "in_progress";
  amount: number; profit: number; calls: number; date: Date;
};

const seeded = (i: number) => {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const MOCK_JOBS: MockJob[] = Array.from({ length: 320 }).map((_, i) => {
  const r = seeded(i), r2 = seeded(i + 1), r3 = seeded(i + 2), r4 = seeded(i + 3);
  const d = subMonths(new Date(), Math.floor(r4 * 12));
  d.setDate(1 + Math.floor(seeded(i + 4) * 27));
  const status = r3 < 0.78 ? "completed" : r3 < 0.9 ? "in_progress" : "cancelled";
  const amount = Math.round(120 + r * 900);
  return {
    id: `j-${i}`,
    technician: TECHNICIANS[Math.floor(r * TECHNICIANS.length)],
    source: SOURCES[Math.floor(r2 * SOURCES.length)],
    area: AREAS[Math.floor(seeded(i + 5) * AREAS.length)],
    status, amount,
    profit: Math.round(amount * 0.18),
    calls: r2 < 0.5 ? 1 : 0,
    date: d,
  };
});

const PIE_COLORS = [
  "hsl(217 91% 60%)", "hsl(160 84% 39%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)",
  "hsl(280 70% 60%)", "hsl(190 80% 50%)", "hsl(340 80% 60%)",
];
const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8, fontSize: 12, color: "hsl(var(--popover-foreground))",
};

const currency = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

// Limit long lists to top N + Other
function topN<T extends { name: string; value: number }>(arr: T[], n = 6): T[] {
  if (arr.length <= n) return arr;
  const top = arr.slice(0, n);
  const rest = arr.slice(n).reduce((s, x) => s + x.value, 0);
  return [...top, { name: "Other", value: rest } as T];
}

// ---------- Reusable bits ----------
function MultiSelect({
  label, icon: Icon, options, selected, onToggle, onClear, onAll,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  options: string[]; selected: string[];
  onToggle: (v: string) => void; onClear: () => void; onAll: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-1">
          <Icon className="h-4 w-4" />
          {selected.length > 0 ? <span>{selected.length} {label.toLowerCase()}</span> : <span>{label}</span>}
          <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem key={opt} onSelect={() => onToggle(opt)}>
                  <Check className={cn("mr-2 h-4 w-4", selected.includes(opt) ? "opacity-100" : "opacity-0")} />
                  {opt}
                </CommandItem>
              ))}
            </CommandGroup>
            <div className="border-t p-2 flex justify-between">
              <Button variant="ghost" size="sm" onClick={onAll} className="text-xs">Select all</Button>
              <Button variant="ghost" size="sm" onClick={onClear} className="text-xs">Clear</Button>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function MetricCard({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardContent className="p-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold mt-2 text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{caption}</p>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {right}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function PieWithLegend({
  data, valueFormatter,
}: {
  data: { name: string; value: number }[];
  valueFormatter?: (n: number) => string;
}) {
  const fmt = valueFormatter ?? ((n: number) => `${n}`);
  const trimmed = topN(data, 6);
  return (
    <div className="h-64 flex items-center gap-4">
      <ResponsiveContainer width="50%" height="100%">
        <PieChart>
          <Pie data={trimmed} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
            {trimmed.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="hsl(var(--background))" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2.5 max-h-64 overflow-auto pr-1">
        {trimmed.map((d, i) => (
          <div key={d.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
              <span className="text-foreground truncate">{d.name}</span>
            </div>
            <span className="font-semibold text-foreground ml-2 shrink-0">{fmt(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Main ----------
const StatisticsTab = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const filteredJobs = useMemo(() => MOCK_JOBS.filter((j) => {
    if (selectedTechs.length && !selectedTechs.includes(j.technician)) return false;
    if (selectedSources.length && !selectedSources.includes(j.source)) return false;
    if (selectedAreas.length && !selectedAreas.includes(j.area)) return false;
    if (dateRange?.from && j.date < dateRange.from) return false;
    if (dateRange?.to && j.date > dateRange.to) return false;
    return true;
  }), [dateRange, selectedTechs, selectedSources, selectedAreas]);

  const hasFilters = !!dateRange?.from || selectedTechs.length > 0 || selectedSources.length > 0 || selectedAreas.length > 0;
  const clearAll = () => {
    setDateRange(undefined); setSelectedTechs([]); setSelectedSources([]); setSelectedAreas([]);
  };

  const totals = useMemo(() => ({
    calls: filteredJobs.reduce((s, j) => s + j.calls, 0),
    jobs: filteredJobs.length,
    revenue: filteredJobs.reduce((s, j) => s + j.amount, 0),
    profit: filteredJobs.reduce((s, j) => s + j.profit, 0),
  }), [filteredJobs]);

  const statusBreakdown = useMemo(() => {
    const c = { Completed: 0, "In Progress": 0, Cancelled: 0 };
    filteredJobs.forEach((j) => {
      if (j.status === "completed") c.Completed++;
      else if (j.status === "cancelled") c.Cancelled++;
      else c["In Progress"]++;
    });
    return Object.entries(c).map(([name, value]) => ({ name, value }));
  }, [filteredJobs]);

  const byRegion = useMemo(() => {
    const m: Record<string, number> = {};
    filteredJobs.forEach((j) => { m[j.area] = (m[j.area] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredJobs]);

  const topTechs = useMemo(() => {
    const m: Record<string, number> = {};
    filteredJobs.filter((j) => j.status === "completed").forEach((j) => { m[j.technician] = (m[j.technician] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredJobs]);

  const cancelTechs = useMemo(() => {
    const m: Record<string, number> = {};
    filteredJobs.filter((j) => j.status === "cancelled").forEach((j) => { m[j.technician] = (m[j.technician] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredJobs]);

  const sourceRevenue = useMemo(() => {
    const m: Record<string, number> = {};
    filteredJobs.forEach((j) => { m[j.source] = (m[j.source] || 0) + j.amount; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredJobs]);

  const sourceCompleted = useMemo(() => {
    const m: Record<string, number> = {};
    filteredJobs.filter((j) => j.status === "completed").forEach((j) => { m[j.source] = (m[j.source] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredJobs]);

  const profitByMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 11; i >= 0; i--) {
      const d = startOfMonth(subMonths(new Date(), i));
      map.set(format(d, "MMM"), 0);
    }
    filteredJobs.forEach((j) => {
      const k = format(startOfMonth(j.date), "MMM");
      if (map.has(k)) map.set(k, (map.get(k) || 0) + j.profit);
    });
    return Array.from(map.entries()).map(([month, value]) => ({ month, value }));
  }, [filteredJobs]);

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-1">
                <CalendarIcon className="h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to
                    ? <span>{format(dateRange.from, "MMM d")} – {format(dateRange.to, "MMM d")}</span>
                    : <span>{format(dateRange.from, "MMM d, yyyy")}</span>
                ) : <span>Date range</span>}
                <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange}
                numberOfMonths={2} initialFocus className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>

          <MultiSelect label="Technicians" icon={UsersIcon} options={TECHNICIANS}
            selected={selectedTechs}
            onToggle={(v) => setSelectedTechs((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v])}
            onClear={() => setSelectedTechs([])} onAll={() => setSelectedTechs(TECHNICIANS)} />
          <MultiSelect label="Sources" icon={Briefcase} options={SOURCES}
            selected={selectedSources}
            onToggle={(v) => setSelectedSources((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v])}
            onClear={() => setSelectedSources([])} onAll={() => setSelectedSources(SOURCES)} />
          <MultiSelect label="Regions" icon={MapPinIcon} options={AREAS}
            selected={selectedAreas}
            onToggle={(v) => setSelectedAreas((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v])}
            onClear={() => setSelectedAreas([])} onAll={() => setSelectedAreas(AREAS)} />
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-blue-600 hover:text-blue-700">
            <X className="h-4 w-4 mr-1" /> Clear filters
          </Button>
        )}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Calls Received" value={`${totals.calls}`} caption="In selected period" />
        <MetricCard label="Total Jobs" value={`${totals.jobs}`} caption="All statuses" />
        <MetricCard label="Revenue" value={currency(totals.revenue)} caption="Gross billed" />
        <MetricCard label="Net Profit" value={currency(totals.profit)} caption="After tech payouts" />
      </div>

      {/* Status + Region */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Job Status Breakdown">
          <PieWithLegend data={statusBreakdown} />
        </ChartCard>
        <ChartCard title="Jobs by Region">
          <PieWithLegend data={byRegion} />
        </ChartCard>
      </div>

      {/* Technicians (tabs) */}
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardContent className="p-5">
          <Tabs defaultValue="top">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Technician Performance</h3>
              <TabsList>
                <TabsTrigger value="top">Top Performers</TabsTrigger>
                <TabsTrigger value="cancel">Most Cancellations</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="top" className="mt-0"><PieWithLegend data={topTechs} /></TabsContent>
            <TabsContent value="cancel" className="mt-0"><PieWithLegend data={cancelTechs} /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sources (tabs) */}
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardContent className="p-5">
          <Tabs defaultValue="revenue">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Lead Sources</h3>
              <TabsList>
                <TabsTrigger value="revenue">By Revenue</TabsTrigger>
                <TabsTrigger value="completed">By Completed Jobs</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="revenue" className="mt-0">
              <PieWithLegend data={sourceRevenue} valueFormatter={currency} />
            </TabsContent>
            <TabsContent value="completed" className="mt-0">
              <PieWithLegend data={sourceCompleted} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Profit trend */}
      <ChartCard title="Monthly Profit Trend" right={<span className="text-xs text-muted-foreground">Last 12 months</span>}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => currency(v)} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="value" fill="hsl(217 91% 60%)" radius={[6, 6, 0, 0]} name="Net Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

export default StatisticsTab;
