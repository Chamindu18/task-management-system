import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const TaskForm = ({ task, onSubmit, onCancel }) => {
    const { user } = useAuth();  // Get current user for assignedToId
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'TODO',  // Backend uses TODO, not PENDING
        dueDate: '',
        assignedToId: null  // Required by backend
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            // Convert backend status values to form values if needed
            let status = task.status || 'TODO';
            // Map backend status to form status if they differ
            if (status === 'PENDING') status = 'TODO';
            if (status === 'COMPLETED') status = 'DONE';
            
            setFormData({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'MEDIUM',
                status: status,
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                assignedToId: task.assignedToId || user?.id
            });
        }
    }, [task, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        else if (formData.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        else if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
        if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        // Check if user is loaded
        if (!user?.id) {
            console.error('❌ User not loaded:', user);
            alert('User information not loaded. Please refresh and try again.');
            return;
        }
        
        setLoading(true);
        try {
            // Convert date to LocalDateTime format (ISO 8601)
            const dateString = formData.dueDate ? `${formData.dueDate}T00:00:00` : null;
            
            // For new tasks, assign to current user if not already set
            // For existing tasks, keep the existing assignedToId
            const assignedTo = formData.assignedToId || user.id;
            
            const submitData = {
                ...formData,
                dueDate: dateString,
                assignedToId: assignedTo
            };
            console.log('👤 Current user:', user);
            console.log('📤 Final submission data:', JSON.stringify(submitData, null, 2));
            console.log('📅 Date string being sent:', dateString);
            await onSubmit(submitData);
            if (!task) setFormData({ 
                title: '', 
                description: '', 
                priority: 'MEDIUM', 
                status: 'TODO',  // Backend uses TODO
                dueDate: '',
                assignedToId: null
            });
        } catch (error) {
            console.error('❌ Task submission error:', error);
            console.error('❌ Error response:', error.response?.data);
            alert(`Failed to ${task ? 'update' : 'create'} task: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '30px' }}>
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '20px 30px',
                borderRadius: '20px 20px 0 0',
                margin: '-30px -30px 30px -30px'
            }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
                    {task ? '✏️ Edit Task' : '➕ Create New Task'}
                </h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#1e293b'
                    }}>
                        Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: errors.title ? '2px solid #ef4444' : '2px solid #e2e8f0',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                        placeholder="Enter task title"
                        onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                        onBlur={(e) => e.target.style.borderColor = errors.title ? '#ef4444' : '#e2e8f0'}
                    />
                    {errors.title && (
                        <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '5px' }}>
                            {errors.title}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#1e293b'
                    }}>
                        Description *
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: errors.description ? '2px solid #ef4444' : '2px solid #e2e8f0',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                        placeholder="Enter task description"
                        onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                        onBlur={(e) => e.target.style.borderColor = errors.description ? '#ef4444' : '#e2e8f0'}
                    />
                    {errors.description && (
                        <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '5px' }}>
                            {errors.description}
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: '#1e293b'
                        }}>
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                outline: 'none',
                                cursor: 'pointer',
                                background: 'white'
                            }}
                        >
                            <option value="LOW">🟢 Low</option>
                            <option value="MEDIUM">🟡 Medium</option>
                            <option value="HIGH">🔴 High</option>
                        </select>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: '#1e293b'
                        }}>
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                outline: 'none',
                                cursor: 'pointer',
                                background: 'white'
                            }}
                        >
                            <option value="TODO">⏳ Todo</option>
                            <option value="IN_PROGRESS">🔄 In Progress</option>
                            <option value="DONE">✅ Done</option>
                        </select>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: '#1e293b'
                        }}>
                            Due Date *
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: errors.dueDate ? '2px solid #ef4444' : '2px solid #e2e8f0',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                        {errors.dueDate && (
                            <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '5px' }}>
                                {errors.dueDate}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px' }}>
                    {onCancel && (
                        <button 
                            type="button" 
                            onClick={onCancel} 
                            disabled={loading}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                background: '#e2e8f0',
                                color: '#475569',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => !loading && (e.target.style.background = '#cbd5e1')}
                            onMouseLeave={(e) => e.target.style.background = '#e2e8f0'}
                        >
                            <FaTimes style={{ marginRight: '8px' }} /> Cancel
                        </button>
                    )}
                    <button 
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                        }}
                        onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        {loading ? (
                            <>Saving...</>
                        ) : (
                            <>
                                <FaSave style={{ marginRight: '8px' }} /> 
                                {task ? 'Update Task' : 'Create Task'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;