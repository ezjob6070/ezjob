
import React, { useState } from "react";
import { Check, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export interface Entity {
  id: string;
  name: string;
}

interface EntityFilterProps {
  entities: Entity[];
  selectedEntityIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  title: string;
  buttonText: string;
}

const EntityFilter = ({
  entities,
  selectedEntityIds,
  onSelectionChange,
  title,
  buttonText,
}: EntityFilterProps) => {
  const [open, setOpen] = useState(false);
  const [localSelection, setLocalSelection] = useState<string[]>(selectedEntityIds);

  const handleSelectionChange = (entityId: string, checked: boolean) => {
    if (checked) {
      setLocalSelection([...localSelection, entityId]);
    } else {
      setLocalSelection(localSelection.filter(id => id !== entityId));
    }
  };

  const handleSelectAll = () => {
    setLocalSelection(entities.map(entity => entity.id));
  };

  const handleClearAll = () => {
    setLocalSelection([]);
  };

  const handleApply = () => {
    onSelectionChange(localSelection);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          {buttonText} {selectedEntityIds.length > 0 && `(${selectedEntityIds.length})`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{title}</h4>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={handleSelectAll}
              >
                Select All
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={handleClearAll}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
        <Separator className="my-2" />
        <ScrollArea className="h-[200px] px-4">
          <div className="space-y-2 py-2">
            {entities.map((entity) => (
              <div key={entity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`entity-${entity.id}`}
                  checked={localSelection.includes(entity.id)}
                  onCheckedChange={(checked) => 
                    handleSelectionChange(entity.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={`entity-${entity.id}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {entity.name}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Separator className="my-2" />
        <div className="p-4 pt-0 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="w-[48%]"
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleApply}
            className="w-[48%]"
          >
            <Check className="h-4 w-4 mr-1" /> Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EntityFilter;
