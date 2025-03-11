
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User } from "lucide-react";

type ViewingType = {
  property: string;
  client: string;
  agent: string;
  datetime: Date;
  address: string;
};

type UpcomingViewingsCardProps = {
  viewings: ViewingType[];
};

const UpcomingViewingsCard = ({ viewings }: UpcomingViewingsCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
          Upcoming Viewings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {viewings.map((viewing, i) => (
            <div key={i} className="flex items-start p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 mr-3 text-lg font-semibold">
                {viewing.client.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{viewing.property}</div>
                <div className="text-sm text-muted-foreground flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate">{viewing.address}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-y-1 gap-x-3 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>{viewing.client}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{format(viewing.datetime, "MMM d, h:mm a")}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingViewingsCard;
