import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { routes } from "../config/Router";
import { useEffect } from "react";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    navigate(routes.notFound.path);
  }, [navigate]);

  if (location.pathname !== routes.notFound.path) {
    return null;
  }

  return (
    <div
      className="w-full pt-2 h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/error-404-concept-illustration_114360-1811.jpg?w=1500')",
      }}
    >
      <div className="flex items-center h-full">
        <Button
          className="mx-auto mt-auto mb-24 text-4xl p-8"
          onClick={() => navigate(routes.myQuizzes.path)}
        >
          Home
        </Button>
      </div>
    </div>
  );
}
