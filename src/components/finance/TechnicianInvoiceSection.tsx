
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Technician } from '@/types/technician';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import TechnicianInvoiceGenerator from '@/components/technicians/invoices/TechnicianInvoiceGenerator';

interface TechnicianInvoiceSectionProps {
  activeTechnicians: Technician[];
}

const TechnicianInvoiceSection: React.FC<TechnicianInvoiceSectionProps> = ({ 
  activeTechnicians 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(
    activeTechnicians.length > 0 ? activeTechnicians[0] : null
  );

  const filteredTechnicians = activeTechnicians.filter(tech => 
    tech.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl font-semibold">Technician Invoices</h2>
          <p className="text-muted-foreground">Generate and manage invoices for technicians</p>
        </div>
        
        <div className="w-full md:w-auto flex gap-2">
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search technicians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          {selectedTechnician && (
            <TechnicianInvoiceGenerator 
              technicians={filteredTechnicians}
              selectedTechnician={selectedTechnician}
            />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechnicians.map(tech => (
          <Card 
            key={tech.id}
            className={`cursor-pointer transition-all ${
              selectedTechnician?.id === tech.id ? 'border-blue-500 ring-1 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedTechnician(tech)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{tech.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Type:</span>
                  <span className="text-sm font-medium">{tech.paymentType === 'percentage' ? 'Percentage' : 'Flat Rate'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rate:</span>
                  <span className="text-sm font-medium">
                    {tech.paymentType === 'percentage' ? `${tech.paymentRate}%` : `$${tech.paymentRate}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Jobs Completed:</span>
                  <span className="text-sm font-medium">{tech.completedJobs || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Revenue:</span>
                  <span className="text-sm font-medium">${tech.totalRevenue?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredTechnicians.length === 0 && (
          <div className="col-span-full flex justify-center items-center h-40 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No technicians found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianInvoiceSection;
