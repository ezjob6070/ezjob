import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Technician } from "@/types/technician";
import { format } from "date-fns";
import { useMemo } from "react";

interface TechnicianCardProps {
  technician: Technician;
  selected: boolean;
  onSelect: (id: string) => void;
  onClick: (id: string) => void;
}

export default function TechnicianCard({
  technician,
  selected,
  onSelect,
  onClick
}: TechnicianCardProps) {
  const revenue = useMemo(() => {
    if (!technician.totalRevenue) return "0";

    return technician.totalRevenue.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }, [technician.totalRevenue]);
  
  return (
    <div
      onClick={() => onClick(technician.id)}
      className={cn(
        "group relative flex flex-col rounded-lg border p-4 hover:cursor-pointer hover:border-2",
        selected ? "border-primary-foreground" : "border-border"
      )}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={() => onSelect(technician.id)}
        className="absolute right-2 top-2 rounded-full border-2 ring-offset-background focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 peer-focus:ring-2"
      />
      <div className="flex items-center">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{technician.initials}</AvatarFallback>
        </Avatar>
        <div className="ml-4 flex flex-col">
          <div className="text-sm font-medium">{technician.name}</div>
          <div className="text-xs text-muted-foreground">
            {technician.specialty}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 text-center gap-2 mt-2">
        <div>
          <div className="text-sm font-medium">{technician.completedJobs}</div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div>
          <div className="text-sm font-medium">{technician.cancelledJobs}</div>
          <div className="text-xs text-muted-foreground">Cancelled</div>
        </div>
        <div>
          <div className="text-sm font-medium">${revenue}</div>
          <div className="text-xs text-muted-foreground">Revenue</div>
        </div>
      </div>
    </div>
  );
}
