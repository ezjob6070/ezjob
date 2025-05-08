
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CompactFilterProps } from "../JobTypes";

const CompactFilterButton: React.FC<CompactFilterProps> = ({ 
  label, 
  count, 
  onClear,
  children 
}) => {
  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm" 
        className={cn(
          "h-9 flex items-center justify-between gap-1",
          count > 0 && "bg-blue-50 text-blue-600 border-blue-200"
        )}
      >
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          <span>{label}</span>
        </div>
        {count > 0 && (
          <Badge variant="secondary" className="ml-1 bg-blue-100">
            {count}
          </Badge>
        )}
      </Button>
      
      {children}
    </div>
  );
};

export default CompactFilterButton;
