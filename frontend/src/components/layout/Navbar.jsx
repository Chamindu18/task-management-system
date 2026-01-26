import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
        <nav className="navbar" aria-label="Primary navigation">
            <Link to="/dashboard" className="navbar-logo" aria-label="DreamDoo - Go to dashboard">
                <span className="logo-icon">✅</span>
                <span className="brand-text">DreamDoo</span>
            </Link>
            <div className="navbar-links">
                <Link 
                    to="/dashboard" 
                    className={isActiveLink('/dashboard') ? 'nav-link active' : 'nav-link'}
                    aria-current={isActiveLink('/dashboard') ? 'page' : undefined}
                >
                    Dashboard
                </Link>
                
                {/* ADMIN LINK WITH BADGE */}
                {user?.role === 'ADMIN' && (
                    <Link 
                        to="/admin/dashboard" 
                        className={isActiveLink('/admin/dashboard') ? 'nav-link active admin-link' : 'nav-link admin-link'}
                        aria-current={isActiveLink('/admin/dashboard') ? 'page' : undefined}
                    >
                        <span className="admin-badge">👑</span>
                        Admin
                    </Link>
                )}
                
                <Link 
                    to="/profile" 
                    className={isActiveLink('/profile') ? 'nav-link active' : 'nav-link'}
                    aria-current={isActiveLink('/profile') ? 'page' : undefined}
                >
                    Profile
                </Link>
                
                {/* LOGOUT BUTTON */}
                <button 
                    className="logout-btn" 
                    onClick={handleLogout}
                    aria-label="Sign out of your account"
                >
                    <span className="logout-icon">🚪</span>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;