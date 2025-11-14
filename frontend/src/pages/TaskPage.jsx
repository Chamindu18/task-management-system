import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

function TaskPage() {
    const { user } = useAuth();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ display: 'flex', flex: 1, marginTop: '60px' }}>
                <Sidebar />
                <main style={{ 
                    flex: 1, 
                    padding: '20px',
                    marginLeft: '220px'
                }}>
                    <h1>Task Management</h1>
                    <p>Welcome, {user?.username}! This is the task management page.</p>
                    <div style={{ 
                        padding: '20px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px',
                        marginTop: '20px'
                    }}>
                        <h3>Task Features Coming Soon</h3>
                        <p>This page will contain:</p>
                        <ul>
                            <li>Task list view</li>
                            <li>Add new task form</li>
                            <li>Task filtering and search</li>
                        </ul>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default TaskPage;