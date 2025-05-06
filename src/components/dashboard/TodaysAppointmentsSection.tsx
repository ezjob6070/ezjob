
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Appointment {
  client: string;
  priority: 'high' | 'medium' | 'low';
  time: string;
  type: string;
  address: string;
}

interface TodaysAppointmentsSectionProps {
  appointments: Appointment[];
  dateRangeText?: string;
}

const TodaysAppointmentsSection: React.FC<TodaysAppointmentsSectionProps> = ({ 
  appointments,
  dateRangeText = "Custom Range"
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return 'normal';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-700';
      case 'medium':
        return 'text-yellow-700';
      case 'low':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <Card className="bg-white shadow-sm h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Today's Appointments</CardTitle>
        <p className="text-xs text-muted-foreground">Scheduled jobs for today • {dateRangeText}</p>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-3">
          {appointments.map((appointment, index) => (
            <div key={index} className="flex gap-2 p-2 border border-gray-100 rounded-md">
              <div className={`mt-1 w-1.5 rounded-full ${getPriorityColor(appointment.priority)} h-12`}></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium">{appointment.client}</h4>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${getPriorityBg(appointment.priority)}`}>
                    {getPriorityText(appointment.priority)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{appointment.time} - {appointment.type}</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {appointment.address}
                </div>
              </div>
            </div>
          ))}
          
          <Button variant="outline" size="sm" className="w-full mt-2">
            View Full Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysAppointmentsSection;
