
import { ArrowDown, ArrowUp, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TasksFiltersProps } from "./TasksTypes";

const TasksFilters = ({
  filterType,
  setFilterType,
  sortOrder,
  setSortOrder,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  tasksCount,
  remindersCount,
  onCreateReminder
}: TasksFiltersProps) => {
  return (
    <div className="mb-4">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input 
            placeholder="Search tasks & reminders..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          
          {onCreateReminder && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onCreateReminder}
                title="Add Reminder"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as "all" | "tasks" | "reminders")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all" className="text-xs">
                All ({tasksCount + remindersCount})
              </TabsTrigger>
              <TabsTrigger value="tasks" className="text-xs flex items-center">
                Tasks ({tasksCount})
              </TabsTrigger>
              <TabsTrigger value="reminders" className="text-xs flex items-center">
                Reminders ({remindersCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                {filterType === "all" ? "All Status" : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("scheduled")}>
                Scheduled
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("in progress")}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("overdue")}>
                Overdue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                {sortOrder === "newest" ? (
                  <><ArrowDown className="h-4 w-4 mr-1" /> Newest</>
                ) : (
                  <><ArrowUp className="h-4 w-4 mr-1" /> Oldest</>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                <ArrowDown className="h-4 w-4 mr-2" /> Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                <ArrowUp className="h-4 w-4 mr-2" /> Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TasksFilters;
