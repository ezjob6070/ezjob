
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Briefcase, FileText } from "lucide-react"; // Changed from unavailable CoatRack and Invoice icons
import TechnicianInvoiceGenerator from "@/components/technicians/invoices/TechnicianInvoiceGenerator";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";

interface ProjectFinanceTabProps {
  projectId: string;
}

export const ProjectFinanceTab = ({ projectId }: ProjectFinanceTabProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { technicians } = useGlobalState();
  
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Project Finance</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger 
              value="overview"
              variant="blue"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="expenses"
              variant="blue"
            >
              <Briefcase className="h-4 w-4 mr-1" /> {/* Changed from CoatRack */}
              Expenses
            </TabsTrigger>
            <TabsTrigger 
              value="invoices"
              variant="blue"
            >
              <FileText className="h-4 w-4 mr-1" /> {/* Changed from Invoice */}
              Invoices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="py-6">
              <h3 className="text-lg font-medium">Financial Overview</h3>
              <p className="text-muted-foreground">Summary of project financials will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="expenses">
            <div className="py-6">
              <h3 className="text-lg font-medium">Project Expenses</h3>
              <p className="text-muted-foreground">Project expenses will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="invoices">
            <div className="py-6">
              <h3 className="text-lg font-medium">Project Invoices</h3>
              <TechnicianInvoiceGenerator technicians={technicians} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectFinanceTab;
