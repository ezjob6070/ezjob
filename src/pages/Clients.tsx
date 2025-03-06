
import { useState } from "react";
import ClientsTable from "@/components/ClientsTable";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AddClientModal from "@/components/AddClientModal";

// Updated client type to include payment information
type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "lead";
  avatar?: string;
  initials: string;
  paymentStatus?: "current" | "pending" | "overdue";
  paymentAmount?: number;
  createdAt?: Date;
  lastContact?: Date;
};

const Clients = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "John Doe",
      company: "Acme Corp",
      email: "john.doe@acme.com",
      phone: "(555) 123-4567",
      status: "active",
      initials: "JD",
      paymentStatus: "current",
      paymentAmount: 1500,
      createdAt: new Date("2023-01-15"),
      lastContact: new Date("2023-08-22"),
    },
    {
      id: "2",
      name: "Jane Smith",
      company: "Tech Solutions Inc.",
      email: "jane.smith@techsolutions.com",
      phone: "(555) 987-6543",
      status: "active",
      initials: "JS",
      paymentStatus: "overdue",
      paymentAmount: 2500,
      createdAt: new Date("2023-02-20"),
      lastContact: new Date("2023-09-05"),
    },
    {
      id: "3",
      name: "Bob Johnson",
      company: "Global Industries",
      email: "bob.johnson@global.com",
      phone: "(555) 456-7890",
      status: "inactive",
      initials: "BJ",
      paymentStatus: "pending",
      paymentAmount: 750,
      createdAt: new Date("2023-03-10"),
      lastContact: new Date("2023-07-15"),
    },
    {
      id: "4",
      name: "Alice Brown",
      company: "Innovative Designs",
      email: "alice.brown@innovative.com",
      phone: "(555) 789-0123",
      status: "lead",
      initials: "AB",
      paymentStatus: "current",
      paymentAmount: 3000,
      createdAt: new Date("2023-04-05"),
      lastContact: new Date("2023-08-10"),
    },
    {
      id: "5",
      name: "Charlie Wilson",
      company: "SoftServe LLC",
      email: "charlie.wilson@softserve.com",
      phone: "(555) 321-0987",
      status: "active",
      initials: "CW",
      paymentStatus: "current",
      paymentAmount: 2000,
      createdAt: new Date("2023-05-12"),
      lastContact: new Date("2023-09-01"),
    },
  ]);

  const handleAddClient = (newClient: Client) => {
    setClients((prevClients) => [newClient, ...prevClients]);
  };

  return (
    <div className="space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Clients
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your client relationships
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>

      <ClientsTable clients={clients} />
      
      <AddClientModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddClient={handleAddClient}
      />
    </div>
  );
};

export default Clients;
