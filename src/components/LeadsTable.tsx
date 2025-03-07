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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  MoreHorizontalIcon, 
  PhoneIcon, 
  MailIcon, 
  CalendarIcon,
  ClipboardCheckIcon,
  DollarSignIcon,
  ArrowUpRightIcon
} from "lucide-react";
import { type Lead, type LeadStatus } from "@/types/lead";
import { useToast } from "@/hooks/use-toast";

type LeadsTableProps = {
  leads: Lead[];
};

const statusColors: Record<LeadStatus, string> = {
  new: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  contacted: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  qualified: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  proposal: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  negotiation: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  won: "bg-green-100 text-green-800 hover:bg-green-200",
  lost: "bg-red-100 text-red-800 hover:bg-red-200",
};

const sourceColors: Record<string, string> = {
  website: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  referral: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  social: "bg-pink-100 text-pink-800 hover:bg-pink-200",
  email: "bg-sky-100 text-sky-800 hover:bg-sky-200",
  other: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

const LeadsTable = ({ leads }: LeadsTableProps) => {
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lead;
    direction: "ascending" | "descending";
  } | null>(null);

  const handleSort = (key: keyof Lead) => {
    let direction: "ascending" | "descending" = "ascending";
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "ascending" ? "descending" : "ascending";
    }
    
    setSortConfig({ key, direction });
  };

  const sortedLeads = [...leads].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    
    if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
    if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
    return 0;
  });

  const getSortIcon = (key: keyof Lead) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUpIcon className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDownIcon className="ml-1 h-4 w-4" />
    );
  };

  const formatDate = (date?: Date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const handleQuickAction = (action: string, lead: Lead) => {
    switch (action) {
      case "call":
        toast({
          title: "Calling",
          description: `Initiating call to ${lead.name}...`,
        });
        break;
      case "email":
        toast({
          title: "New Email",
          description: `Opening email composer for ${lead.name}...`,
        });
        break;
      case "schedule":
        toast({
          title: "Schedule Meeting",
          description: `Opening calendar to schedule with ${lead.name}...`,
        });
        break;
      case "convert":
        toast({
          title: "Convert to Customer",
          description: `Converting ${lead.name} to a customer...`,
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <button
                className="flex items-center font-medium"
                onClick={() => handleSort("name")}
              >
                Lead {getSortIcon("name")}
              </button>
            </TableHead>
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
                onClick={() => handleSort("source")}
              >
                Source {getSortIcon("source")}
              </button>
            </TableHead>
            <TableHead>
              <button
                className="flex items-center font-medium"
                onClick={() => handleSort("value")}
              >
                <DollarSignIcon className="mr-1 h-4 w-4" />
                Value {getSortIcon("value")}
              </button>
            </TableHead>
            <TableHead>
              <button
                className="flex items-center font-medium"
                onClick={() => handleSort("assignedTo")}
              >
                Assigned To {getSortIcon("assignedTo")}
              </button>
            </TableHead>
            <TableHead>
              <button
                className="flex items-center font-medium"
                onClick={() => handleSort("lastContact")}
              >
                Last Contact {getSortIcon("lastContact")}
              </button>
            </TableHead>
            <TableHead>
              <button
                className="flex items-center font-medium"
                onClick={() => handleSort("nextFollowUp")}
              >
                Next Follow-up {getSortIcon("nextFollowUp")}
              </button>
            </TableHead>
            <TableHead>Quick Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLeads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No leads found
              </TableCell>
            </TableRow>
          ) : (
            sortedLeads.map((lead) => (
              <TableRow key={lead.id} className="group hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{lead.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">{lead.company}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={statusColors[lead.status]}
                  >
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={sourceColors[lead.source]}
                  >
                    {lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {formatValue(lead.value)}
                </TableCell>
                <TableCell>{lead.assignedTo}</TableCell>
                <TableCell>{formatDate(lead.lastContact)}</TableCell>
                <TableCell>
                  {lead.nextFollowUp && (
                    <div className={`flex items-center ${
                      new Date(lead.nextFollowUp) < new Date() ? "text-red-600" : ""
                    }`}>
                      {formatDate(lead.nextFollowUp)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleQuickAction("call", lead)}
                      title="Call"
                    >
                      <PhoneIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleQuickAction("email", lead)}
                      title="Email"
                    >
                      <MailIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleQuickAction("schedule", lead)}
                      title="Schedule"
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center" onClick={() => handleQuickAction("convert", lead)}>
                          <ClipboardCheckIcon className="h-4 w-4 mr-2" />
                          Convert to Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/leads/${lead.id}`} className="flex items-center">
                            <ArrowUpRightIcon className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadsTable;
