import React, { useState, useMemo } from 'react';
import { RefreshCw, UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import AddUserModal from './AddUserModal';

const UserManagement = ({ users, onRefresh, onSelectUser, onAddUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
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

        {/* Super Simple Users Table - Only 4 Columns */}
        <div className="users-table-container">
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
                  {/* User Name with Avatar */}
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">{user.name.charAt(0)}</div>
                      <div className="user-name">{user.name}</div>
                    </div>
                  </td>
                  
                  {/* Email */}
                  <td>{user.email}</td>
                  
                  {/* Tasks Completed */}
                  <td>{user.tasksCompleted}</td>
                  
                  {/* Actions */}
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn" 
                        title="View Analytics"
                        onClick={() => onSelectUser(user)}
                      >
                        <Eye size={16} />
                      </button>
                      <button className="action-btn" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="action-btn danger" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </>
  );
};

export default UserManagement;