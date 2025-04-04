import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Routes } from "../../utils/Routes";

interface AuthRedirectProps {
  element: React.ReactElement;
}

export default function AuthRedirect({ element }: AuthRedirectProps) {
  const { loading, user } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={Routes.home} />;
  }

  return element;
}
