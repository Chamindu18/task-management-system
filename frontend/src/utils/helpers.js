// Date and Time Utilities
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
};

export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return formatDate(dateString);
};

// Text Utilities
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatPriority = (priority) => {
  if (!priority) return 'Unknown';
  return capitalizeFirst(priority);
};

export const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return capitalizeFirst(status);
};

// Validation Utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUsername = (username) => {
  return username && username.length >= 3;
};

// Number Utilities
export const formatNumber = (num) => {
  if (typeof num !== 'number') return 0;
  return Math.round(num * 100) / 100;
};

export const formatPercentage = (num, decimals = 1) => {
  if (typeof num !== 'number') return '0%';
  return `${formatNumber(num * 100).toFixed(decimals)}%`;
};

// Color Utilities
export const getPriorityColor = (priority) => {
  const colors = {
    high: '#ff6b6b',
    medium: '#ffd93d',
    low: '#6bcf7f'
  };
  return colors[priority?.toLowerCase()] || '#999';
};

export const getStatusColor = (status) => {
  const colors = {
    pending: '#ffd93d',
    'in-progress': '#4ecdc4',
    completed: '#6bcf7f',
    overdue: '#ff6b6b'
  };
  return colors[status?.toLowerCase()] || '#999';
};

// Array Utilities
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, ascending = true) => {
  return [...array].sort((a, b) => {
    if (ascending) {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};
