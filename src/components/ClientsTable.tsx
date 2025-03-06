import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronUpIcon, ChevronDownIcon, SearchIcon, DollarSignIcon } from "lucide-react";

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
};

type ClientsTableProps = {
  clients: Client[];
};

const statusColors = {
  active: "bg-green-100 text-green-800 hover:bg-green-200",
  inactive: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  lead: "bg-blue-100 text-blue-800 hover:bg-blue-200",
};

const paymentStatusColors = {
  current: "bg-green-100 text-green-800 hover:bg-green-200",
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  overdue: "bg-red-100 text-red-800 hover:bg-red-200",
};

const ClientsTable = ({ clients: initialClients }: ClientsTableProps) => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Client;
    direction: "ascending" | "descending";
  } | null>(null);

  const handleSort = (key: keyof Client) => {
    let direction: "ascending" | "descending" = "ascending";
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "ascending" ? "descending" : "ascending";
    }
    
    const sortedClients = [...clients].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    
    setClients(sortedClients);
    setSortConfig({ key, direction });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value === "") {
      setClients(initialClients);
    } else {
      const filteredClients = initialClients.filter(client => 
        client.name.toLowerCase().includes(value.toLowerCase()) ||
        client.company.toLowerCase().includes(value.toLowerCase()) ||
        client.email.toLowerCase().includes(value.toLowerCase())
      );
      setClients(filteredClients);
    }
  };

  const getSortIcon = (key: keyof Client) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUpIcon className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDownIcon className="ml-1 h-4 w-4" />
    );
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center ml-auto space-x-2">
          <Button variant="outline">Export</Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("name")}
                >
                  Name {getSortIcon("name")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("company")}
                >
                  Company {getSortIcon("company")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("email")}
                >
                  Email {getSortIcon("email")}
                </button>
              </TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("status")}
                >
                  Status {getSortIcon("status")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("paymentAmount")}
                >
                  <DollarSignIcon className="mr-1 h-4 w-4" /> Payment {getSortIcon("paymentAmount")}
                </button>
              </TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id} className="group hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={client.avatar} />
                        <AvatarFallback>{client.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          to={`/clients/${client.id}`}
                          className="font-medium hover:underline"
                        >
                          {client.name}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[client.status]}
                    >
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(client.paymentAmount)}
                  </TableCell>
                  <TableCell>
                    {client.paymentStatus && (
                      <Badge
                        variant="outline"
                        className={paymentStatusColors[client.paymentStatus]}
                      >
                        {client.paymentStatus.charAt(0).toUpperCase() + client.paymentStatus.slice(1)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      asChild
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Link to={`/clients/${client.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientsTable;
