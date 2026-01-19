import React, { useState, useEffect } from 'react';
import reportService from '../../services/reportService';
import LoadingSpinner from '../ui/Loading';
import { formatDate, formatDateTime } from '../../utils/helpers';
import { FiDownload, FiTrash2, FiRefreshCw } from 'react-icons/fi';

const ReportViewer = ({ userId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [userId]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getReports(userId);
      setReports(data);
      setError(null);
    } catch (err) {
      setError('Failed to load reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportId, format = 'pdf') => {
    try {
      const blob = await reportService.downloadReport(reportId, format);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${reportId}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download report');
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportService.deleteReport(reportId);
        setReports(reports.filter(r => r.id !== reportId));
      } catch (err) {
        alert('Failed to delete report');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading reports..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchReports}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No reports available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Reports</h2>
        <button
          onClick={fetchReports}
          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          <FiRefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-3 text-left">Report Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{report.name || 'Untitled Report'}</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {report.type || 'PDF'}
                  </span>
                </td>
                <td className="px-4 py-3">{formatDateTime(report.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDownload(report.id, report.type || 'pdf')}
                    className="text-blue-600 hover:text-blue-800 mr-3 inline-flex items-center gap-1"
                  >
                    <FiDownload size={16} /> Download
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                  >
                    <FiTrash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportViewer;
