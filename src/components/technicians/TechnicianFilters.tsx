import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Technician, StaffRole } from "@/types/technician";
import TechnicianSearchBar from "@/components/technicians/filters/TechnicianSearchBar";
import { Calendar as CalendarIcon } from "lucide-react";
import { SortOption } from "@/types/sortOptions";
import RoleFilter from "./filters/RoleFilter";

interface TechnicianFiltersProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  addCategory?: (category: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  technicians: Technician[];
  selectedTechnicians: string[];
  onTechnicianToggle: (techId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  date?: DateRange | undefined;
  setDate?: (date: DateRange | undefined) => void;
  departments?: string[];
  selectedDepartments?: string[];
  toggleDepartment?: (department: string) => void;
  selectedRole?: StaffRole | "all";
  onRoleChange?: (role: StaffRole | "all") => void;
}

const TechnicianFilters = ({
  categories,
  selectedCategories,
  toggleCategory,
  addCategory,
  status,
  onStatusChange,
  technicians,
  selectedTechnicians,
  onTechnicianToggle,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  date,
  setDate,
  departments = [],
  selectedDepartments = [],
  toggleDepartment = () => {},
  selectedRole = "all",
  onRoleChange = () => {},
}: TechnicianFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [showAllTechnicians, setShowAllTechnicians] = useState(false);
  
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 5);
  const visibleDepartments = showAllDepartments ? departments : departments.slice(0, 5);
  const visibleTechnicians = showAllTechnicians ? technicians : technicians.slice(0, 5);

  return (
    <Card>
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-base font-medium">Filters</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-3 grid gap-6">
        {/* Role Filter */}
        <RoleFilter 
          selectedRole={selectedRole} 
          onRoleChange={onRoleChange} 
        />

        {/* Status Filter */}
        <div className="flex flex-col space-y-2">
          <div className="text-sm font-medium">Status</div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={status === "all" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90"
              onClick={() => onStatusChange("all")}
            >
              All
            </Badge>
            <Badge
              variant={status === "active" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90"
              onClick={() => onStatusChange("active")}
            >
              Active
            </Badge>
            <Badge
              variant={status === "inactive" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90"
              onClick={() => onStatusChange("inactive")}
            >
              Inactive
            </Badge>
            <Badge
              variant={status === "onLeave" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90"
              onClick={() => onStatusChange("onLeave")}
            >
              On Leave
            </Badge>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col space-y-2">
          <div className="text-sm font-medium">Categories</div>
          <div className="flex flex-wrap gap-2">
            {visibleCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
            {categories.length > 5 && (
              <Button
                variant="link"
                className="p-0 text-sm"
                onClick={() => setShowAllCategories(!showAllCategories)}
              >
                {showAllCategories ? "Show Less" : "Show All"}
              </Button>
            )}
            {addCategory && (
              <Button
                variant="link"
                className="p-0 text-sm"
                onClick={() => {
                  const newCategory = prompt("Enter new category name:");
                  if (newCategory) {
                    addCategory(newCategory);
                  }
                }}
              >
                Add Category
              </Button>
            )}
          </div>
        </div>

        {/* Department Filter */}
        {departments.length > 0 && (
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium">Departments</div>
            <div className="flex flex-wrap gap-2">
              {visibleDepartments.map((department) => (
                <Badge
                  key={department}
                  variant={selectedDepartments.includes(department) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90"
                  onClick={() => toggleDepartment(department)}
                >
                  {department}
                </Badge>
              ))}
              {departments.length > 5 && (
                <Button
                  variant="link"
                  className="p-0 text-sm"
                  onClick={() => setShowAllDepartments(!showAllDepartments)}
                >
                  {showAllDepartments ? "Show Less" : "Show All"}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Date Range Picker */}
        {setDate && (
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium">Date Range</div>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      `${date.from?.toLocaleDateString()} - ${date.to?.toLocaleDateString()}`
                    ) : (
                      date.from?.toLocaleDateString()
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  pagedNavigation
                  className="border-0 rounded-md"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Sort Options */}
        <div className="flex flex-col space-y-2">
          <div className="text-sm font-medium">Sort By</div>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant={sortOption === "newest" ? "default" : "outline"}
              onClick={() => onSortChange("newest")}
            >
              Newest
            </Button>
            <Button
              variant={sortOption === "oldest" ? "default" : "outline"}
              onClick={() => onSortChange("oldest")}
            >
              Oldest
            </Button>
            <Button
              variant={sortOption === "name-asc" ? "default" : "outline"}
              onClick={() => onSortChange("name-asc")}
            >
              Name (A-Z)
            </Button>
            <Button
              variant={sortOption === "name-desc" ? "default" : "outline"}
              onClick={() => onSortChange("name-desc")}
            >
              Name (Z-A)
            </Button>
            <Button
              variant={sortOption === "revenue-high" ? "default" : "outline"}
              onClick={() => onSortChange("revenue-high")}
            >
              Revenue (High to Low)
            </Button>
            <Button
              variant={sortOption === "revenue-low" ? "default" : "outline"}
              onClick={() => onSortChange("revenue-low")}
            >
              Revenue (Low to High)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianFilters;
