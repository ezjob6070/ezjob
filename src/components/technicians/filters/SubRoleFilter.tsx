
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TechnicianSubRoles, DEFAULT_SUB_ROLES } from "@/types/technician";

interface SubRoleFilterProps {
  selectedSubRole: string | null;
  onSubRoleChange: (subRole: string | null) => void;
  parentRole: string;
}

const SubRoleFilter: React.FC<SubRoleFilterProps> = ({
  selectedSubRole,
  onSubRoleChange,
  parentRole = "technician"
}) => {
  const [open, setOpen] = useState(false);
  const [customRoles, setCustomRoles] = useState<TechnicianSubRoles>(DEFAULT_SUB_ROLES);

  useEffect(() => {
    const savedRoles = localStorage.getItem('customRoles');
    if (savedRoles) {
      try {
        setCustomRoles(JSON.parse(savedRoles));
      } catch (e) {
        console.error('Failed to parse saved roles:', e);
      }
    }
  }, []);

  // Get the appropriate subRoles based on the parentRole
  const getSubRoles = () => {
    const roleKey = parentRole === 'all' ? 'technician' : parentRole;
    return customRoles[roleKey as keyof TechnicianSubRoles] || DEFAULT_SUB_ROLES[roleKey as keyof TechnicianSubRoles];
  };

  const subRoles = getSubRoles();

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-9 px-3 text-sm"
          >
            {selectedSubRole
              ? `Specialty: ${selectedSubRole}`
              : "Filter by Specialty"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search specialties..." />
            <CommandEmpty>No specialty found.</CommandEmpty>
            <CommandGroup>
              {subRoles.map((subRole) => (
                <CommandItem
                  key={subRole}
                  value={subRole}
                  onSelect={() => {
                    onSubRoleChange(selectedSubRole === subRole ? null : subRole);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSubRole === subRole ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {subRole}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedSubRole && (
        <Badge 
          variant="secondary"
          className="gap-1 cursor-pointer"
          onClick={() => onSubRoleChange(null)}
        >
          {selectedSubRole}
          <span className="text-xs">×</span>
        </Badge>
      )}
    </div>
  );
};

export default SubRoleFilter;
