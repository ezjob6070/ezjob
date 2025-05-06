
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
import { EyeIcon, PencilIcon, PhoneIcon, MailIcon } from "lucide-react";
import { Lead, LEAD_STATUS_COLORS } from "@/types/lead";

interface LeadsTableProps {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onViewDetails: (lead: Lead) => void;
  onStatusChange?: (id: string, status: Lead['status']) => void;
}

const LeadsTable = ({ leads, onEditLead, onViewDetails, onStatusChange }: LeadsTableProps) => {
  // Format currency with $ symbol and 2 decimal places
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
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
              <TableCell colSpan={8} className="text-center py-4">
                No leads found.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{lead.name}</span>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                      {lead.phone && (
                        <span className="flex items-center gap-1">
                          <PhoneIcon className="h-3 w-3" /> 
                          {lead.phone}
                        </span>
                      )}
                      {lead.email && (
                        <span className="flex items-center gap-1">
                          <MailIcon className="h-3 w-3" /> 
                          {lead.email}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{lead.company || "—"}</TableCell>
                <TableCell>{lead.service || "—"}</TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>
                  {lead.createdAt ? format(lead.createdAt, "MMM d, yyyy") : 
                   lead.dateAdded ? format(lead.dateAdded, "MMM d, yyyy") : "—"}
                </TableCell>
                <TableCell>{formatCurrency(lead.value)}</TableCell>
                <TableCell>
                  <Badge className={LEAD_STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-800"}>
                    {formatStatus(lead.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetails(lead)}
                    title="View Details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditLead(lead)}
                    title="Edit Lead"
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
