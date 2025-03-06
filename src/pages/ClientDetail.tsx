
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeftIcon, 
  PhoneIcon, 
  MailIcon, 
  Building2Icon, 
  MapPinIcon, 
  PencilIcon, 
  ClipboardListIcon, 
  CalendarIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TasksList from "@/components/TasksList";

const clients = [
  {
    id: "1",
    name: "John Doe",
    company: "Acme Corp",
    email: "john.doe@acme.com",
    phone: "(555) 123-4567",
    address: "123 Business Ave, New York, NY 10001",
    status: "active" as const,
    initials: "JD",
    notes: "Key decision maker. Prefers email communication. Interested in premium services.",
    createdAt: new Date("2022-03-15"),
    lastContact: new Date("2023-05-20"),
  },
  // Add other clients...
];

const tasks = [
  {
    id: "1",
    title: "Follow up on proposal",
    description: "Send updated pricing and timeline for the project",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    priority: "high" as const,
    status: "todo" as const,
    assignee: {
      name: "Alex Johnson",
      initials: "AJ",
    },
    client: {
      name: "John Doe",
      id: "1",
    },
  },
  {
    id: "2",
    title: "Schedule quarterly review",
    description: "Discuss Q2 performance and future goals",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    priority: "medium" as const,
    status: "todo" as const,
    assignee: {
      name: "Sarah Miller",
      initials: "SM",
    },
    client: {
      name: "John Doe",
      id: "1",
    },
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800 hover:bg-green-200",
  inactive: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  lead: "bg-blue-100 text-blue-800 hover:bg-blue-200",
};

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  
  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="py-8 text-center">
        <p>Client not found</p>
        <Button asChild className="mt-4">
          <Link to="/clients">Back to Clients</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/clients">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Client Details
          </h1>
        </div>
        <Button>
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="w-full lg:w-1/3">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={client.avatar} />
                <AvatarFallback className="text-3xl">
                  {client.initials}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{client.name}</h2>
              <p className="text-muted-foreground">{client.company}</p>
              <Badge
                variant="outline"
                className={`mt-2 ${statusColors[client.status]}`}
              >
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <MailIcon className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneIcon className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Building2Icon className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{client.company}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{client.address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{client.notes || "No notes available."}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Client Since
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {client.createdAt.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                      })}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Last Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {client.lastContact.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Open Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{tasks.length}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tasks">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Tasks</h2>
                <Button>
                  <ClipboardListIcon className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
              <TasksList tasks={tasks} />
            </TabsContent>

            <TabsContent value="meetings">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Meetings</h2>
                <Button>
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No meetings scheduled.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Documents</h2>
                <Button>Upload Document</Button>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No documents available.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
