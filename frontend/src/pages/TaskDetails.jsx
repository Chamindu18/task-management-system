import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';

function TaskDetails() {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const handleEdit = () => {
        // navigate to an edit page for this task (route should exist in app)
        navigate(`/tasks/${id}/edit`);
    };

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
                    <h1>Task Details</h1>
                    <p>Viewing task ID: {id}</p>

                    {user && (
                        <div style={{ marginTop: '10px' }}>
                            <strong>Logged in as:</strong> {user.name || user.email || user.username}
                        </div>
                    )}

                    <div style={{ 
                        padding: '20px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px',
                        marginTop: '20px'
                    }}>
                        <h3>Task Details Page</h3>
                        <p>This page will show detailed information about a specific task.</p>

                        {/* Show Edit button only for admins (consumes `user`) */}
                        {user?.role === 'admin' && (
                            <button style={{ marginTop: '12px' }} onClick={handleEdit}>Edit Task</button>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default TaskDetails;