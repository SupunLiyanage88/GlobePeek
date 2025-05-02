import React from 'react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div 
      role="alert"
      className="max-w-md mx-auto my-8 p-6 bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="text-center">
        {/* Error Icon */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-red-600 mb-2">
          Country Data Unavailable
        </h2>

        {/* Help text */}
        <p className="text-gray-600 mb-4">
          We couldn't fetch the country information. This might be a temporary
          issue or there might be a problem with your connection.
        </p>

        {/* Error details (collapsible) */}
        {error && (
          <details className="mb-4 bg-gray-50 p-3 rounded-lg">
            <summary className="text-sm font-medium text-gray-700 cursor-pointer">
              Show error details
            </summary>
            <pre className="mt-2 text-xs text-gray-600 overflow-x-auto">
              {error.message}
            </pre>
          </details>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Retry Search
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Refresh Page
          </button>
        </div>

        {/* Additional help text */}
        <p className="text-sm text-gray-500 mt-4">
          If the problem persists, try searching for a different country or check
          back later.
        </p>
      </div>
    </div>
  );
};

export default ErrorFallback;