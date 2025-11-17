import "./Sidebar.css";
import { useAuth } from "../../hooks/useAuth";
import { useLocation } from "react-router-dom"; 

function Sidebar(){
    const { user } = useAuth();
    const location = useLocation(); 

    // Helper function to check active link
    const isActiveLink = (path) => {
        return location.pathname.startsWith(path);
    }

    return(
        <aside className="sidebar">
            {/* TASKS SECTION WITH ICONS */}
            <h3 className="sidebar-title">
                <span className="title-icon">📋</span>
                Tasks
            </h3>
            <ul className="sidebar-menu">
                <li>
                    <a 
                        href="/tasks/all" 
                        className={isActiveLink('/tasks/all') ? 'menu-link active' : 'menu-link'}
                    >
                        <span className="menu-icon">📁</span>
                        All Tasks
                    </a>
                </li> 
                <li>
                    <a 
                        href="/tasks/completed" 
                        className={isActiveLink('/tasks/completed') ? 'menu-link active' : 'menu-link'}
                    >
                        <span className="menu-icon">✅</span>
                        Completed
                    </a>
                </li>
                <li>
                    <a 
                        href="/tasks/pending" 
                        className={isActiveLink('/tasks/pending') ? 'menu-link active' : 'menu-link'}
                    >
                        <span className="menu-icon">⏳</span>
                        Pending
                    </a>
                </li>
                <li>
                    <a 
                        href="/tasks/due" 
                        className={isActiveLink('/tasks/due') ? 'menu-link active' : 'menu-link'}
                    >
                        <span className="menu-icon">📅</span>
                        Due Tasks
                    </a>
                </li>
                <li>
                    <a 
                        href="/tasks/new" 
                        className={isActiveLink('/tasks/new') ? 'menu-link active' : 'menu-link'}
                    >
                        <span className="menu-icon">➕</span>
                        Add Task
                    </a>
                </li>
            </ul>

            {/* ADMIN SECTION */}
            {user?.role === 'ADMIN' && (
                <>
                    <h3 className="sidebar-title admin-title">
                        <span className="title-icon">👑</span>
                        Admin
                    </h3>
                    <ul className="sidebar-menu admin-menu">
                        <li>
                            <a 
                                href="/admin/users" 
                                className={isActiveLink('/admin/users') ? 'menu-link active admin-link' : 'menu-link admin-link'}
                            >
                                <span className="menu-icon">👥</span>
                                User Management
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/admin/statistics" 
                                className={isActiveLink('/admin/statistics') ? 'menu-link active admin-link' : 'menu-link admin-link'}
                            >
                                <span className="menu-icon">📊</span>
                                System Statistics
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/admin/reports" 
                                className={isActiveLink('/admin/reports') ? 'menu-link active admin-link' : 'menu-link admin-link'}
                            >
                                <span className="menu-icon">📈</span>
                                Reports
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/admin/settings" 
                                className={isActiveLink('/admin/settings') ? 'menu-link active admin-link' : 'menu-link admin-link'}
                            >
                                <span className="menu-icon">⚙️</span>
                                Admin Settings
                            </a>
                        </li>
                    </ul>
                </>
            )}
        </aside>
    );
}

export default Sidebar;