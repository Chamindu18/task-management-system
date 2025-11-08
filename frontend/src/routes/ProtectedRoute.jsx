import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children, adminOnly = false }) {
    const { isAuthenticated, user, loading } = useAuth();

    // Show loading while checking authentication
    if (loading) {
        return <div>Loading...</div>;
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check admin access if required
    if (adminOnly && user?.role !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    // User is authenticated and authorized
    return children;
}

export default ProtectedRoute;