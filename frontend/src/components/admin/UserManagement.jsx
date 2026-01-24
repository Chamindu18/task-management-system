import React, { useState, useMemo } from 'react';
import { RefreshCw, UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const UserManagement = ({ users, onRefresh, onSelectUser, onAddUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const itemsPerPage = 8;

  // Simple filter - search only
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [users, searchQuery]);

  // Pagination
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleAddUser = (newUser) => {
    onAddUser(newUser);
    setShowAddModal(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = (updatedUser) => {
    // Update the user in the parent component's state
    onAddUser(updatedUser); // Reuse onAddUser to update the list
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    
    setDeleteLoading(true);
    setDeleteError('');
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${deletingUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to delete user');
      }
      
      // Close modal and refresh
      setShowDeleteModal(false);
      setDeletingUser(null);
      onRefresh(); // Refresh the user list from server
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="user-management">
        {/* Header */}
        <div className="um-header">
          <h2 className="um-title">User Management</h2>
          <div className="um-actions">
            <button className="btn btn-secondary" onClick={onRefresh}>
              <RefreshCw size={18} />
              Refresh
            </button>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <UserPlus size={18} />
              Add User
            </button>
          </div>
        </div>

        {/* Simple Search */}
        <div className="um-filters">
          <SearchBar
            placeholder="Search users by name or email..."
            onSearch={setSearchQuery}
            className="um-search"
          />
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          {paginatedUsers.length === 0 ? (
            <div className="empty-state">
              <Users size={48} className="empty-icon" />
              <h3>No users found</h3>
              <p>Try adjusting your search or add a new user</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Tasks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(user => (
                  <tr key={user.id}>
                    {/* User Name with Avatar and Role Badge */}
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                        <div className="user-details">
                          <div className="user-name">{user.name}</div>
                          <span className={`role-badge ${user.role?.toLowerCase() === 'admin' ? 'admin' : 'user'}`}>
                            {user.role || 'USER'}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Email */}
                    <td>
                      <span className="user-email">{user.email}</span>
                    </td>
                    
                    {/* Tasks Completed */}
                    <td>
                      <span className="tasks-badge">{user.tasksCompleted || 0}</span>
                    </td>
                    
                    {/* Actions */}
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn view" 
                          title="View Analytics"
                          onClick={() => onSelectUser(user)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="action-btn edit" 
                          title="Edit User"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="action-btn delete" 
                          title="Delete User"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddUser}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <EditUserModal 
          user={editingUser}
          onClose={() => {
            setShowEditModal(false);
            setEditingUser(null);
          }}
          onUpdate={handleUpdateUser}
        />
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && deletingUser && (
        <DeleteConfirmModal 
          userName={deletingUser.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingUser(null);
            setDeleteError('');
          }}
          loading={deleteLoading}
        />
      )}

      {/* Delete Error Toast */}
      {deleteError && (
        <div className="error-toast">
          {deleteError}
        </div>
      )}
    </>
  );
};

export default UserManagement;