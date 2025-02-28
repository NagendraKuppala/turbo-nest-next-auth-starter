'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      
      {/* Display error message if available */}
      <p className="text-gray-600 mb-4 text-center max-w-md">
        {error.message || 'An unexpected error occurred'}
      </p>
      
      {/* Show error digest in development */}
      {process.env.NODE_ENV === 'development' && error.digest && (
        <p className="text-sm text-gray-500 mb-4">
          Error digest: {error.digest}
        </p>
      )}
      
      <button
        className="btn bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}