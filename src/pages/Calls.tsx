
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, PhoneCallIcon, PhoneIncomingIcon, PhoneOutgoingIcon, PhoneOffIcon, UserPlusIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  
  // Set the active tab based on the location state or URL path
  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    } else if (location.pathname.includes("/calls/")) {
      const path = location.pathname.split("/calls/")[1];
      if (["incoming", "outgoing", "missed", "converted"].includes(path)) {
        setActiveTab(path);
      }
    }
  }, [location]);

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
      navigate("/calls", { replace: true });
    } else {
      navigate(`/calls/${tab}`, { replace: true });
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

      {/* Make the tabs more prominent since they're the main navigation now */}
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 w-full mb-6 border-b">
          <TabsTrigger value="all" className="text-base py-3">All Calls</TabsTrigger>
          <TabsTrigger value="incoming" className="text-base py-3">
            <PhoneIncomingIcon className="h-4 w-4 mr-2 text-green-500" />
            Incoming
          </TabsTrigger>
          <TabsTrigger value="outgoing" className="text-base py-3">
            <PhoneOutgoingIcon className="h-4 w-4 mr-2 text-blue-500" />
            Outgoing
          </TabsTrigger>
          <TabsTrigger value="missed" className="text-base py-3">
            <PhoneOffIcon className="h-4 w-4 mr-2 text-red-500" />
            Missed
          </TabsTrigger>
          <TabsTrigger value="converted" className="text-base py-3">
            <UserPlusIcon className="h-4 w-4 mr-2 text-amber-500" />
            Converted
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <PhoneCallIcon className="h-5 w-5 text-blue-500" />
                All Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {getFilteredCalls().map(call => (
                  <CallCard key={call.id} call={call} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incoming">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <PhoneIncomingIcon className="h-5 w-5 text-green-500" />
                Incoming Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {getFilteredCalls().map(call => (
                  <CallCard key={call.id} call={call} />
                ))}
                
                {getFilteredCalls().length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <PhoneIncomingIcon className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-muted-foreground">No incoming calls found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outgoing">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <PhoneOutgoingIcon className="h-5 w-5 text-blue-500" />
                Outgoing Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {getFilteredCalls().map(call => (
                  <CallCard key={call.id} call={call} />
                ))}
                
                {getFilteredCalls().length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <PhoneOutgoingIcon className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-muted-foreground">No outgoing calls found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missed">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <PhoneOffIcon className="h-5 w-5 text-red-500" />
                Missed Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {getFilteredCalls().map(call => (
                  <CallCard key={call.id} call={call} />
                ))}
                
                {getFilteredCalls().length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <PhoneOffIcon className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-muted-foreground">No missed calls found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="converted">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlusIcon className="h-5 w-5 text-amber-500" />
                Converted Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {getFilteredCalls().map(call => (
                  <CallCard key={call.id} call={call} />
                ))}
                
                {getFilteredCalls().length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <UserPlusIcon className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-muted-foreground">No converted calls found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calls;
