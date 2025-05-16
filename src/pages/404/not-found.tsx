import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            404 Page Not Found
          </h1>
          <p className="text-gray-500">
            Sorry, we couldn&#x27;t find the page you&#x27;re looking for.
          </p>
        </div>
        <Button onClick={() => navigate(-1)}>Return to website</Button>
      </div>
    </div>
  );
}
