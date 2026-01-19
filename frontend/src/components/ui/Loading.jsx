import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${spinnerSize} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}></div>
      {text && <p className="mt-3 text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
