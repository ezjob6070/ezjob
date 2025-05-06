
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PlusIcon, 
  PhoneCallIcon, 
  PhoneIncomingIcon, 
  PhoneOutgoingIcon, 
  PhoneOffIcon, 
  UserPlusIcon 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Call type definition
type Call = {
  id: string;
  contactName: string;
  contactInitials: string;
  phoneNumber: string;
  type: "incoming" | "outgoing" | "not_answered";
  status: "completed" | "converted" | "cancelled" | "scheduled" | "not_relevant";
  duration?: number; // in seconds
  date: Date;
  notes?: string;
  jobSource?: string; // Added job source field
};

// Sample calls data - Updated "missed" to "not_answered"
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
    jobSource: "Google Ads",
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
    jobSource: "Referral",
  },
  {
    id: "3",
    contactName: "Bob Williams",
    contactInitials: "BW",
    phoneNumber: "(555) 345-6789",
    type: "not_answered",
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
    jobSource: "Website",
  },
  {
    id: "5",
    contactName: "Mike Brown",
    contactInitials: "MB",
    phoneNumber: "(555) 567-8901",
    type: "outgoing",
    status: "not_relevant",
    duration: 380, // 6min 20sec
    date: new Date("2023-05-11T13:50:00"),
    notes: "Wrong number, not a potential client.",
  },
];

// Sample job sources
const jobSources = [
  "Website",
  "Google Ads",
  "Facebook Ads",
  "Referral",
  "Direct Call",
  "Email Campaign",
  "Trade Show",
  "Other"
];

const formatDuration = (seconds?: number): string => {
  if (!seconds) return "--";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}m ${remainingSeconds}s`;
};

// Call logging form type
type CallFormValues = {
  contactName: string;
  phoneNumber: string;
  type: "incoming" | "outgoing" | "not_answered";
  status: "completed" | "converted" | "cancelled" | "scheduled" | "not_relevant";
  notes: string;
  duration: string;
  jobSource?: string; // Added job source field
};

const CallCard = ({ call }: { call: Call }) => {
  const getCallTypeIcon = () => {
    switch (call.type) {
      case "incoming": return <PhoneIncomingIcon className="h-4 w-4 text-green-500" />;
      case "outgoing": return <PhoneOutgoingIcon className="h-4 w-4 text-blue-500" />;
      case "not_answered": return <PhoneOffIcon className="h-4 w-4 text-red-500" />;
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
      case "not_relevant":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Not Relevant</Badge>;
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
            
            {(call.notes || call.jobSource) && (
              <div className="mt-2 text-xs">
                {call.jobSource && (
                  <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-sm mb-1 inline-block">
                    Source: {call.jobSource}
                  </div>
                )}
                {call.notes && (
                  <div className="text-gray-600 bg-gray-50 p-2 rounded-md">
                    {call.notes}
                  </div>
                )}
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
  const [calls, setCalls] = useState<Call[]>(sampleCalls);
  const [isLogCallModalOpen, setIsLogCallModalOpen] = useState(false);
  
  // Form for logging a new call
  const form = useForm<CallFormValues>({
    defaultValues: {
      contactName: "",
      phoneNumber: "",
      type: "incoming",
      status: "completed",
      notes: "",
      duration: "0",
      jobSource: "",
    },
  });
  
  // Set the active tab based on the location state or URL path
  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    } else if (location.pathname.includes("/calls/")) {
      const path = location.pathname.split("/calls/")[1];
      if (["incoming", "outgoing", "not_answered", "converted"].includes(path)) {
        setActiveTab(path);
      }
    }
  }, [location]);

  // Filter calls based on active tab
  const getFilteredCalls = () => {
    switch (activeTab) {
      case "incoming":
        return calls.filter(call => call.type === "incoming");
      case "outgoing":
        return calls.filter(call => call.type === "outgoing");
      case "not_answered":
        return calls.filter(call => call.type === "not_answered");
      case "converted":
        return calls.filter(call => call.status === "converted");
      default:
        return calls;
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
  
  // Handle call logging
  const handleLogCall = (data: CallFormValues) => {
    // Convert duration from minutes to seconds
    const durationInSeconds = parseInt(data.duration) * 60;
    
    // Create a new call object
    const newCall: Call = {
      id: (calls.length + 1).toString(),
      contactName: data.contactName,
      contactInitials: data.contactName.split(' ').map(n => n[0]).join('').toUpperCase(),
      phoneNumber: data.phoneNumber,
      type: data.type,
      status: data.status,
      date: new Date(),
      notes: data.notes,
      duration: durationInSeconds,
    };
    
    // Add job source if selected
    if (data.jobSource) {
      newCall.jobSource = data.jobSource;
    }
    
    // Add the new call to the calls list
    setCalls(prevCalls => [newCall, ...prevCalls]);
    
    // Close the modal
    setIsLogCallModalOpen(false);
    
    // Reset the form
    form.reset();
  };

  return (
    <div className="space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Call Tracking
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all your incoming, outgoing, and not answered calls
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
          onClick={() => setIsLogCallModalOpen(true)}
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
          <TabsTrigger value="not_answered" className="text-base py-3">
            <PhoneOffIcon className="h-4 w-4 mr-2 text-red-500" />
            Not Answered
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

        <TabsContent value="not_answered">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <PhoneOffIcon className="h-5 w-5 text-red-500" />
                Not Answered Calls
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
                    <p className="text-muted-foreground">No not answered calls found.</p>
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
      
      {/* Log Call Modal */}
      <Dialog open={isLogCallModalOpen} onOpenChange={setIsLogCallModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Log New Call</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(handleLogCall)}>
            <div className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Call Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select call type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="incoming">Incoming</SelectItem>
                          <SelectItem value="outgoing">Outgoing</SelectItem>
                          <SelectItem value="not_answered">Not Answered</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Call Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select call status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="not_relevant">Not Relevant</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Job Source field (optional) */}
              <FormField
                control={form.control}
                name="jobSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Source (Optional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a job source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobSources.map(source => (
                          <SelectItem key={source} value={source}>{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Where did this call originate from?
                    </p>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="1" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any notes about the call here..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsLogCallModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Call</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calls;
