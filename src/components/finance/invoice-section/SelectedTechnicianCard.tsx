
import React from "react";
import { Technician } from "@/types/technician";
import { Card, CardContent } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface SelectedTechnicianCardProps {
  technician: Technician;
  dateRange?: DateRange;
}

const SelectedTechnicianCard: React.FC<SelectedTechnicianCardProps> = ({
  technician,
  dateRange
}) => {
  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 text-sm">
              {technician.initials}
            </div>
            <div>
              <h3 className="font-medium">{technician.name}</h3>
              <p className="text-sm text-muted-foreground">{technician.specialty}</p>
            </div>
          </div>
          {dateRange?.from && dateRange?.to && (
            <div className="text-sm text-right">
              <div className="font-medium">Selected Period:</div>
              <div>{format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedTechnicianCard;
