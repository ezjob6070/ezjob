
import { useState } from "react";
import { MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { initialTechnicians } from "@/data/technicians";
import TechnicianMap from "@/components/gps/TechnicianMap";

const GPSTracking = () => {
  const [selectedTechnician, setSelectedTechnician] = useState<string>("all");
  const [refreshInterval, setRefreshInterval] = useState<string>("30");
  const [activeTab, setActiveTab] = useState<string>("map");
  const [mapApiKey, setMapApiKey] = useState<string>(localStorage.getItem("mapApiKey") || "");
  
  // Mock technician location data
  const technicianLocations = initialTechnicians.map(tech => ({
    id: tech.id,
    name: tech.name,
    location: {
      lat: 40.7128 + (Math.random() * 0.1 - 0.05), // Random positions around NYC
      lng: -74.0060 + (Math.random() * 0.1 - 0.05)
    },
    lastUpdated: new Date().toISOString(),
    status: Math.random() > 0.3 ? "active" : "inactive",
    currentJob: Math.random() > 0.5 ? "Job #" + Math.floor(Math.random() * 1000) : null
  }));
  
  const filteredTechnicians = selectedTechnician === "all" 
    ? technicianLocations 
    : technicianLocations.filter(tech => tech.id === selectedTechnician);
  
  const handleSaveApiKey = () => {
    localStorage.setItem("mapApiKey", mapApiKey);
    // Refresh the page to apply the new API key
    window.location.reload();
  };
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">GPS Tracking</h2>
          <p className="text-muted-foreground">
            Track your technicians' locations in real-time
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar for controls */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Tracking Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Technician Selection */}
            <div className="space-y-2">
              <Label htmlFor="technician-select" className="text-base font-semibold">Technician</Label>
              <Select
                value={selectedTechnician}
                onValueChange={setSelectedTechnician}
              >
                <SelectTrigger id="technician-select">
                  <SelectValue placeholder="Select Technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technicians</SelectItem>
                  {initialTechnicians.map(tech => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Refresh Rate */}
            <div className="space-y-2">
              <Label htmlFor="refresh-rate" className="text-base font-semibold">Refresh Rate</Label>
              <Select
                value={refreshInterval}
                onValueChange={setRefreshInterval}
              >
                <SelectTrigger id="refresh-rate">
                  <SelectValue placeholder="Refresh Rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            {/* Map API Key Setting */}
            <div className="space-y-2">
              <Label htmlFor="map-api-key" className="text-base font-semibold">Map API Key</Label>
              <Input
                id="map-api-key"
                type="password"
                value={mapApiKey}
                onChange={(e) => setMapApiKey(e.target.value)}
                placeholder="Enter your Mapbox API key"
              />
              <p className="text-xs text-muted-foreground">
                You'll need a Mapbox API key for the map functionality.
                Get one at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
              </p>
              <Button onClick={handleSaveApiKey} size="sm">
                Save API Key
              </Button>
            </div>
            
            <Separator />
            
            {/* Legend */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold">Status Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span>Inactive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>On job</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Map area */}
        <Card className="md:col-span-3 overflow-hidden">
          <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab}>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle>Live Tracking</CardTitle>
                <TabsList>
                  <TabsTrigger value="map">Map View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <TabsContent value="map" className="m-0">
                <div className="h-[600px] relative">
                  <TechnicianMap 
                    technicians={filteredTechnicians} 
                    mapApiKey={mapApiKey} 
                  />
                </div>
              </TabsContent>
              <TabsContent value="list" className="m-0">
                <div className="p-6 max-h-[600px] overflow-auto">
                  {filteredTechnicians.length > 0 ? (
                    <div className="space-y-4">
                      {filteredTechnicians.map(tech => (
                        <div key={tech.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tech.status === "active" 
                              ? tech.currentJob ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            <User size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{tech.name}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                tech.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}>
                                {tech.status === "active" ? "Active" : "Inactive"}
                              </span>
                            </div>
                            
                            <div className="text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                <span>
                                  Lat: {tech.location.lat.toFixed(4)}, Lng: {tech.location.lng.toFixed(4)}
                                </span>
                              </div>
                              
                              {tech.currentJob && (
                                <div className="mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded inline-block text-xs">
                                  Currently on: {tech.currentJob}
                                </div>
                              )}
                              
                              <div className="mt-2 text-xs">
                                Last updated: {new Date(tech.lastUpdated).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-center text-muted-foreground">
                      No technicians found with the current filter.
                    </div>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default GPSTracking;
