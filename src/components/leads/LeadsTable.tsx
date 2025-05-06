
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EyeIcon, PencilIcon } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  source: string;
  value: number;
  dateAdded: Date;
  status: "active" | "converted" | "inactive";
  notes?: string;
};

interface LeadsTableProps {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onViewDetails: (lead: Lead) => void;
}

const LeadsTable = ({ leads, onEditLead, onViewDetails }: LeadsTableProps) => {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "secondary";
      case "converted":
        return "outline";
      case "inactive":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No leads found.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.service}</TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>{format(lead.dateAdded, "MMM d, yyyy")}</TableCell>
                <TableCell>${lead.value}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(lead.status)}>
                    {lead.status === 'active' ? 'Active' : 
                     lead.status === 'converted' ? 'Converted' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetails(lead)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditLead(lead)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
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
