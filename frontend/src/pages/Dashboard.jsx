import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

function Dashboard() {
    return (
        <>
            <Navbar />
            <Sidebar />
            <main className="dashboard-content" style={{ 
                marginLeft: '240px', 
                marginTop: '70px', 
                padding: '20px' 
            }}>
                <h2>Dashboard</h2>
                <p>Welcome to your task management dashboard. Here you can view and manage all your tasks efficiently.</p>
            </main>
        </>
    );
}

export default Dashboard;