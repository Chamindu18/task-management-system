import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children, adminOnly = false }) {
    const { isAuthenticated, user, loading } = useAuth();

    // Show loading while checking authentication
    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                backgroundColor: '#f8f9fa'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #007bff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '15px'
                }}></div>
                <p style={{ color: '#6c757d', margin: 0 }}>Loading...</p>
                <style>
                    {`@keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }`}
                </style>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check admin access if required
    if (adminOnly && user?.role !== 'ADMIN') {
        return (
            <div style={{ 
                padding: '40px', 
                textAlign: 'center',
                maxWidth: '500px',
                margin: '50px auto'
            }}>
                <h2 style={{ color: '#dc3545', marginBottom: '15px' }}>Access Denied</h2>
                <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                    You need administrator privileges to access this page.
                </p>
                <button 
                    onClick={() => window.history.back()}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Go Back
                </button>
            </div>
        );
    }

    // User is authenticated and authorized
    return children;
}

export default ProtectedRoute;