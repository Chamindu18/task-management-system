import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import './TaskDetails.css'; 

function TaskDetails() {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/tasks/${id}/edit`);
    };

    return (
        <>
            <Navbar />
            <Sidebar />
            <main className="taskdetails-content">
                <div className="taskdetails-container">
                    {/* PAGE HEADER */}
                    <div className="page-header">
                        <h1 className="page-title">Task Details</h1>
                        <p className="page-subtitle">Viewing task ID: {id}</p>
                    </div>

                    {/* USER INFO BAR */}
                    {user && (
                        <div className="user-info-bar">
                            <span className="user-label">Logged in as:</span>
                            <span className="user-name">{user.name || user.email || user.username}</span>
                        </div>
                    )}

                    {/* TASK DETAILS CARD */}
                    <div className="task-card">
                        <div className="task-header">
                            <h2>Task Information</h2>
                            {/* EDIT BUTTON FOR ADMINS */}
                            {user?.role === 'ADMIN' && (
                                <button className="edit-btn" onClick={handleEdit}>
                                    Edit Task
                                </button>
                            )}
                        </div>

                        <div className="task-content">
                            <div className="task-info-grid">
                                <div className="info-group">
                                    <label>Task Title</label>
                                    <p>--</p>
                                </div>
                                <div className="info-group">
                                    <label>Description</label>
                                    <p>--</p>
                                </div>
                                <div className="info-group">
                                    <label>Status</label>
                                    <p>--</p>
                                </div>
                                <div className="info-group">
                                    <label>Priority</label>
                                    <p>--</p>
                                </div>
                                <div className="info-group">
                                    <label>Due Date</label>
                                    <p>--</p>
                                </div>
                                <div className="info-group">
                                    <label>Assigned To</label>
                                    <p>--</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PLACEHOLDER FOR COMMENTS SECTION */}
                    <div className="comments-section">
                        <h2>Comments & Activity</h2>
                        <div className="comments-placeholder">
                            <p>Task comments and activity timeline will appear here</p>
                        </div>
                    </div>

                    {/* PLACEHOLDER FOR ATTACHMENTS */}
                    <div className="attachments-section">
                        <h2>Attachments</h2>
                        <div className="attachments-placeholder">
                            <p>Task attachments and files will be displayed here</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default TaskDetails;