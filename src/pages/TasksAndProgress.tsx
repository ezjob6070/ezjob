
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Calendar as CalendarIcon, Search, Filter, CheckSquare, Clock, List, 
  BarChart, ArrowUp, ArrowDown, PlusCircle, 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Task } from '@/components/calendar/types';
import { Badge } from '@/components/ui/badge';
import TaskCard from '@/components/calendar/components/TaskCard';
import { format, addDays, isToday, isPast, isFuture } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Sample tasks data - in a real app this would come from an API
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Project Proposal',
    description: 'Finalize the proposal document for the new client project',
    status: 'in_progress',
    priority: 'high',
    dueDate: addDays(new Date(), 3),
    client: { name: 'Acme Inc.' },
    assignedTo: 'John Doe',
    progress: 65,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Client Meeting Preparation',
    description: 'Prepare slides and talking points for the upcoming client meeting',
    status: 'pending',
    priority: 'medium',
    dueDate: addDays(new Date(), 1),
    client: { name: 'TechCorp' },
    assignedTo: 'Jane Smith',
    progress: 25,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Budget Review',
    description: 'Review and approve the quarterly budget',
    status: 'completed',
    priority: 'medium',
    dueDate: addDays(new Date(), -2),
    client: { name: 'Internal' },
    assignedTo: 'Michael Johnson',
    progress: 100,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Server Maintenance',
    description: 'Perform regular maintenance on the project servers',
    status: 'pending',
    priority: 'urgent',
    dueDate: addDays(new Date(), 0),
    client: { name: 'Hosting Co.' },
    assignedTo: 'Sarah Williams',
    progress: 0,
    createdAt: new Date().toISOString(),
  },
];

const TasksAndProgress = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'dueDate'>('dueDate');
  
  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, ...updates } : task));
    toast.success('Task updated successfully');
  };

  const handleCreateTask = () => {
    const newTask: Task = {
      id: uuidv4(),
      title: 'New Task',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(),
      client: { name: 'Unassigned' },
      assignedTo: '',
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    
    setTasks([...tasks, newTask]);
    toast.success('New task created');
  };

  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.client?.name && task.client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.assignedTo && task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    
    // Priority filter
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    // Sort by specified order
    if (sortOrder === 'newest') {
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    } else if (sortOrder === 'oldest') {
      return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
    } else {
      // Sort by due date
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB;
    }
  });

  const overdueCount = tasks.filter(task => 
    task.status !== 'completed' && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
  ).length;
  
  const dueTodayCount = tasks.filter(task => 
    task.status !== 'completed' && isToday(new Date(task.dueDate))
  ).length;
  
  const upcomingCount = tasks.filter(task => 
    task.status !== 'completed' && isFuture(new Date(task.dueDate))
  ).length;
  
  const completedCount = tasks.filter(task => task.status === 'completed').length;
  
  const totalCount = tasks.length;
  const completionRate = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  // Status distribution for chart
  const statusCounts = {
    pending: tasks.filter(task => task.status === 'pending').length,
    inProgress: tasks.filter(task => task.status === 'in_progress').length,
    completed: completedCount,
    blocked: tasks.filter(task => task.status === 'blocked').length,
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tasks & Progress</h1>
          <Button onClick={handleCreateTask}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{overdueCount}</div>
                <div className="p-2 bg-red-100 text-red-600 rounded-full">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Due Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{dueTodayCount}</div>
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
                  <CalendarIcon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{upcomingCount}</div>
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                  <List className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{completedCount}</div>
                <div className="p-2 bg-green-100 text-green-600 rounded-full">
                  <CheckSquare className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>Task completion rate across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Completion</span>
                <span className="text-sm font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">{statusCounts.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{statusCounts.blocked}</div>
                <div className="text-sm text-muted-foreground">Blocked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks list with filters */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <div className="flex flex-col md:flex-row gap-4 mt-2">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex-1 md:flex-none">
                      <Filter className="h-4 w-4 mr-2" />
                      {filterStatus === 'all' ? 'All Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1).replace('_', ' ')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterStatus('all')}>All Status</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('pending')}>Pending</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('in_progress')}>In Progress</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('completed')}>Completed</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('blocked')}>Blocked</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex-1 md:flex-none">
                      <Filter className="h-4 w-4 mr-2" />
                      {filterPriority === 'all' ? 'All Priority' : filterPriority.charAt(0).toUpperCase() + filterPriority.slice(1)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterPriority('all')}>All Priority</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority('low')}>Low</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority('medium')}>Medium</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority('high')}>High</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority('urgent')}>Urgent</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex-1 md:flex-none">
                      {sortOrder === 'dueDate' ? (
                        <><CalendarIcon className="h-4 w-4 mr-2" />Due Date</>
                      ) : sortOrder === 'newest' ? (
                        <><ArrowDown className="h-4 w-4 mr-2" />Newest</>
                      ) : (
                        <><ArrowUp className="h-4 w-4 mr-2" />Oldest</>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortOrder('dueDate')}>
                      <CalendarIcon className="h-4 w-4 mr-2" />Sort by Due Date
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder('newest')}>
                      <ArrowDown className="h-4 w-4 mr-2" />Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
                      <ArrowUp className="h-4 w-4 mr-2" />Oldest First
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onTaskUpdate={handleTaskUpdate}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 text-muted-foreground">
                  <CheckSquare className="h-full w-full" />
                </div>
                <h3 className="mt-2 text-lg font-semibold">No tasks found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' ? 
                    'Try adjusting your filters to find what you\'re looking for.' : 
                    'Get started by creating your first task.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TasksAndProgress;
