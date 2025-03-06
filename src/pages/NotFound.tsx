
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="text-center max-w-md px-4 bg-white/20 backdrop-blur-lg p-8 rounded-xl shadow-lg">
        <h1 className="text-6xl font-bold mb-6 text-white">404</h1>
        <p className="text-xl text-white mb-8">
          We couldn't find the page you're looking for.
        </p>
        <Button asChild className="inline-flex items-center bg-white text-blue-700 hover:bg-white/90">
          <Link to="/">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
