
import React, { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { Technician } from "@/types/technician";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TechnicianList from "./invoice-section/TechnicianList";
import { initialTechnicians } from "@/data/technicians";
import { useGlobalDateRange } from "@/components/GlobalDateRangeFilter";

interface TechnicianInvoiceSectionProps {
  activeTechnicians: Technician[];
  dateRange?: DateRange;
}

const TechnicianInvoiceSection: React.FC<TechnicianInvoiceSectionProps> = ({ 
  activeTechnicians,
  dateRange,
}) => {
  const [techList, setTechList] = useState<Technician[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { dateRange: globalDateRange } = useGlobalDateRange();

  // Use the provided dateRange or fall back to global dateRange
  const effectiveDateRange = dateRange || globalDateRange;
  
  useEffect(() => {
    // Initialize with active technicians
    setTechList(activeTechnicians);
  }, [activeTechnicians]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter technicians based on search query
  const filteredTechnicians = techList.filter(tech => 
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Technician Invoices</CardTitle>
          <CardDescription>
            Generate and download invoices for technicians
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TechnicianList 
              technicians={filteredTechnicians}
              selectedTechnician={selectedTechnician}
              onSelectTechnician={setSelectedTechnician}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              dateRange={effectiveDateRange}
            />
            
            <div className="relative">
              <div className="hidden md:block absolute top-0 left-0 bottom-0 w-px bg-gray-200 -ml-2"></div>
              <div className="md:pl-4 space-y-4">
                {selectedTechnician ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{selectedTechnician.name}</CardTitle>
                        <CardDescription>{selectedTechnician.specialty}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Technician details go here */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p className="font-medium">{selectedTechnician.email || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Phone</p>
                              <p className="font-medium">{selectedTechnician.phone || 'N/A'}</p>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-sm text-muted-foreground">Expertise</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedTechnician.skills?.map((skill, index) => (
                                <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{skill}</span>
                              ))}
                              {!selectedTechnician.skills?.length && <span className="text-muted-foreground">No skills listed</span>}
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-sm text-muted-foreground">Payment Details</p>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <div>
                                <p className="text-xs text-muted-foreground">Type</p>
                                <p className="font-medium capitalize">{selectedTechnician.paymentType || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Rate</p>
                                <p className="font-medium">
                                  {selectedTechnician.paymentRate || 'N/A'}
                                  {selectedTechnician.paymentType === 'percentage' && '%'}
                                  {selectedTechnician.paymentType === 'fixed' && ' per job'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] border rounded-md bg-muted/20">
                    <p className="text-muted-foreground">
                      Select a technician to view their details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianInvoiceSection;
