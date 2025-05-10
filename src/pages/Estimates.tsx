
import { useState } from "react";
import { initialEstimates } from "@/data/estimates";
import { Estimate, EstimateStatus } from "@/types/estimate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SendIcon, ClockIcon, CheckCircleIcon, FileTextIcon } from "lucide-react";
import EstimateList from "@/components/estimates/EstimateList";
import CreateEstimateButton from "@/components/estimates/CreateEstimateButton";
import { Card } from "@/components/ui/card";

const Estimates = () => {
  const [estimates, setEstimates] = useState<Estimate[]>(initialEstimates);
  
  const sentEstimates = estimates.filter(est => est.status === "sent");
  const inProcessEstimates = estimates.filter(est => est.status === "in-process");
  const completedEstimates = estimates.filter(est => est.status === "completed");

  const addEstimate = (estimate: Estimate) => {
    setEstimates(prev => [...prev, estimate]);
  };

  const updateEstimateStatus = (id: string, status: EstimateStatus) => {
    setEstimates(prev => 
      prev.map(est => est.id === id ? { ...est, status, updatedAt: new Date() } : est)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Estimates & Quotes</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage and track client estimates and quotes
          </p>
        </div>
        <CreateEstimateButton onEstimateCreate={addEstimate} />
      </div>
      
      <Tabs defaultValue="sent" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <SendIcon size={16} />
            <span>Sent</span>
            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs">
              {sentEstimates.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="in-process" className="flex items-center gap-2">
            <ClockIcon size={16} />
            <span>In Process</span>
            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs">
              {inProcessEstimates.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircleIcon size={16} />
            <span>Completed</span>
            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs">
              {completedEstimates.length}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sent" className="mt-6">
          <EstimateList 
            estimates={sentEstimates} 
            onStatusChange={updateEstimateStatus}
          />
        </TabsContent>
        
        <TabsContent value="in-process" className="mt-6">
          <EstimateList 
            estimates={inProcessEstimates} 
            onStatusChange={updateEstimateStatus}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <EstimateList 
            estimates={completedEstimates} 
            onStatusChange={updateEstimateStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Estimates;
