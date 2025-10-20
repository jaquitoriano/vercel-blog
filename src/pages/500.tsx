export default function Custom500() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Server Error</h1>
        <p className="text-gray-600 mb-6">
          Sorry, there was an error processing your request. Our team has been notified and is working to resolve the issue.
        </p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}