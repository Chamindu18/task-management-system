import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); 

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    // Helper function to check active link
    const isActiveLink = (path) => {
        return location.pathname === path;
    }

    return(
        <nav className="navbar">
            <div className="navbar-logo">
                <span className="logo-icon">✅</span>
                Task Manager
            </div>
            <div className="navbar-links">
                <a 
                    href="/dashboard" 
                    className={isActiveLink('/dashboard') ? 'nav-link active' : 'nav-link'}
                >
                    Dashboard
                </a>
                
                {/* ADMIN LINK WITH BADGE */}
                {user?.role === 'ADMIN' && (
                    <a 
                        href="/admin/dashboard" 
                        className={isActiveLink('/admin/dashboard') ? 'nav-link active admin-link' : 'nav-link admin-link'}
                    >
                        <span className="admin-badge">👑</span>
                        Admin
                    </a>
                )}
                
                <a 
                    href="/profile" 
                    className={isActiveLink('/profile') ? 'nav-link active' : 'nav-link'}
                >
                    Profile
                </a>
                
                {/* LOGOUT BUTTON */}
                <button 
                    className="logout-btn" 
                    onClick={handleLogout}
                >
                    <span className="logout-icon">🚪</span>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;