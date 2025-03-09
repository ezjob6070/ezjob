
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

// Define the technician location type
interface TechnicianLocation {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  lastUpdated: string;
  status: string;
  currentJob: string | null;
}

interface TechnicianMapProps {
  technicians: TechnicianLocation[];
  mapApiKey: string;
}

const TechnicianMap = ({ technicians, mapApiKey }: TechnicianMapProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // If no API key is provided, show a message to add one
  if (!mapApiKey) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Map API Key Required</h3>
          <p className="text-muted-foreground mb-4">
            Please add your Mapbox API key in the settings panel to enable the map functionality.
          </p>
        </div>
      </div>
    );
  }

  // For demo purpose, create a simple map display
  // In a real implementation, you would integrate with Mapbox or Google Maps
  return (
    <>
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 max-w-md">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Map Display</h3>
          <p className="text-muted-foreground mb-4">
            This is a placeholder for the actual map integration.
            In a production environment, this would use Mapbox or Google Maps to show real-time technician locations.
          </p>
          
          <div className="text-left border rounded-lg p-4 bg-white shadow-sm">
            <h4 className="font-medium mb-2">Tracking {technicians.length} technicians:</h4>
            <ul className="space-y-2">
              {technicians.map(tech => (
                <li key={tech.id} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    tech.status === "active" 
                      ? tech.currentJob ? "bg-yellow-500" : "bg-green-500" 
                      : "bg-gray-400"
                  }`}></div>
                  <span>{tech.name}</span>
                  {tech.currentJob && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      {tech.currentJob}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Map integration note */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md text-xs text-muted-foreground">
        <p>Note: For full map functionality, integrate with Mapbox or Google Maps API.</p>
      </div>
    </>
  );
};

export default TechnicianMap;
