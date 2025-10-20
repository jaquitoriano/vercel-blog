'use client';

import { useState } from 'react';
import { BlobUploadForm } from '@/components/admin/BlobUploadForm';

export default function BlobTestPage() {
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<any>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload using our server API endpoint
      const response = await fetch('/api/admin/blob/upload-test', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Upload failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      setUploadUrl(data.url);
      setTestResults({
        success: true,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        mimeType: file.type,
        url: data.url,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
      setTestResults({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testDirectUpload = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);
      
      // Test direct client upload
      const response = await fetch('/api/admin/blob/get-upload-url', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to get upload URL: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Perform the actual upload to Vercel Blob directly
      const uploadResponse = await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Direct upload failed with status: ${uploadResponse.status}`);
      }
      
      setUploadUrl(data.url);
      setTestResults({
        success: true,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        mimeType: file.type,
        url: data.url,
        method: 'Direct client upload',
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Direct upload error:', err);
      setError(err.message || 'Direct upload failed');
      setTestResults({
        success: false,
        error: err.message,
        method: 'Direct client upload',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Vercel Blob Upload Test</h1>
          <p className="mt-1 text-sm text-gray-600">Test file uploads to Vercel Blob storage</p>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start p-4 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">About This Test</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>This page tests Vercel Blob uploads using two methods:</p>
                <ol className="list-decimal list-inside mt-1 ml-2 space-y-1">
                  <li><span className="font-medium">Server-side upload</span> - Files are uploaded through your server API</li>
                  <li><span className="font-medium">Direct client upload</span> - Files are uploaded directly from the browser</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-b border-gray-200">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                  <h2 className="text-lg font-medium text-gray-900">Server-Side Upload</h2>
                </div>
                <p className="mt-1 text-sm text-gray-600">Recommended approach for most applications</p>
              </div>
              <div className="p-5">
                <BlobUploadForm onFileSelect={handleFileUpload} buttonText="Test Server Upload" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-b border-gray-200">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <h2 className="text-lg font-medium text-gray-900">Direct Client Upload</h2>
                </div>
                <p className="mt-1 text-sm text-gray-600">Alternative approach for client-heavy applications</p>
              </div>
              <div className="p-5">
                <BlobUploadForm onFileSelect={testDirectUpload} buttonText="Test Direct Upload" />
              </div>
            </div>
          </div>
        </div>
        
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-5 rounded-lg shadow-xl flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <span className="text-gray-700">Uploading file...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mx-6 mb-6">
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Upload Failed</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {testResults && (
          <div className="mx-6 mb-6">
            <div className={`rounded-lg shadow-sm overflow-hidden border ${
              testResults.success ? 'border-green-200' : 'border-red-200'
            }`}>
              <div className={`px-4 py-3 sm:px-6 ${
                testResults.success ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium ${
                    testResults.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testResults.success ? 'Upload Successful' : 'Upload Failed'}
                  </h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-white border border-gray-200">
                    {new Date(testResults.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              
              <div className="px-4 py-5 sm:px-6 bg-white">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  {testResults.fileName && (
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">File Name</dt>
                      <dd className="mt-1 text-sm text-gray-900 truncate">{testResults.fileName}</dd>
                    </div>
                  )}
                  {testResults.fileSize && (
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">File Size</dt>
                      <dd className="mt-1 text-sm text-gray-900">{testResults.fileSize}</dd>
                    </div>
                  )}
                  {testResults.mimeType && (
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">MIME Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">{testResults.mimeType}</dd>
                    </div>
                  )}
                  {testResults.method && (
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Upload Method</dt>
                      <dd className="mt-1 text-sm text-gray-900">{testResults.method}</dd>
                    </div>
                  )}
                  {testResults.url && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">File URL</dt>
                      <dd className="mt-1 text-sm text-gray-900 break-all">
                        <a href={testResults.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {testResults.url}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>

                {uploadUrl && testResults.mimeType?.startsWith('image/') && (
                  <div className="mt-6 border rounded-md overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                      <img 
                        src={uploadUrl} 
                        alt="Uploaded file preview" 
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="p-2 bg-gray-50 border-t border-gray-200 text-center">
                      <span className="text-sm text-gray-500">Image Preview</span>
                    </div>
                  </div>
                )}
                
                {uploadUrl && !testResults.mimeType?.startsWith('image/') && (
                  <div className="mt-6 border rounded-md overflow-hidden">
                    <div className="p-8 bg-gray-50 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                      </svg>
                      <p className="mt-2 text-sm font-medium text-gray-900">File uploaded successfully!</p>
                      <div className="mt-4">
                        <a 
                          href={uploadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                          View File
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between">
            <button
              onClick={() => window.location.href = '/admin/diagnostics'}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Diagnostics
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Run Another Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}