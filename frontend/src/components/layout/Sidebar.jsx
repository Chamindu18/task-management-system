import "./Sidebar.css";

function Sidebar(){
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
        </aside>
    );
}

export default Sidebar;