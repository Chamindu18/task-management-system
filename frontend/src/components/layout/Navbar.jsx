import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar(){
    const { logout } = useAuth();
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
                <a href="/profile">Profile</a>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;