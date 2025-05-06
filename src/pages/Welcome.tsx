
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { toast } from "@/components/ui/use-toast";

const Welcome = () => {
  const navigate = useNavigate();
  const { setCurrentIndustry } = useGlobalState();
  
  // Automatically set to service and redirect to dashboard
  useEffect(() => {
    // Set the industry to service
    setCurrentIndustry('service');
    
    // Navigate to the dashboard
    navigate('/dashboard');
    
    // Show a welcome toast
    toast({
      title: "Welcome to Uleadz Service CRM",
      description: "You're now using the service management system",
    });
  }, [navigate, setCurrentIndustry]);

  // This page will just redirect, so we don't need content
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-blue-900">Loading service CRM...</h1>
        <p className="text-blue-700 mt-2">Please wait while we set things up</p>
      </div>
    </div>
  );
};

export default Welcome;
