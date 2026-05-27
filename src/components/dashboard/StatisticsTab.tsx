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
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// ---------- Mock data (richer than global state so the page looks like the reference) ----------
const TECHNICIANS = [
  "Los Angeles 1 CA", "Atlanta Georgia 2", "Kansas city 1 MO",
  "Austin & San Antonio & Dallas 1", "Chicago 3", "Philadelphia 2",
  "Garage Door America 1", "Virginia & Wash. DC", "Indmister 06",
  "Houston 2",
];
const SOURCES = [
  "center 4", "center 10", "center 17", "center 2", "center 12",
  "center 14", "center 15", "center 8", "YBM 03 Center", "Open Phone leads",
];
const AREAS = [
  "Texas", "Tennessee", "Missouri", "Arizona", "LA",
  "Virginia", "California", "Georgia", "North Carolina",
];
const STATUSES = ["completed", "cancelled", "in_progress"] as const;

type MockJob = {
  id: string;
  technician: string;
  source: string;
  area: string;
  status: typeof STATUSES[number];
  amount: number;
  companyCut: number;
  calls: number;
  date: Date;
};

function seeded(i: number) {
  // deterministic pseudo random
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const MOCK_JOBS: MockJob[] = Array.from({ length: 320 }).map((_, i) => {
  const r = seeded(i);
  const r2 = seeded(i + 1);
  const r3 = seeded(i + 2);
  const r4 = seeded(i + 3);
  const monthsBack = Math.floor(r4 * 12);
  const day = 1 + Math.floor(seeded(i + 4) * 27);
  const d = subMonths(new Date(), monthsBack);
  d.setDate(day);
  const status =
    r3 < 0.78 ? "completed" : r3 < 0.9 ? "in_progress" : "cancelled";
  const amount = Math.round(120 + r * 900);
  return {
    id: `j-${i}`,
    technician: TECHNICIANS[Math.floor(r * TECHNICIANS.length)],
    source: SOURCES[Math.floor(r2 * SOURCES.length)],
    area: AREAS[Math.floor(seeded(i + 5) * AREAS.length)],
    status,
    amount,
    companyCut: Math.round(amount * 0.18),
    calls: r2 < 0.5 ? 1 : 0,
    date: d,
  };
});

// ---------- Styling ----------
const PIE_COLORS = [
  "hsl(217 91% 60%)", "hsl(160 84% 39%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)",
  "hsl(280 70% 60%)", "hsl(190 80% 50%)", "hsl(340 80% 60%)", "hsl(120 50% 50%)",
  "hsl(45 90% 55%)", "hsl(260 70% 65%)",
];
const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
  color: "hsl(var(--popover-foreground))",
};

