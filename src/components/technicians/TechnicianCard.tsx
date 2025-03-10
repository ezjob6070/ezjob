
import React from "react";
import { Technician } from "@/types/technician";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, User, Pencil, Check, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TechnicianCardProps {
  technician: Technician;
  onEdit: () => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

const TechnicianCard: React.FC<TechnicianCardProps> = ({ 
  technician, 
  onEdit,
  isSelected = false,
  onToggleSelect
}) => {
  return (
    <Card className={`overflow-hidden ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}>
      <CardContent className="p-0">
        <div className="p-5 flex items-start">
          {/* Avatar and Name Section */}
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                {technician.imageUrl && <AvatarImage src={technician.imageUrl} alt={technician.name} />}
                <AvatarFallback className="bg-indigo-100 text-indigo-600">
                  {technician.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{technician.name}</h3>
                <div className="flex items-center mt-1">
                  <Badge variant={technician.status === "active" ? "success" : "destructive"} className="text-xs">
                    {technician.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground ml-2">ID: {technician.id}</span>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                <span>{technician.specialty}</span>
              </div>
              {technician.email && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{technician.email}</span>
                </div>
              )}
              {technician.phone && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{technician.phone}</span>
                </div>
              )}
              {technician.address && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{technician.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit} className="ml-2">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            
            {onToggleSelect && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onToggleSelect}
                className="ml-2 rounded-full w-8 h-8 p-0 flex items-center justify-center border-2"
              >
                {isSelected ? (
                  <Circle className="h-5 w-5 fill-primary stroke-primary" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
                <span className="sr-only">{isSelected ? 'Deselect' : 'Select'}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="bg-muted px-5 py-3 grid grid-cols-3 gap-2 text-center border-t">
          <div>
            <p className="text-sm font-medium">{technician.completedJobs}</p>
            <p className="text-xs text-muted-foreground">Jobs</p>
          </div>
          <div>
            <p className="text-sm font-medium">${technician.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </div>
          <div>
            <p className="text-sm font-medium">{technician.rating}/5</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianCard;
