'use client';

import { useState, useEffect } from 'react';

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagnostics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/diagnostics');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setDiagnostics(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching diagnostics:', err);
        setError(err.message || 'Failed to fetch diagnostics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDiagnostics();
  }, []);

  const runBlobConfigCheck = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/blob-config');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      alert(JSON.stringify(data, null, 2));
    } catch (err: any) {
      console.error('Error checking blob config:', err);
      alert(`Error: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const checkTokenStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/diagnostics/token');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Display token info in a more readable format
      const tokenInfo = data.tokenInfo;
      let message = '🔑 Token Diagnosis:\n\n';
      
      if (tokenInfo.exists) {
        message += `✅ Token exists (length: ${tokenInfo.length})\n`;
        message += `✅ Prefix: ${tokenInfo.prefix}\n`;
        message += `✅ Format: ${tokenInfo.format}\n`;
        message += `✅ Permissions: ${tokenInfo.permissions}\n`;
        
        if (tokenInfo.storeIdPartMatch) {
          message += `✅ Token matches store ID\n`;
        } else {
          message += `❌ Token doesn't match store ID\n`;
        }
        
        if (tokenInfo.format !== 'valid') {
          message += `\n⚠️ Your token format appears to be invalid. Please generate a new token.\n`;
        }
      } else {
        message += `❌ No token found in environment variables\n`;
      }
      
      message += `\n🔧 If you're getting "Access denied" errors, you need a new token.\n`;
      message += `\nHow to get a new token:\n`;
      data.helpInfo.steps.forEach((step: string, index: number) => {
        message += `${index + 1}. ${step}\n`;
      });
      
      alert(message);
    } catch (err: any) {
      console.error('Error checking token status:', err);
      alert(`Error: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Environment Diagnostics</h1>
          <p className="mt-1 text-sm text-gray-600">Review and troubleshoot your environment configuration</p>
        </div>
        
        {error && (
          <div className="mx-6 my-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">Error loading diagnostics</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading diagnostics...</span>
          </div>
        ) : diagnostics ? (
          <div className="divide-y divide-gray-200">
            {/* Blob Configuration Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Blob Storage Configuration</h2>
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  diagnostics.blobTokenSet && diagnostics.storeIdSet 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {diagnostics.blobTokenSet && diagnostics.storeIdSet ? 'Ready' : 'Needs Setup'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Configuration Status</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className={`flex-shrink-0 w-5 h-5 mr-2 ${diagnostics.blobTokenSet ? 'text-green-500' : 'text-red-500'}`}>
                        {diagnostics.blobTokenSet ? (
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        ) : (
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                          </svg>
                        )}
                      </span>
                      <span>Blob Token: {diagnostics.blobTokenSet ? 'Configured' : 'Not Found'}</span>
                    </li>
                    <li className="flex items-center">
                      <span className={`flex-shrink-0 w-5 h-5 mr-2 ${diagnostics.storeIdSet ? 'text-green-500' : 'text-red-500'}`}>
                        {diagnostics.storeIdSet ? (
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        ) : (
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                          </svg>
                        )}
                      </span>
                      <span>Store ID: {diagnostics.storeIdSet ? 'Configured' : 'Not Found'}</span>
                    </li>
                  </ul>

                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={runBlobConfigCheck}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Test Configuration
                    </button>
                    <button 
                      onClick={checkTokenStatus}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Check Token Status
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  {diagnostics.blobTokenSet ? (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Troubleshooting</h3>
                      <div className="p-3 border-l-4 border-amber-400 bg-amber-50 rounded-r-md">
                        <p className="font-medium text-amber-800 mb-2">If you're seeing "Access denied" errors:</p>
                        <ol className="list-decimal list-inside text-sm text-amber-700 ml-2 space-y-1">
                          <li>Your token may be invalid or expired</li>
                          <li>You'll need to generate a new token from Vercel</li>
                          <li>Use the "Check Token Status" for instructions</li>
                        </ol>
                      </div>
                      <div className="mt-4">
                        <button 
                          onClick={() => window.location.href = '/admin/diagnostics/blob-test'}
                          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Run Upload Test
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Setup Instructions</h3>
                      <div className="p-3 border-l-4 border-blue-400 bg-blue-50 rounded-r-md">
                        <p className="font-medium text-blue-800 mb-2">To configure Vercel Blob storage:</p>
                        <ol className="list-decimal list-inside text-sm text-blue-700 ml-2 space-y-1">
                          <li>Go to Vercel Dashboard</li>
                          <li>Navigate to Storage → Create Blob Store</li>
                          <li>Generate a Read/Write token</li>
                          <li>Add to your .env.local file</li>
                        </ol>
                      </div>
                      <div className="mt-4">
                        <button 
                          onClick={checkTokenStatus}
                          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Get Detailed Instructions
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Environment Details Section */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Environment Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
                <pre className="text-sm text-gray-700">{JSON.stringify(diagnostics, null, 2)}</pre>
              </div>
            </div>
            
            {/* Actions Section */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Refresh Page
                </button>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Clear Storage &amp; Refresh
                </button>
                <button 
                  onClick={() => window.location.href = '/admin/diagnostics/blob-test'}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  Blob Upload Test
                </button>
                <button 
                  onClick={() => window.location.href = '/admin'}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Back to Admin
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="mt-2 text-gray-500">No diagnostics data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}