// ---------- Helpers ----------
function MultiSelect({
  label, icon: Icon, options, selected, onToggle, onClear, onAll,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  onClear: () => void;
  onAll: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-1">
          <Icon className="h-4 w-4" />
          {selected.length > 0 ? (
            <span>{selected.length} {label.toLowerCase()}</span>
          ) : (
            <span>{label}</span>
          )}
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

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardContent className="p-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold mt-2 text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
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
  return (
    <div className="h-64 flex items-center gap-2">
      <ResponsiveContainer width="50%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={2} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="hsl(var(--background))" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2 max-h-64 overflow-auto pr-2">
        {data.map((d, i) => (
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

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter((j) => {
      if (selectedTechs.length && !selectedTechs.includes(j.technician)) return false;
      if (selectedSources.length && !selectedSources.includes(j.source)) return false;
      if (selectedAreas.length && !selectedAreas.includes(j.area)) return false;
      if (dateRange?.from && j.date < dateRange.from) return false;
      if (dateRange?.to && j.date > dateRange.to) return false;
      return true;
    });
  }, [dateRange, selectedTechs, selectedSources, selectedAreas]);

  const hasFilters =
    !!dateRange?.from || selectedTechs.length > 0 ||
    selectedSources.length > 0 || selectedAreas.length > 0;

  const clearAll = () => {
    setDateRange(undefined);
    setSelectedTechs([]);
    setSelectedSources([]);
    setSelectedAreas([]);
  };

  // ---- Aggregations ----
  const totals = useMemo(() => {
    const calls = filteredJobs.reduce((s, j) => s + j.calls, 0);
    const jobs = filteredJobs.length;
    const total = filteredJobs.reduce((s, j) => s + j.amount, 0);
    const cut = filteredJobs.reduce((s, j) => s + j.companyCut, 0);
    return { calls, jobs, total, cut };
  }, [filteredJobs]);

  const jobsOverview = useMemo(() => {
    const counts: Record<string, number> = { Completed: 0, Cancelled: 0, "In Progress": 0 };
    filteredJobs.forEach((j) => {
      if (j.status === "completed") counts.Completed++;
      else if (j.status === "cancelled") counts.Cancelled++;
      else counts["In Progress"]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredJobs]);

  const jobsByArea = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredJobs.forEach((j) => { counts[j.area] = (counts[j.area] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredJobs]);

  const cancellingTechs = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredJobs.filter((j) => j.status === "cancelled").forEach((j) => {
      counts[j.technician] = (counts[j.technician] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filteredJobs]);

  const completedTechs = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredJobs.filter((j) => j.status === "completed").forEach((j) => {
      counts[j.technician] = (counts[j.technician] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filteredJobs]);

  const sourcesBySales = useMemo(() => {
    const sums: Record<string, number> = {};
    filteredJobs.forEach((j) => { sums[j.source] = (sums[j.source] || 0) + j.amount; });
    return Object.entries(sums).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredJobs]);

  const sourcesByDone = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredJobs.filter((j) => j.status === "completed").forEach((j) => {
      counts[j.source] = (counts[j.source] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredJobs]);

  const cutsByMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 11; i >= 0; i--) {
      const d = startOfMonth(subMonths(new Date(), i));
      map.set(format(d, "MMM yy"), 0);
    }
    filteredJobs.forEach((j) => {
      const key = format(startOfMonth(j.date), "MMM yy");
      if (map.has(key)) map.set(key, (map.get(key) || 0) + j.companyCut);
    });
    return Array.from(map.entries()).map(([month, value]) => ({ month, value }));
  }, [filteredJobs]);

  const currency = (n: number) =>
    `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

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
                  dateRange.to ? (
                    <span>{format(dateRange.from, "MMM d")} – {format(dateRange.to, "MMM d")}</span>
                  ) : (
                    <span>{format(dateRange.from, "MMM d, yyyy")}</span>
                  )
                ) : (
                  <span>Date range</span>
                )}
                <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <MultiSelect
            label="Technicians" icon={UsersIcon} options={TECHNICIANS}
            selected={selectedTechs}
            onToggle={(v) => setSelectedTechs((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v])}
            onClear={() => setSelectedTechs([])}
            onAll={() => setSelectedTechs(TECHNICIANS)}
          />

          <MultiSelect
            label="Job Sources" icon={Briefcase} options={SOURCES}
            selected={selectedSources}
            onToggle={(v) => setSelectedSources((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v])}
            onClear={() => setSelectedSources([])}
            onAll={() => setSelectedSources(SOURCES)}
          />

          <MultiSelect
            label="Areas" icon={MapPinIcon} options={AREAS}
            selected={selectedAreas}
            onToggle={(v) => setSelectedAreas((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v])}
            onClear={() => setSelectedAreas([])}
            onAll={() => setSelectedAreas(AREAS)}
          />

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-blue-600 hover:text-blue-700">
              <X className="h-4 w-4 mr-1" /> Clear all
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {filteredJobs.length} of {MOCK_JOBS.length} jobs
        </p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Calls" value={`${totals.calls}`} />
        <MetricCard label="Jobs" value={`${totals.jobs}`} />
        <MetricCard label="Total" value={currency(totals.total)} />
        <MetricCard label="Company's Cut" value={currency(totals.cut)} />
      </div>

      {/* Jobs Overview + By Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Jobs Overview">
          <PieWithLegend data={jobsOverview} />
        </ChartCard>
        <ChartCard title="Jobs By Area">
          <PieWithLegend data={jobsByArea} />
        </ChartCard>
      </div>

      {/* Technician cancelling/completed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Technicians with the highest cancelling jobs">
          <PieWithLegend data={cancellingTechs} />
        </ChartCard>
        <ChartCard title="Technicians with the highest completed jobs">
          <PieWithLegend data={completedTechs} />
        </ChartCard>
      </div>

      {/* Job sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Job Sources By Sales Amount">
          <PieWithLegend data={sourcesBySales} valueFormatter={currency} />
        </ChartCard>
        <ChartCard title="Job Sources By Done Jobs">
          <PieWithLegend data={sourcesByDone} />
        </ChartCard>
      </div>

      {/* Cuts by month */}
      <ChartCard title="Company's Cuts By Last 12 Months">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cutsByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => currency(v)} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="value" fill="hsl(217 91% 60%)" radius={[6, 6, 0, 0]} name="Company's Cut" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

export default StatisticsTab;
