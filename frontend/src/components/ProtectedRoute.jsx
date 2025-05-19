import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../pages/Auth/hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Debug logs
  const { authenticated, user } = isAuthenticated();
  console.log('ProtectedRoute - Auth state:', {
    authenticated,
    user,
    loading,
    path: location.pathname
  });

  // Wait for auth to initialize before making any decisions
  if (loading) {
    return null; // or a loading spinner
  }

  if (!authenticated) {
    // Redirect to auth page but save the attempted url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute; 