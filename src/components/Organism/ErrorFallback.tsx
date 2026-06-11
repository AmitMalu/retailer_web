import { IconAlertTriangle } from "@tabler/icons-react";
import { FallbackProps } from "react-error-boundary";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {

  const isChunkLoadError = /Loading chunk [\d]+ failed|ChunkLoadError/i.test(
    (error as Error)?.message || ""
  );

  const handleRecover = () => {
    if (isChunkLoadError) {
      // Force a hard reload to get latest assets
      window.location.reload();
    } else {
      resetErrorBoundary(); // fallback to standard error recovery
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-background-paper border border-red-200 shadow-md rounded-xl p-6 max-w-md w-full text-center">
        <div className="flex justify-center text-red-500 mb-4">
          <IconAlertTriangle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          An unexpected error occurred. Please try again or reload the page.
        </p>

        <pre className="bg-gray-100 text-red-600 text-xs p-3 rounded-md overflow-auto max-h-40">
          {(error as Error).message}
        </pre>

        <button
          onClick={handleRecover}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-lg transition"
        >
          {isChunkLoadError ? "Reload Page" : "Try Again"}
        </button>
      </div>
    </div>
  );
}
