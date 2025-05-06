
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";

const SERVICE_CATEGORIES = [
  "All Services",
  "Plumbing",
  "HVAC",
  "Electrical",
  "Cleaning",
  "Landscaping",
  "Pest Control",
  "Roofing",
  "Painting",
  "Flooring",
  "General Repair"
];

export function ServiceCategorySelector() {
  const { serviceCategory, setServiceCategory } = useGlobalState();
  const [open, setOpen] = useState(false);
  
  return (
    <div className="px-3 py-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between bg-blue-700/20 border-blue-600/30 text-white hover:bg-blue-700/30 hover:text-white"
          >
            {serviceCategory || "All Services"}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          className="w-[200px] bg-blue-800 border-blue-700 text-white"
        >
          {SERVICE_CATEGORIES.map((category) => (
            <DropdownMenuItem
              key={category}
              className={cn(
                "flex items-center gap-2 hover:bg-blue-700 focus:bg-blue-700",
                serviceCategory === category && "bg-blue-700"
              )}
              onClick={() => {
                setServiceCategory(category);
                setOpen(false);
              }}
            >
              <div className="flex-1">{category}</div>
              {serviceCategory === category && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ServiceCategorySelector;
