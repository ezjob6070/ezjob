import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";

type Bucket = {
  name: string;
  value: number;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  match: (completion: number) => boolean;
};

const buckets: Bucket[] = [
  { name: 'Planning',    color: '#94a3b8', gradientFrom: '#cbd5e1', gradientTo: '#64748b', value: 0, match: (c) => c < 33 },
  { name: 'In Progress', color: '#3b82f6', gradientFrom: '#60a5fa', gradientTo: '#2563eb', value: 0, match: (c) => c >= 33 && c < 67 },
  { name: 'Finalizing',  color: '#f59e0b', gradientFrom: '#fbbf24', gradientTo: '#d97706', value: 0, match: (c) => c >= 67 && c < 100 },
  { name: 'Completed',   color: '#22c55e', gradientFrom: '#4ade80', gradientTo: '#16a34a', value: 0, match: (c) => c >= 100 },
];

const ProjectsDashboardSection = () => {
  const [dialog, setDialog] = useState<{ open: boolean; title: string; items: typeof projects }>({
    open: false, title: '', items: []
  });

  const data = buckets.map(b => ({
    ...b,
    value: projects.filter(p => b.match(p.completion)).length,
  }));

  const totalProjects = projects.length;

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const avgProgress = totalProjects > 0
    ? Math.round(projects.reduce((s, p) => s + p.completion, 0) / totalProjects)
    : 0;
  const totalWorkers = projects.reduce((s, p) => s + (p.workers || 0), 0);
  const formattedBudget = totalBudget >= 1_000_000
    ? `$${(totalBudget / 1_000_000).toFixed(0)}M`
    : `$${(totalBudget / 1_000).toFixed(0)}K`;

  const spotlight = [...projects]
    .filter(p => p.completion < 100)
    .sort((a, b) => b.completion - a.completion)[0];

  const openBucket = (name: string) => {
    const bucket = buckets.find(b => b.name === name);
    if (!bucket) return;
    const items = projects.filter(p => bucket.match(p.completion));
    setDialog({ open: true, title: `${name} Projects`, items });
  };

  const openAll = () => {
    setDialog({ open: true, title: 'All Projects', items: projects });
  };

  return (
    <>
      <Card className="bg-white border border-border shadow-sm rounded-xl h-full flex flex-col">
        <CardHeader className="pb-2 pt-4 px-4 sm:px-5">
          <div className="flex justify-between items-start">
            <div>
              <button
                type="button"
                onClick={openAll}
                className="text-left"
              >
                <CardTitle className="text-base font-semibold hover:text-indigo-600 transition-colors">
                  Projects Overview
                </CardTitle>
                <CardDescription className="text-xs">
                  {totalProjects} total · tap a row to view
                </CardDescription>
              </button>
            </div>
            <Link to="/projects" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
              View all →
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-3 pb-5 px-4 sm:px-5 flex-1 flex flex-col">
          <div className="grid grid-cols-3 gap-2 mb-4 pb-3 border-b border-border">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Budget</div>
              <div className="text-sm font-semibold text-foreground mt-0.5 tabular-nums">{formattedBudget}</div>
            </div>
            <div className="text-center border-x border-border">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Avg Progress</div>
              <div className="text-sm font-semibold text-foreground mt-0.5 tabular-nums">{avgProgress}%</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Workers</div>
              <div className="text-sm font-semibold text-foreground mt-0.5 tabular-nums">{totalWorkers.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-around gap-3">
            {data.map((b) => {
              const pct = totalProjects > 0 ? Math.round((b.value / totalProjects) * 100) : 0;
              return (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => openBucket(b.name)}
                  className="w-full text-left group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: `linear-gradient(135deg, ${b.gradientFrom}, ${b.gradientTo})` }}
                      />
                      <span className="text-sm font-medium text-foreground group-hover:text-indigo-600 transition-colors">
                        {b.name}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-semibold text-foreground tabular-nums">{b.value}</span>
                      <span className="text-[11px] text-muted-foreground tabular-nums">{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${b.gradientFrom}, ${b.gradientTo})`,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>


      <Dialog open={dialog.open} onOpenChange={(open) => setDialog({ ...dialog, open })}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialog.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {dialog.items.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">No projects in this group.</p>
            )}
            {dialog.items.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block p-3 rounded-lg border border-border bg-white hover:bg-gray-50 transition-colors"
                onClick={() => setDialog({ ...dialog, open: false })}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm text-foreground truncate">{project.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {project.type} · ${(project.budget / 1000).toFixed(0)}K
                    </p>
                    <div className="w-full bg-gray-100 rounded-full h-1 mt-2">
                      <div
                        className="h-1 rounded-full bg-blue-500"
                        style={{ width: `${project.completion}%` }}
                      />
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {project.completion}%
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectsDashboardSection;
