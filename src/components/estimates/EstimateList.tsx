
import { Estimate, EstimateStatus } from "@/types/estimate";
import { Card, CardContent } from "@/components/ui/card";
import EstimateCard from "./EstimateCard";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Download, Send, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface EstimateListProps {
  estimates: Estimate[];
  onStatusChange: (id: string, status: EstimateStatus) => void;
}

const EstimateList = ({ estimates, onStatusChange }: EstimateListProps) => {
  const [selectedEstimates, setSelectedEstimates] = useState<string[]>([]);
  
  // Clear selection when estimates change
  useEffect(() => {
    setSelectedEstimates([]);
  }, [estimates]);

  const handleSelectEstimate = (id: string, selected: boolean) => {
    setSelectedEstimates(prev => 
      selected 
        ? [...prev, id] 
        : prev.filter(estId => estId !== id)
    );
  };

  const handleSelectAll = () => {
    if (selectedEstimates.length === estimates.length) {
      setSelectedEstimates([]);
    } else {
      setSelectedEstimates(estimates.map(est => est.id));
    }
  };

  const handleBulkSend = () => {
    toast({
      title: "Bulk Action",
      description: `${selectedEstimates.length} estimates were sent to clients.`,
    });
    setSelectedEstimates([]);
  };

  const handleBulkDownload = () => {
    toast({
      title: "Bulk Download",
      description: `${selectedEstimates.length} estimates are being prepared for download.`,
    });
  };

  if (estimates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-muted-foreground text-center">No estimates found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {selectedEstimates.length > 0 && (
        <div className="bg-muted p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={selectedEstimates.length === estimates.length}
              onCheckedChange={handleSelectAll}
              id="select-all"
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              {selectedEstimates.length} selected
            </label>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleBulkSend} className="flex items-center gap-1">
              <Send size={14} />
              <span>Send</span>
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkDownload} className="flex items-center gap-1">
              <Download size={14} />
              <span>Download</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <MoreHorizontal size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                <DropdownMenuItem>Convert to Job</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {estimates.map((estimate) => (
          <div key={estimate.id} className="relative">
            <div className="absolute top-2 left-2 z-10">
              <Checkbox 
                checked={selectedEstimates.includes(estimate.id)}
                onCheckedChange={(checked) => handleSelectEstimate(estimate.id, !!checked)}
              />
            </div>
            <EstimateCard 
              estimate={estimate} 
              onStatusChange={onStatusChange} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstimateList;
