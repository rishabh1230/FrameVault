import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // FIX: Named import { useAuth }

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth(); 

  // CRITICAL FIX: Wait for the AuthContext to finish loading
  if (isLoading) {
    return <div>Loading authentication state...</div>; 
  }
  
  // Once loading is complete, perform the authentication check
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;