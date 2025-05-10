
import { Estimate, EstimateStatus } from "@/types/estimate";
import { Card, CardContent } from "@/components/ui/card";
import EstimateCard from "./EstimateCard";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface EstimateListProps {
  estimates: Estimate[];
  onStatusChange: (id: string, status: EstimateStatus) => void;
}

const EstimateList = ({ estimates, onStatusChange }: EstimateListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEstimates, setFilteredEstimates] = useState<Estimate[]>(estimates);

  useEffect(() => {
    const filtered = estimates.filter(
      (est) =>
        est.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEstimates(filtered);
  }, [estimates, searchTerm]);

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
      <div className="relative w-full">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search estimates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEstimates.map((estimate) => (
          <EstimateCard 
            key={estimate.id} 
            estimate={estimate} 
            onStatusChange={onStatusChange} 
          />
        ))}
      </div>
    </div>
  );
};

export default EstimateList;
