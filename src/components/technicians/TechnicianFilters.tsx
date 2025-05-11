// Assuming this file exists and we're fixing the missing setter functions
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { departments, categories } from "@/data/technicians"
import { Filter } from "lucide-react"

const TechnicianFilters = () => {
  // Define the missing state setters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const resetFilters = () => {
    // Fix the references to the setters
    setSelectedCategories([]);
    setSelectedDepartments([]);
    setSearchTerm("");
  };
  
  const handleCategoryChange = (category: string) => {
    // Fix the reference to the setter
    setSelectedCategories(prevCategories => 
      prevCategories.includes(category)
        ? prevCategories.filter(c => c !== category)
        : [...prevCategories, category]
    );
  };
  
  const handleDepartmentChange = (department: string) => {
    // Fix the reference to the setter
    setSelectedDepartments(prevDepartments => 
      prevDepartments.includes(department)
        ? prevDepartments.filter(d => d !== department)
        : [...prevDepartments, department]
    );
  };
  
  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDepartments = departments.filter(department =>
    department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>
          Filter technicians based on categories and departments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
                <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
                  Clear
                </Button>
              </div>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="flex flex-col space-y-1">
                  {filteredCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
          <Separator />
          <AccordionItem value="departments">
            <AccordionTrigger>Departments</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
                <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
                  Clear
                </Button>
              </div>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="flex flex-col space-y-1">
                  {filteredDepartments.map((department) => (
                    <div key={department} className="flex items-center space-x-2">
                      <Checkbox
                        id={`department-${department}`}
                        checked={selectedDepartments.includes(department)}
                        onCheckedChange={() => handleDepartmentChange(department)}
                      />
                      <Label htmlFor={`department-${department}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                        {department}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button variant="outline" className="w-full" onClick={resetFilters}>
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default TechnicianFilters;
