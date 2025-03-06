
import ClientsTable from "@/components/ClientsTable";

const Clients = () => {
  const clients = [
    {
      id: "1",
      name: "John Doe",
      company: "Acme Corp",
      email: "john.doe@acme.com",
      phone: "(555) 123-4567",
      status: "active" as const,
      initials: "JD",
    },
    {
      id: "2",
      name: "Jane Smith",
      company: "Tech Solutions Inc.",
      email: "jane.smith@techsolutions.com",
      phone: "(555) 987-6543",
      status: "active" as const,
      initials: "JS",
    },
    {
      id: "3",
      name: "Bob Johnson",
      company: "Global Industries",
      email: "bob.johnson@global.com",
      phone: "(555) 456-7890",
      status: "inactive" as const,
      initials: "BJ",
    },
    {
      id: "4",
      name: "Alice Brown",
      company: "Innovative Designs",
      email: "alice.brown@innovative.com",
      phone: "(555) 789-0123",
      status: "lead" as const,
      initials: "AB",
    },
    {
      id: "5",
      name: "Charlie Wilson",
      company: "SoftServe LLC",
      email: "charlie.wilson@softserve.com",
      phone: "(555) 321-0987",
      status: "active" as const,
      initials: "CW",
    },
  ];

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-bold leading-tight tracking-tighter">
          Clients
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your client relationships
        </p>
      </div>

      <ClientsTable clients={clients} />
    </div>
  );
};

export default Clients;
