import React, { useState } from 'react';
import { X, User, Mail, Lock, Shield, AlertCircle } from 'lucide-react';

const AddUserModal = ({ onClose, onAdd }) => {

  //  Name, Email, Password, Role
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Name validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password length check
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      // Call backend API
      const response = await fetch('http://localhost:8080/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to add user');
      }
      
      // Add new user to list (use data from backend)
      const newUser = data.data;
      onAdd({
        id: newUser.id,
        name: newUser.username || newUser.name,
        email: newUser.email,
        role: newUser.role,
        tasksCompleted: newUser.tasksCompleted || 0
      });
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div 
        className="admin-modal add-user-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-modal-title"
      >
        {/* Modal Header */}
        <div className="admin-modal-header">
          <h2 id="add-user-modal-title">Add New User</h2>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-modal-body">
          {error && (
            <div className="admin-modal-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          
          {/* Role Dropdown */}
          <div className="admin-form-group">
            <label>
              <span className="label-icon"><Shield size={18} /></span>
              <span className="label-text">User Role</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="admin-form-select"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Full Name */}
          <div className="admin-form-group">
            <label>
              <span className="label-icon"><User size={18} /></span>
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="admin-form-input"
              required
            />
          </div>

          {/* Email */}
          <div className="admin-form-group">
            <label>
              <span className="label-icon"><Mail size={18} /></span>
              <span className="label-text">Email Address</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@gmail.com"
              className="admin-form-input"
              required
            />
          </div>

          {/* Password */}
          <div className="admin-form-group">
            <label>
              <span className="label-icon"><Lock size={18} /></span>
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="admin-form-input"
              required
            />
            <small className="field-hint">Password must be at least 6 characters long</small>
          </div>

          {/* Footer Buttons */}
          <div className="admin-modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default AddUserModal;