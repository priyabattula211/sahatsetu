import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../lib/utils';
import { LoadingState } from '../components/ui/LoadingState';

export function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState label="Checking access..." />;
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate replace to={getDashboardPath(user.role)} />;
  }

  return <Outlet />;
}
