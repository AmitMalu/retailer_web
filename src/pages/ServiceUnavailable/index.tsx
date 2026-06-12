import React from "react";

const ServiceUnavailable: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        {/* Cloud / server off icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M9.75 9.75A4.502 4.502 0 0012 9a4.5 4.5 0 014.472 3.965M6.257 6.257A7.5 7.5 0 0119.5 13.5H20a2 2 0 010 4H7M3 13a5 5 0 004.9 5.991"
          />
        </svg>
      </div>

      <h1 className="mb-2 text-2xl font-semibold text-gray-800">
        Service Unavailable
      </h1>

      <p className="mb-6 max-w-sm text-sm text-gray-500">
        We couldn't load the application configuration. Please check your
        connection and try again.
      </p>

      <button
        onClick={handleRetry}
        className="rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Try Again
      </button>
    </div>
  );
};

export default ServiceUnavailable;
