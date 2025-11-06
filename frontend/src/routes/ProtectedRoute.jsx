import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }){
    // for now simulate authentication using localStorage
    const token = localStorage.getItem('token');

    if(!token){
        // user not logged in -> redirect to login page
        return <Navigate to="/login" replace />;
    }

    // if logged in -> show requested page
    return children;
}

export default ProtectedRoute;