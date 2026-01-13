import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import SystemStatistics from '../../components/admin/SystemStatistics';
import UserManagementTable from '../../components/admin/UserManagementTable';
import ReportsView from '../../components/admin/ReportsView';
import AdminSettings from '../../components/admin/AdminSettings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('statistics');

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0F172A',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div style={{ flex: 1, background: '#F1F5F9', overflowY: 'auto' }}>
        <AdminHeader activeTab={activeTab} />
        
        <div style={{ padding: '32px' }}>
          {activeTab === 'statistics' && <SystemStatistics />}
          {activeTab === 'users' && <UserManagementTable />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </div>
    </div>
  );
}