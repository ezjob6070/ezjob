
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Technician } from "@/types/technician";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface TechnicianCardProps {
  technician: Technician;
  onEdit: (technician: Technician) => void;
}

const TechnicianCard = ({ technician, onEdit }: TechnicianCardProps) => {
  const {
    name,
    email,
    phone,
    specialty,
    status,
    paymentType,
    paymentRate,
    completedJobs,
    totalRevenue,
    rating,
    initials,
  } = technician;

  return (
    <Card className="h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-primary-foreground mr-3">
              {initials}
            </div>
            <div>
              <h3 className="font-medium">{name}</h3>
              <Badge variant={status === "active" ? "outline" : "destructive"}>
                {status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(technician)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="truncate">{email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p>{phone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Specialty</p>
            <p>{specialty}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Payment</p>
            <p>
              {paymentType === "percentage"
                ? `${paymentRate}% of job`
                : `${formatCurrency(paymentRate)} flat`}
            </p>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t">
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Jobs</p>
            <p className="font-medium text-sky-600">{completedJobs}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Revenue</p>
            <p className="font-medium text-emerald-600">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Rating</p>
            <p className="font-medium text-amber-500">{rating}/5</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianCard;
