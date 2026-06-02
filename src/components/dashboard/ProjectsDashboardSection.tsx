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
  { name: 'Early',       color: '#94a3b8', gradientFrom: '#cbd5e1', gradientTo: '#64748b', value: 0, match: (c) => c < 33 },
  { name: 'In Progress', color: '#3b82f6', gradientFrom: '#60a5fa', gradientTo: '#2563eb', value: 0, match: (c) => c >= 33 && c < 67 },
  { name: 'Near Done',   color: '#f59e0b', gradientFrom: '#fbbf24', gradientTo: '#d97706', value: 0, match: (c) => c >= 67 && c < 100 },
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
      <Card className="bg-white border border-border shadow-sm rounded-xl h-full">
        <CardHeader className="pb-2 pt-4 px-4 sm:px-5">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base font-semibold">Projects Overview</CardTitle>
              <CardDescription className="text-xs">Tap a slice to view projects</CardDescription>
            </div>
            <Link to="/projects" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
              View all →
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-2 pb-6 px-4 sm:px-5">
          <div className="flex flex-col items-center">
            <EnhancedDonutChart
              data={data}
              title={`${totalProjects}`}
              subtitle="Total Projects"
              size={220}
              thickness={44}
              gradients
              animation
              showLegend={false}
              onCenterClick={openAll}
              onSegmentClick={(seg) => openBucket(seg.name)}
            />
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {data.map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => openBucket(b.name)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-white hover:bg-gray-50 text-xs transition-colors"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: `linear-gradient(135deg, ${b.gradientFrom}, ${b.gradientTo})` }}
                  />
                  <span className="font-medium text-foreground">{b.name}</span>
                  <span className="text-muted-foreground tabular-nums">{b.value}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">Tap a slice or chip to view projects</p>
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
