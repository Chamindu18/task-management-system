import { useAuth } from '../../hooks/useAuth';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';

function Profile() {
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
                    <h1>User Profile</h1>
                    <div style={{ 
                        maxWidth: '500px',
                        padding: '20px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px'
                    }}>
                        <p><strong>Username:</strong> {user?.username}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Role:</strong> {user?.role}</p>
                        <p><strong>User ID:</strong> {user?.id}</p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Profile;  