
import { useState } from 'react';
import { 
  Users, 
  UserRoundIcon, 
  BriefcaseIcon, 
  PhoneIcon,
  CalendarIcon,
  TrendingUpIcon,
  MessageSquareIcon,
  ClipboardCheckIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMetricCard from "@/components/DashboardMetricCard";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const GeneralDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="space-y-6">
      <DashboardHeader 
        activeTab="dashboard" 
        onTabChange={() => {}} 
      />
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          title="Total Contacts"
          value="1,284"
          icon={<Users className="h-4 w-4 text-blue-600" />}
          trend={{ value: "+12% this month", isPositive: true }}
          description="Active contacts in your CRM"
        />
        
        <DashboardMetricCard
          title="Active Employees"
          value="32"
          icon={<UserRoundIcon className="h-4 w-4 text-green-600" />}
          trend={{ value: "+3 this month", isPositive: true }}
          description="Currently employed staff"
          onClick={() => window.location.href = "/employed"}
        />
        
        <DashboardMetricCard
          title="Active Projects"
          value="16"
          icon={<BriefcaseIcon className="h-4 w-4 text-purple-600" />}
          trend={{ value: "4 due this week", isPositive: false }}
          description="Ongoing project activities"
        />
        
        <DashboardMetricCard
          title="Support Tickets"
          value="28"
          icon={<PhoneIcon className="h-4 w-4 text-orange-600" />}
          trend={{ value: "8 requiring attention", isPositive: false }}
          description="Open customer support tickets"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-100 p-2">
                      <MessageSquareIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New message from John Doe</p>
                      <p className="text-xs text-muted-foreground">10 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green-100 p-2">
                      <ClipboardCheckIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Website redesign project completed</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-orange-100 p-2">
                      <UserRoundIcon className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New employee onboarded</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-purple-100 p-2">
                      <TrendingUpIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Monthly financial report available</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-indigo-100 p-2">
                      <CalendarIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Team Meeting</p>
                      <p className="text-xs text-muted-foreground">Today, 2:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-indigo-100 p-2">
                      <CalendarIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Client Presentation</p>
                      <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-indigo-100 p-2">
                      <CalendarIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Product Launch</p>
                      <p className="text-xs text-muted-foreground">May 5, 2025</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-indigo-100 p-2">
                      <CalendarIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Quarterly Review</p>
                      <p className="text-xs text-muted-foreground">May 10, 2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="employees">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Employee Overview</CardTitle>
              <Button asChild size="sm">
                <Link to="/employed">View All Employees</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                  title="Total Employees" 
                  value="32" 
                  icon={<Users size={18} />} 
                  description="Across all departments" 
                />
                <StatCard 
                  title="Active" 
                  value="26" 
                  icon={<UserRoundIcon size={18} />} 
                  description="Currently working" 
                />
                <StatCard 
                  title="On Leave" 
                  value="3" 
                  icon={<UserRoundIcon size={18} />} 
                  description="Temporary absence" 
                />
                <StatCard 
                  title="New Hires" 
                  value="4" 
                  icon={<UserRoundIcon size={18} />} 
                  description="Last 30 days" 
                />
              </div>
              <div className="mt-6 flex justify-center">
                <Button asChild variant="outline">
                  <Link to="/employed">Manage Employees</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Contact Management</CardTitle>
              <Button asChild size="sm">
                <Link to="/contacts">View All Contacts</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="text-lg font-medium">Contacts</h3>
                  <div className="mt-2 text-3xl font-bold">1,284</div>
                  <p className="text-sm text-muted-foreground">Total contacts</p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="text-lg font-medium">Recent Activity</h3>
                  <div className="mt-2 text-3xl font-bold">56</div>
                  <p className="text-sm text-muted-foreground">Interactions this week</p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="text-lg font-medium">Follow-up</h3>
                  <div className="mt-2 text-3xl font-bold">28</div>
                  <p className="text-sm text-muted-foreground">Pending follow-ups</p>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <Button asChild variant="outline">
                  <Link to="/contacts">Manage Contacts</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-start gap-4 border-b pb-4 last:border-0">
                    <div className="rounded-full bg-blue-100 p-2">
                      <MessageSquareIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Activity {item}</p>
                      <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item} hour{item > 1 ? 's' : ''} ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeneralDashboard;
