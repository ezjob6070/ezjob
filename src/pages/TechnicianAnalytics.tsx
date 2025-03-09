
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Trophy, TrendingUp, Package, Award, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { initialTechnicians } from "@/data/technicians";
import { Technician } from "@/types/technician";

const TechnicianAnalytics = () => {
  const [technicians] = useState<Technician[]>(initialTechnicians);
  
  // Sort technicians by various metrics to find top performers
  const bestRatedTechnician = [...technicians].sort((a, b) => b.rating - a.rating)[0];
  const mostJobsTechnician = [...technicians].sort((a, b) => b.completedJobs - a.completedJobs)[0];
  const mostRevenueTechnician = [...technicians].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
  
  // Calculate highest and lowest values for scaling
  const highestRevenue = Math.max(...technicians.map(t => t.totalRevenue));
  const highestJobs = Math.max(...technicians.map(t => t.completedJobs));

  // Get top 5 technicians by revenue
  const topTechnicians = [...technicians]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  return (
    <div className="container py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Technician Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Performance analysis and recognition for top-performing technicians
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/technicians">
            <Button variant="outline" size="lg" className="gap-2">
              <List className="h-5 w-5" />
              Technician List
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Top Technician Performers</h2>
        <p className="text-muted-foreground">Recognition and performance analytics for your best technicians</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Best Rated Technician */}
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="h-10 w-10 text-amber-500" />
              <div className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                Top Rated
              </div>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white mr-3 text-lg font-bold">
                {bestRatedTechnician.initials}
              </div>
              <div>
                <h3 className="font-bold text-lg">{bestRatedTechnician.name}</h3>
                <p className="text-amber-700">{bestRatedTechnician.specialty}</p>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="flex items-center gap-1 bg-amber-200 text-amber-800 px-3 py-1 rounded-full">
                <Award className="h-4 w-4" />
                <span className="font-medium">{bestRatedTechnician.rating}/5 Rating</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Jobs Completed */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Package className="h-10 w-10 text-blue-500" />
              <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                Most Jobs
              </div>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3 text-lg font-bold">
                {mostJobsTechnician.initials}
              </div>
              <div>
                <h3 className="font-bold text-lg">{mostJobsTechnician.name}</h3>
                <p className="text-blue-700">{mostJobsTechnician.specialty}</p>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="flex items-center gap-1 bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">{mostJobsTechnician.completedJobs} Jobs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Revenue Generated */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-10 w-10 text-emerald-500" />
              <div className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
                Top Sales
              </div>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white mr-3 text-lg font-bold">
                {mostRevenueTechnician.initials}
              </div>
              <div>
                <h3 className="font-bold text-lg">{mostRevenueTechnician.name}</h3>
                <p className="text-emerald-700">{mostRevenueTechnician.specialty}</p>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="flex items-center gap-1 bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">${mostRevenueTechnician.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Technicians by Revenue Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top 5 Technicians by Revenue</CardTitle>
          <CardDescription>Performance comparison of your highest earning technicians</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topTechnicians.map((tech, index) => (
              <div key={tech.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full bg-${index === 0 ? 'amber' : index === 1 ? 'blue' : 'emerald'}-${600 - index * 100} flex items-center justify-center text-white`}>
                      {tech.initials}
                    </div>
                    <span>{tech.name}</span>
                  </div>
                  <span className="font-medium">${tech.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-blue-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(tech.totalRevenue / highestRevenue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Jobs vs Revenue Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs vs Revenue Comparison</CardTitle>
          <CardDescription>Analyzing job quantity and revenue generation for active technicians</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {technicians
              .filter(tech => tech.status === "active")
              .sort((a, b) => b.completedJobs - a.completedJobs)
              .slice(0, 6)
              .map((tech) => (
                <div key={tech.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                        {tech.initials}
                      </div>
                      <span className="font-medium">{tech.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tech.completedJobs} jobs | ${tech.totalRevenue.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Jobs</span>
                      <span>{Math.round((tech.completedJobs / highestJobs) * 100)}%</span>
                    </div>
                    <Progress value={(tech.completedJobs / highestJobs) * 100} className="h-2 bg-gray-100" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Revenue</span>
                      <span>{Math.round((tech.totalRevenue / highestRevenue) * 100)}%</span>
                    </div>
                    <Progress value={(tech.totalRevenue / highestRevenue) * 100} className="h-2 bg-blue-100" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianAnalytics;
