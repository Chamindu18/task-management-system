import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ userName, onConfirm, onCancel, loading = false }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="warning-icon">
            <AlertTriangle size={24} />
          </div>
          <h2>Confirm Delete User</h2>
          <button className="modal-close" onClick={onCancel}>
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <p className="warning-text">
            Are you sure you want to delete user <strong>{userName}</strong>?
          </p>
          <p className="info-text">
            This action will:
          </p>
          <ul className="info-list">
            <li>Permanently delete the user account</li>
            <li>Remove all associated user settings</li>
            <li>Unassign all tasks from this user</li>
          </ul>
          <p className="danger-text">
            ⚠️ This action cannot be undone!
          </p>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete User'}
          </button>
        </div>
      </div>

      {/* Inline Styles */}
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
          animation: fadeIn 0.2s;
        }

        .delete-confirm-modal {
          background: white;
          border-radius: 1rem;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s;
        }

        .modal-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .warning-icon {
          color: #dc2626;
          display: flex;
          align-items: center;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          color: #1e293b;
          margin: 0;
          flex: 1;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: #f1f5f9;
          color: #1e293b;
        }

        .modal-body {
          padding: 2rem;
        }

        .warning-text {
          font-size: 1rem;
          color: #334155;
          margin-bottom: 1rem;
        }

        .warning-text strong {
          color: #dc2626;
          font-weight: 600;
        }

        .info-text {
          font-size: 0.95rem;
          color: #64748b;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .info-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem 0;
        }

        .info-list li {
          padding: 0.5rem 0 0.5rem 1.5rem;
          color: #64748b;
          font-size: 0.9rem;
          position: relative;
        }

        .info-list li:before {
          content: "•";
          position: absolute;
          left: 0.5rem;
          color: #94a3b8;
        }

        .danger-text {
          background: #fee2e2;
          color: #991b1b;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
        }

        .modal-footer {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding: 1.5rem 2rem;
          border-top: 1px solid #e2e8f0;
        }

        .btn {
          padding: 0.625rem 1.25rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f1f5f9;
          color: #334155;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #e2e8f0;
        }

        .btn-danger {
          background: #dc2626;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #b91c1c;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DeleteConfirmModal;
