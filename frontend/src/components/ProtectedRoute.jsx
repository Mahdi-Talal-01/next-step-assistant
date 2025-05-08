import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../pages/Auth/hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initialized } = useAuth();
  const location = useLocation();

  // Wait for auth to initialize before making any decisions
  if (!initialized) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    // Redirect to auth page but save the attempted url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 