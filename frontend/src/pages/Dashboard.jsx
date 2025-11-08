import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Dashboard() {
    return (
        <>
            <Navbar/>
            <Sidebar/>
            <main className="dashboard-content">
                <h2>Dashboard</h2>
                <p>Welcome to your task management dashboard. Here you can view and manage all your tasks efficiently.</p>
            </main>
        </>
    );
}

export default Dashboard;