import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, PhoneCallIcon, PhoneIncomingIcon, PhoneOutgoingIcon, PhoneOffIcon, UserPlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Call type definition
type Call = {
  id: string;
  contactName: string;
  contactInitials: string;
  phoneNumber: string;
  type: "incoming" | "outgoing" | "missed";
  status: "completed" | "converted" | "cancelled" | "scheduled";
  duration?: number; // in seconds
  date: Date;
  notes?: string;
};

// Sample calls data
const sampleCalls: Call[] = [
  {
    id: "1",
    contactName: "John Smith",
    contactInitials: "JS",
    phoneNumber: "(555) 123-4567",
    type: "incoming",
    status: "completed",
    duration: 320, // 5min 20sec
    date: new Date("2023-05-12T14:30:00"),
    notes: "Discussed service options and pricing.",
  },
  {
    id: "2",
    contactName: "Mary Johnson",
    contactInitials: "MJ",
    phoneNumber: "(555) 234-5678",
    type: "outgoing",
    status: "converted",
    duration: 480, // 8min
    date: new Date("2023-05-12T11:45:00"),
    notes: "Successfully scheduled appointment for next week.",
  },
  {
    id: "3",
    contactName: "Bob Williams",
    contactInitials: "BW",
    phoneNumber: "(555) 345-6789",
    type: "missed",
    status: "cancelled",
    date: new Date("2023-05-12T09:15:00"),
  },
  {
    id: "4",
    contactName: "Sarah Davis",
    contactInitials: "SD",
    phoneNumber: "(555) 456-7890",
    type: "incoming",
    status: "scheduled",
    duration: 240, // 4min
    date: new Date("2023-05-12T16:20:00"),
    notes: "Set up appointment for estimate.",
  },
  {
    id: "5",
    contactName: "Mike Brown",
    contactInitials: "MB",
    phoneNumber: "(555) 567-8901",
    type: "outgoing",
    status: "completed",
    duration: 380, // 6min 20sec
    date: new Date("2023-05-11T13:50:00"),
    notes: "Follow up call regarding service complaint.",
  },
];

const formatDuration = (seconds?: number): string => {
  if (!seconds) return "--";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}m ${remainingSeconds}s`;
};

const CallCard = ({ call }: { call: Call }) => {
  const getCallTypeIcon = () => {
    switch (call.type) {
      case "incoming": return <PhoneIncomingIcon className="h-4 w-4 text-green-500" />;
      case "outgoing": return <PhoneOutgoingIcon className="h-4 w-4 text-blue-500" />;
      case "missed": return <PhoneOffIcon className="h-4 w-4 text-red-500" />;
    }
  };
  
  const getStatusBadge = () => {
    switch (call.status) {
      case "completed": 
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "converted": 
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Converted</Badge>;
      case "cancelled": 
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case "scheduled": 
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Scheduled</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 text-blue-700">{call.contactInitials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="font-medium">{call.contactName}</h3>
              <div className="flex items-center gap-1">
                {getCallTypeIcon()}
                <span className="text-xs text-muted-foreground">
                  {call.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">{call.phoneNumber}</div>
            
            <div className="flex justify-between items-center mt-2">
              <div>{getStatusBadge()}</div>
              <div className="text-xs text-muted-foreground">Duration: {formatDuration(call.duration)}</div>
            </div>
            
            {call.notes && (
              <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-md">
                {call.notes}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Calls = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  // Filter calls based on active tab
  const getFilteredCalls = () => {
    switch (activeTab) {
      case "incoming":
        return sampleCalls.filter(call => call.type === "incoming");
      case "outgoing":
        return sampleCalls.filter(call => call.type === "outgoing");
      case "missed":
        return sampleCalls.filter(call => call.type === "missed");
      case "converted":
        return sampleCalls.filter(call => call.status === "converted");
      default:
        return sampleCalls;
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update the URL without full navigation
    if (tab === "all") {
      navigate("/calls");
    } else {
      navigate(`/calls/${tab}`);
    }
  };

  return (
    <div className="space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Call Tracking
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all your incoming, outgoing, and missed calls
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
        >
          <PhoneCallIcon className="mr-2 h-4 w-4" /> Log New Call
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <PhoneCallIcon className="h-5 w-5 text-blue-500" />
            Call Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="all">All Calls</TabsTrigger>
              <TabsTrigger value="incoming">Incoming</TabsTrigger>
              <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
              <TabsTrigger value="missed">Missed</TabsTrigger>
              <TabsTrigger value="converted">Converted</TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <div className="grid gap-4">
                {getFilteredCalls().map(call => (
                  <CallCard key={call.id} call={call} />
                ))}
              </div>
              
              {getFilteredCalls().length === 0 && (
                <div className="flex flex-col items-center justify-center py-8">
                  <PhoneCallIcon className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-muted-foreground">No calls found for the selected filter.</p>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calls;
