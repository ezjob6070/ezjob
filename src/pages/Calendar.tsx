
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const Calendar = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 shadow-sm rounded-lg -mx-4 -mt-4 md:-mx-6 md:-mt-6 px-5 pt-6 pb-4 md:px-7 md:pt-7 md:pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800">Calendar</h1>
            <p className="text-gray-600 text-sm">View and manage your schedule</p>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="h-80 flex items-center justify-center text-gray-500">
            Calendar view coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
