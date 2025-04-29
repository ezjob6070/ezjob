
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHatIcon, Construction, Truck } from "lucide-react";

export default function Projects() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Construction Projects</h1>
          <p className="text-muted-foreground">Manage and track all your construction projects</p>
        </div>
        <Button className="gap-2">
          <Construction className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>City Center Tower</CardTitle>
                <div className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded">In Progress</div>
              </div>
              <CardDescription>Commercial Building - Phase {i}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium">{30 * i}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${30 * i}%` }}></div>
                </div>
                <div className="flex justify-between pt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <HardHatIcon className="h-3.5 w-3.5" />
                    <span>{5 + i} Workers</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Truck className="h-3.5 w-3.5" />
                    <span>{2 + i} Vehicles</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
