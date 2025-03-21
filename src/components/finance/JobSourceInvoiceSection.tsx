import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download, Eye, FileText, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { JobSource } from "@/types/finance";

interface JobSourceInvoiceSectionProps {
  jobSources: JobSource[];
}

interface DisplayOptions {
  showJobAddress: boolean;
  showJobDate: boolean;
  showCompanyProfit: boolean;
  showPartsValue: boolean;
  showDetails: boolean;
  showJobSourceRate: boolean;
  showJobBreakdown: boolean;
  showTotalSummary: boolean;
  showTechnicianEarnings: boolean;
  showTechnicianRate: boolean;
}

const JobSourceInvoiceSection: React.FC<JobSourceInvoiceSectionProps> = ({ jobSources }) => {
  const [selectedJobSources, setSelectedJobSources] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<"all" | "generated" | "custom">("all");
  
  // Display options with default values
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    showJobAddress: true,
    showJobDate: true,
    showCompanyProfit: true,
    showPartsValue: false,
    showDetails: true,
    showJobSourceRate: true,
    showJobBreakdown: true,
    showTotalSummary: true,
    showTechnicianEarnings: false, // Added for type compatibility
    showTechnicianRate: false // Added for type compatibility
  });

  // Toggle job source selection
  const toggleJobSource = (jobSourceId: string) => {
    setSelectedJobSources(prev => 
      prev.includes(jobSourceId) 
        ? prev.filter(id => id !== jobSourceId) 
        : [...prev, jobSourceId]
    );
  };

  // Toggle all job sources selection
  const toggleAllJobSources = () => {
    if (selectedJobSources.length === jobSources.length) {
      setSelectedJobSources([]);
    } else {
      setSelectedJobSources(jobSources.map(source => source.id));
    }
  };

  // Toggle specific display option
  const toggleDisplayOption = (option: keyof DisplayOptions) => {
    setDisplayOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  // Handler for generating invoice
  const handleGenerateInvoice = () => {
    console.log("Generating invoice for job sources:", selectedJobSources);
    console.log("With display options:", displayOptions);
    setPreviewOpen(true);
  };

  // Get selected job sources data
  const selectedJobSourcesData = jobSources.filter(source => 
    selectedJobSources.includes(source.id)
  );

  // Generate mock invoices for demonstration
  const invoices = [
    {
      id: "INV-001",
      title: "Monthly Job Source Report",
      date: "2023-05-15",
      status: "ready",
      type: "generated",
      jobSourceCount: 5
    },
    {
      id: "INV-002",
      title: "Quarterly Source Performance",
      date: "2023-04-01",
      status: "ready",
      type: "generated",
      jobSourceCount: 8
    },
    {
      id: "INV-003",
      title: "Annual Source Review",
      date: "2023-01-10",
      status: "ready",
      type: "generated",
      jobSourceCount: 12
    },
    {
      id: "INV-004",
      title: "Custom Source Report",
      date: "2023-05-10",
      status: "ready",
      type: "custom",
      jobSourceCount: 3
    }
  ];

  // Filter invoices based on current tab
  const filteredInvoices = invoices.filter(inv => 
    currentTab === "all" || inv.type === currentTab
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Source Reports & Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={(v) => setCurrentTab(v as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="generated">Generated</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <h3 className="text-base font-medium mb-1">Create New Job Source Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Select job sources to include in your customized report or invoice.
                  </p>
                </div>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleGenerateInvoice}
                  disabled={selectedJobSources.length === 0}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Generate Report
                </Button>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="select-all-sources" 
                      checked={selectedJobSources.length === jobSources.length && jobSources.length > 0}
                      onCheckedChange={toggleAllJobSources}
                    />
                    <label htmlFor="select-all-sources" className="text-sm font-medium cursor-pointer">
                      Select All Job Sources
                    </label>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {selectedJobSources.length} of {jobSources.length} selected
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                  {jobSources.map(source => (
                    <div 
                      key={source.id}
                      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100
                        ${selectedJobSources.includes(source.id) ? 'bg-blue-50 border border-blue-200' : 'border border-gray-200'}
                      `}
                      onClick={() => toggleJobSource(source.id)}
                    >
                      <Checkbox 
                        id={`source-${source.id}`} 
                        checked={selectedJobSources.includes(source.id)}
                        onCheckedChange={() => toggleJobSource(source.id)}
                        className="pointer-events-none"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs">
                            {source.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium truncate">{source.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {source.totalJobs || 0} jobs · {source.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Display Options */}
            {selectedJobSources.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-base font-medium mb-2">Report Display Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-job-address" 
                      checked={displayOptions.showJobAddress}
                      onCheckedChange={() => toggleDisplayOption('showJobAddress')}
                    />
                    <label htmlFor="show-job-address" className="text-sm cursor-pointer">
                      Show Job Addresses
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-job-date" 
                      checked={displayOptions.showJobDate}
                      onCheckedChange={() => toggleDisplayOption('showJobDate')}
                    />
                    <label htmlFor="show-job-date" className="text-sm cursor-pointer">
                      Show Job Dates
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-profit" 
                      checked={displayOptions.showCompanyProfit}
                      onCheckedChange={() => toggleDisplayOption('showCompanyProfit')}
                    />
                    <label htmlFor="show-profit" className="text-sm cursor-pointer">
                      Show Profit Calculations
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-parts" 
                      checked={displayOptions.showPartsValue}
                      onCheckedChange={() => toggleDisplayOption('showPartsValue')}
                    />
                    <label htmlFor="show-parts" className="text-sm cursor-pointer">
                      Show Parts Values
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-details" 
                      checked={displayOptions.showDetails}
                      onCheckedChange={() => toggleDisplayOption('showDetails')}
                    />
                    <label htmlFor="show-details" className="text-sm cursor-pointer">
                      Show Detailed Breakdown
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-source-rate" 
                      checked={displayOptions.showJobSourceRate}
                      onCheckedChange={() => toggleDisplayOption('showJobSourceRate')}
                    />
                    <label htmlFor="show-source-rate" className="text-sm cursor-pointer">
                      Show Source Rates
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-breakdown" 
                      checked={displayOptions.showJobBreakdown}
                      onCheckedChange={() => toggleDisplayOption('showJobBreakdown')}
                    />
                    <label htmlFor="show-breakdown" className="text-sm cursor-pointer">
                      Show Job Breakdown
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-summary" 
                      checked={displayOptions.showTotalSummary}
                      onCheckedChange={() => toggleDisplayOption('showTotalSummary')}
                    />
                    <label htmlFor="show-summary" className="text-sm cursor-pointer">
                      Show Total Summary
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Existing Reports */}
            <div>
              <h3 className="text-base font-medium mb-3">Existing Reports</h3>
              <div className="space-y-2">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map(invoice => (
                    <div 
                      key={invoice.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            <FileText className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium">{invoice.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{invoice.id}</span>
                            <span>•</span>
                            <span>{new Date(invoice.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{invoice.jobSourceCount} sources</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={invoice.type === "custom" ? "outline" : "secondary"}>
                          {invoice.type === "custom" ? "Custom" : "Generated"}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium">No reports found</h3>
                    <p className="text-muted-foreground">
                      {currentTab === "all" 
                        ? "You haven't generated any reports yet." 
                        : `No ${currentTab} reports available.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="generated">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium">Generated Reports</h3>
              <p className="text-muted-foreground">
                View and download automatically generated job source reports.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium">Custom Reports</h3>
              <p className="text-muted-foreground">
                View and manage your custom-created job source reports.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default JobSourceInvoiceSection;
