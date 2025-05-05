
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
}

const TodaysAppointmentsSection: React.FC<TodaysAppointmentsSectionProps> = ({ 
  appointments 
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

  return (
    <Card className="bg-white shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Today's Appointments</CardTitle>
        <p className="text-xs text-muted-foreground">Scheduled jobs for today</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <div key={index} className="flex gap-3 p-3 border border-gray-100 rounded-md">
              <div className={`mt-1 w-1.5 rounded-full ${getPriorityColor(appointment.priority)} h-12`}></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium">{appointment.client}</h4>
                  <span className={`text-xs bg-${appointment.priority === 'high' ? 'red' : appointment.priority === 'medium' ? 'yellow' : 'green'}-100 text-${appointment.priority === 'high' ? 'red' : appointment.priority === 'medium' ? 'yellow' : 'green'}-700 px-1.5 py-0.5 rounded`}>
                    {appointment.priority}
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
          
          <Button variant="outline" size="sm" className="w-full">
            View Full Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysAppointmentsSection;
