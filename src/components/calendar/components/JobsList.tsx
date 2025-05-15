
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/job';
import JobCard from './JobCard';
import { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface JobsListProps {
  selectedDate: Date;
  jobsForSelectedDate: Job[];
  onPreviousDay: () => void;
  onNextDay: () => void;
  onJobUpdate?: (jobId: string, updates: Partial<Job>) => void;
  allJobs?: Job[];
}

const JobsList = ({
  selectedDate,
  jobsForSelectedDate,
  onPreviousDay,
  onNextDay,
  onJobUpdate,
  allJobs
}: JobsListProps) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const filterJobs = () => {
    let filtered = [...jobsForSelectedDate];
    
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (job.clientName && job.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(job => job.status === filterStatus);
    }
    
    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      return sortOrder === 'newest' 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime();
    });
    
    return filtered;
  };

  const filteredJobs = filterJobs();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreviousDay}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-medium">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNextDay}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-4">
        <div className="flex flex-col gap-3">
          <Input 
            placeholder="Search jobs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  {filterStatus === 'all' ? 'All Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus('pending')}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('scheduled')}>
                  Scheduled
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('in-progress')}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('cancelled')}>
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  {sortOrder === 'newest' ? (
                    <><ArrowDown className="h-4 w-4 mr-1" /> Newest</>
                  ) : (
                    <><ArrowUp className="h-4 w-4 mr-1" /> Oldest</>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortOrder('newest')}>
                  <ArrowDown className="h-4 w-4 mr-2" /> Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
                  <ArrowUp className="h-4 w-4 mr-2" /> Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Jobs ({filteredJobs.length})</h3>
        
        {filteredJobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No jobs scheduled for this day.</p>
        ) : (
          <div className="space-y-2">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onJobUpdate={onJobUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList;
