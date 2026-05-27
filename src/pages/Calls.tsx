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
  UserPlusIcon,
  MessageSquareIcon,
  SendIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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

// Format call duration
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

const CallCard = ({ call, onText }: { call: Call; onText: (call: Call) => void }) => {
  const { toast } = useToast();
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

  const handleCall = () => {
    window.location.href = `tel:${call.phoneNumber.replace(/[^\d+]/g, '')}`;
    toast({ title: "Calling", description: `Dialing ${call.contactName}...` });
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

            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-700 border-green-200 hover:bg-green-50"
                onClick={handleCall}
              >
                <PhoneCallIcon className="h-3.5 w-3.5 mr-1.5" /> Call
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-blue-700 border-blue-200 hover:bg-blue-50"
                onClick={() => onText(call)}
              >
                <MessageSquareIcon className="h-3.5 w-3.5 mr-1.5" /> Text
              </Button>
            </div>
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
  const [textTarget, setTextTarget] = useState<Call | null>(null);
  const [textMessage, setTextMessage] = useState("");
  const { toast } = useToast();

  const openTextDialog = (call: Call) => {
    setTextTarget(call);
    setTextMessage("");
  };

  const handleSendText = () => {
    if (!textTarget || !textMessage.trim()) return;
    toast({
      title: "Message sent",
      description: `Text sent to ${textTarget.contactName} (${textTarget.phoneNumber})`,
    });
    setTextTarget(null);
    setTextMessage("");
  };
  
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
    navigate(`/calls${tab === "all" ? "" : `/${tab}`}`, { replace: true });
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

  const [mode, setMode] = useState<"calls" | "texts">("calls");

  // Build mock conversations from contacts
  const conversations = React.useMemo(() => {
    const seen = new Map<string, Call>();
    calls.forEach((c) => {
      if (!seen.has(c.phoneNumber)) seen.set(c.phoneNumber, c);
    });
    return Array.from(seen.values());
  }, [calls]);

  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const activeConvo = conversations.find((c) => c.id === activeConvoId) ?? conversations[0];
  const [convoDraft, setConvoDraft] = useState("");

  const sendConvoMessage = () => {
    if (!activeConvo || !convoDraft.trim()) return;
    toast({
      title: "Message sent",
      description: `To ${activeConvo.contactName}`,
    });
    setConvoDraft("");
  };

  return (
    <div className="space-y-6 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            {mode === "calls" ? "Call Tracking" : "Customer Messaging"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === "calls"
              ? "Track and manage all your incoming, outgoing, and not answered calls"
              : "Send and receive text messages with your customers"}
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
          onClick={() => mode === "calls" ? setIsLogCallModalOpen(true) : openTextDialog(conversations[0])}
        >
          {mode === "calls" ? (
            <><PhoneCallIcon className="mr-2 h-4 w-4" /> Log New Call</>
          ) : (
            <><SendIcon className="mr-2 h-4 w-4" /> New Message</>
          )}
        </Button>
      </div>

      {/* Top mode switcher: Calls vs Texts */}
      <div className="inline-flex rounded-xl bg-gray-100 p-1 shadow-sm">
        <button
          onClick={() => setMode("calls")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === "calls"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <PhoneCallIcon className="h-4 w-4" />
          Calls
          <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 border-blue-200">
            {calls.length}
          </Badge>
        </button>
        <button
          onClick={() => setMode("texts")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === "texts"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <MessageSquareIcon className="h-4 w-4" />
          Texts
          <Badge variant="outline" className="ml-1 bg-green-50 text-green-700 border-green-200">
            {conversations.length}
          </Badge>
        </button>
      </div>

      {mode === "texts" ? (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] min-h-[520px]">
            {/* Conversations list */}
            <div className="border-r bg-gray-50/50">
              <div className="p-3 border-b bg-white">
                <Input placeholder="Search conversations..." className="h-9" />
              </div>
              <div className="divide-y max-h-[520px] overflow-y-auto">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveConvoId(c.id)}
                    className={`w-full text-left p-3 flex items-center gap-3 hover:bg-white transition-colors ${
                      activeConvo?.id === c.id ? "bg-white shadow-sm" : ""
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700">{c.contactInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm truncate">{c.contactName}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {c.date.toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {c.notes || c.phoneNumber}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat pane */}
            <div className="flex flex-col">
              {activeConvo ? (
                <>
                  <div className="flex items-center justify-between p-4 border-b bg-white">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-700">{activeConvo.contactInitials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{activeConvo.contactName}</h3>
                        <p className="text-xs text-muted-foreground">{activeConvo.phoneNumber}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-700 border-green-200 hover:bg-green-50"
                      onClick={() => window.location.href = `tel:${activeConvo.phoneNumber.replace(/[^\d+]/g, '')}`}
                    >
                      <PhoneCallIcon className="h-3.5 w-3.5 mr-1.5" /> Call
                    </Button>
                  </div>

                  <div className="flex-1 p-4 space-y-3 bg-gray-50/40 overflow-y-auto">
                    <div className="flex justify-start">
                      <div className="max-w-[70%] bg-white border rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm">
                        <p className="text-sm">{activeConvo.notes || "Hi, I had a quick question about my appointment."}</p>
                        <span className="text-[10px] text-muted-foreground mt-1 block">
                          {activeConvo.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[70%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 shadow-sm">
                        <p className="text-sm">Thanks for reaching out! How can we help?</p>
                        <span className="text-[10px] text-blue-100 mt-1 block">Just now</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border-t bg-white flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={convoDraft}
                      onChange={(e) => setConvoDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendConvoMessage()}
                    />
                    <Button
                      onClick={sendConvoMessage}
                      disabled={!convoDraft.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Select a conversation to start texting
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : (
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
                  <CallCard key={call.id} call={call} onText={openTextDialog} />
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
                  <CallCard key={call.id} call={call} onText={openTextDialog} />
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
                  <CallCard key={call.id} call={call} onText={openTextDialog} />
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
                  <CallCard key={call.id} call={call} onText={openTextDialog} />
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
                  <CallCard key={call.id} call={call} onText={openTextDialog} />
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
      )}
      
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

      {/* Text Message Dialog */}
      <Dialog open={!!textTarget} onOpenChange={(open) => !open && setTextTarget(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquareIcon className="h-5 w-5 text-blue-600" />
              Text {textTarget?.contactName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="text-sm text-muted-foreground">
              To: <span className="font-medium text-foreground">{textTarget?.phoneNumber}</span>
            </div>
            <Textarea
              placeholder="Type your message to the customer..."
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              rows={5}
            />
            <div className="flex flex-wrap gap-2">
              {[
                "Hi, this is a follow-up regarding your service request.",
                "Your technician is on the way.",
                "Thanks for choosing us! Let us know if you need anything else.",
              ].map((tpl) => (
                <Button
                  key={tpl}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setTextMessage(tpl)}
                >
                  {tpl.length > 32 ? tpl.slice(0, 32) + "…" : tpl}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTextTarget(null)}>Cancel</Button>
            <Button
              onClick={handleSendText}
              disabled={!textMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <SendIcon className="h-4 w-4 mr-2" /> Send Text
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calls;
