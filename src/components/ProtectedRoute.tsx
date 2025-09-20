import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ProtectedRouteProps } from '../types/auth';

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth();
  
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}

export default ProtectedRoute;