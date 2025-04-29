
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Construction, WrenchIcon, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { IndustryType } from "@/components/sidebar/sidebarTypes";
import { toast } from "@/components/ui/use-toast";

const Welcome = () => {
  const navigate = useNavigate();
  const { setCurrentIndustry } = useGlobalState();
  const [hoveredCategory, setHoveredCategory] = useState<IndustryType | null>(null);

  const handleCategorySelect = (industry: IndustryType) => {
    setCurrentIndustry(industry);
    
    // Navigate based on industry type
    if (industry === 'real_estate') {
      navigate('/real-estate-dashboard');
    } else if (industry === 'construction') {
      navigate('/dashboard');
    } else {
      navigate('/dashboard');
    }

    toast({
      title: `Welcome to ${industry.replace('_', ' ')} CRM`,
      description: `You've selected the ${industry.replace('_', ' ')} category`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">Welcome to Uleadz CRM</h1>
        <p className="text-xl text-blue-700">Please select your industry to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        {/* Service Industry */}
        <Card 
          className={`hover:shadow-xl transition-all duration-300 transform ${
            hoveredCategory === 'service' ? 'scale-105' : ''
          } cursor-pointer border-2 ${hoveredCategory === 'service' ? 'border-blue-500' : 'border-transparent'}`}
          onClick={() => handleCategorySelect('service')}
          onMouseEnter={() => setHoveredCategory('service')}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-6 rounded-full mb-6">
              <WrenchIcon size={64} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Service</h2>
            <p className="text-gray-600">
              Manage service jobs, technicians, schedules, and customer relationships
            </p>
            <Button className="mt-6 w-full">Select Service</Button>
          </CardContent>
        </Card>

        {/* Real Estate Industry */}
        <Card 
          className={`hover:shadow-xl transition-all duration-300 transform ${
            hoveredCategory === 'real_estate' ? 'scale-105' : ''
          } cursor-pointer border-2 ${hoveredCategory === 'real_estate' ? 'border-blue-500' : 'border-transparent'}`}
          onClick={() => handleCategorySelect('real_estate')}
          onMouseEnter={() => setHoveredCategory('real_estate')}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="bg-green-100 p-6 rounded-full mb-6">
              <Home size={64} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Real Estate</h2>
            <p className="text-gray-600">
              Manage properties, listings, agents, and client relationships
            </p>
            <Button className="mt-6 w-full bg-green-600 hover:bg-green-700">Select Real Estate</Button>
          </CardContent>
        </Card>

        {/* Construction Industry */}
        <Card 
          className={`hover:shadow-xl transition-all duration-300 transform ${
            hoveredCategory === 'construction' ? 'scale-105' : ''
          } cursor-pointer border-2 ${hoveredCategory === 'construction' ? 'border-blue-500' : 'border-transparent'}`}
          onClick={() => handleCategorySelect('construction')}
          onMouseEnter={() => setHoveredCategory('construction')}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="bg-orange-100 p-6 rounded-full mb-6">
              <Construction size={64} className="text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Construction</h2>
            <p className="text-gray-600">
              Manage projects, equipment, materials, contractors, and inspections
            </p>
            <Button className="mt-6 w-full bg-orange-600 hover:bg-orange-700">Select Construction</Button>
          </CardContent>
        </Card>
      </div>

      <p className="mt-16 text-sm text-gray-500">
        You can change your industry selection later from the sidebar
      </p>
    </div>
  );
};

export default Welcome;
