import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../pages/Auth/hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Get authentication state
  const { authenticated, user } = isAuthenticated();
  console.log('ProtectedRoute - Auth state:', {
    authenticated,
    user,
    loading,
    path: location.pathname
  });

  // Wait for auth to initialize before making any decisions
  if (loading) {
    console.log('ProtectedRoute - Loading auth state');
    return null; // or a loading spinner
  }

  if (!authenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to auth');
    // Redirect to auth page but save the attempted url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute - Authenticated, rendering children");
  return children;
};

export default ProtectedRoute; 