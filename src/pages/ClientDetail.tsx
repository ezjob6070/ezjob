
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeftIcon, MailIcon, PhoneIcon, MapPinIcon, CalendarIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock client data - this would typically come from an API
const clientData = {
  id: "1",
  name: "Alex Johnson",
  company: "Innovate Solutions",
  email: "alex@innovatesolutions.com",
  phone: "+1 (555) 123-4567",
  address: "123 Business Ave, Tech City, CA 94103",
  status: "active" as const,
  initials: "AJ",
  notes: "Meeting scheduled for next quarter planning. Interested in expanding service package.",
  createdAt: new Date("2023-03-15"),
  lastContact: new Date("2023-08-22"),
  paymentStatus: "current" as const,
  paymentAmount: 2500,
  paymentHistory: [
    { id: "p1", amount: 1500, date: new Date("2023-07-15"), status: "paid" },
    { id: "p2", amount: 1500, date: new Date("2023-06-15"), status: "paid" },
    { id: "p3", amount: 1500, date: new Date("2023-05-15"), status: "paid" },
  ]
};

const ClientDetail = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState(clientData.notes);
  
  // In a real app, you would fetch the client data based on the ID
  // For now, we'll use our mock data
  const client = clientData;
  
  if (!client) {
    return <div>Client not found</div>;
  }

  const paymentStatusColors = {
    current: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    overdue: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/clients">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Client Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-blue-600">{client.initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{client.name}</CardTitle>
              <CardDescription>{client.company}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <MailIcon className="h-4 w-4 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <PhoneIcon className="h-4 w-4 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              <span>{client.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>Client since: {client.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <span>Last contact: {client.lastContact.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              <span>Payment Amount: ${client.paymentAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4" />
              <span>
                Payment Status: 
                <Badge variant="outline" className={`ml-2 ${paymentStatusColors[client.paymentStatus]}`}>
                  {client.paymentStatus.charAt(0).toUpperCase() + client.paymentStatus.slice(1)}
                </Badge>
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full justify-between">
              <Button variant="outline">Edit Details</Button>
              <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">Contact</Button>
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="notes">
            <TabsList className="w-full">
              <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
              <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
              <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
              <TabsTrigger value="payments" className="flex-1">Payments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="notes" className="space-y-4 mt-6">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter client notes..."
                className="min-h-[200px]"
              />
              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">Save Notes</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">No recent activity found.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">No documents found.</p>
                </CardContent>
                <CardFooter>
                  <Button className="bg-blue-600 hover:bg-blue-700">Upload Document</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {client.paymentHistory && client.paymentHistory.length > 0 ? (
                    <div className="space-y-4">
                      {client.paymentHistory.map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">${payment.amount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {payment.date.toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No payment history found.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="bg-blue-600 hover:bg-blue-700">Record Payment</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
