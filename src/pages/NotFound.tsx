
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ubs-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-ubs-gray-700">404</h1>
        <p className="text-xl text-ubs-gray-500 mb-6">Page not found</p>
        <div className="h-1 w-16 bg-ubs-red mx-auto mb-6"></div>
        <p className="text-ubs-gray-500 mb-6">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Button asChild>
          <Link to="/" className="bg-ubs-red hover:bg-opacity-90">
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
