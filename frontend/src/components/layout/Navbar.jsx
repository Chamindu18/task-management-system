import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar(){
    const { user, logout } = useAuth(); //ADD user from useAuth
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login"); // redirect to login after logout
    }

    return(
        <nav className="navbar">
            <div className="navbar-logo">Task Manager</div>
            <div className="navbar-links">
                <a href="/dashboard">Dashboard</a>
                
                {/* SHOW ADMIN LINK ONLY FOR ADMIN USERS */}
                {user?.role === 'ADMIN' && (
                    <a href="/admin/dashboard">Admin</a>
                )}
                
                <a href="/profile">Profile</a>
                <button 
                    className="logout-btn" 
                    onClick={handleLogout}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        marginLeft: '20px',
                        fontSize: '16px',
                        textDecoration: 'underline'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;