import "./Sidebar.css";
import { useAuth } from "../../hooks/useAuth";

function Sidebar(){
    const { user } = useAuth();

    return(
        <aside className="sidebar">
            <h3 className="sidebar-title">Tasks</h3>
            <ul className="sidebar-menu">
                <li><a href="/tasks/all">All Tasks</a></li> 
                <li><a href="/tasks/completed">Completed</a></li>
                <li><a href="/tasks/pending">Pending</a></li>
                <li><a href="/tasks/due">Due Tasks</a></li>
                <li><a href="/tasks/new">Add Task</a></li>
            </ul>

            {/* ADMIN-ONLY SIDEBAR SECTION */}
            {user?.role === 'ADMIN' && (
                <>
                    <h3 className="sidebar-title" style={{ marginTop: '30px' }}>Admin</h3>
                    <ul className="sidebar-menu">
                        <li><a href="/admin/users">User Management</a></li>
                        <li><a href="/admin/statistics">System Statistics</a></li>
                        <li><a href="/admin/reports">Reports</a></li>
                        <li><a href="/admin/settings">Admin Settings</a></li>
                    </ul>
                </>
            )}
        </aside>
    );
}

export default Sidebar;