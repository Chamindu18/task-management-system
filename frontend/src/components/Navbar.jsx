import "./Navbar.css";

function Navbar(){
    return(
        <nav className="navbar">
            <div className="navbar-logo">Task Manager</div>
            <div className="navbar-links">
                <a href="/dashboard">Dashboard</a>
                <a href="/profile">Profile</a>
                <a href="/login">Logout</a>
            </div>
        </nav>
    );
}

export default Navbar;