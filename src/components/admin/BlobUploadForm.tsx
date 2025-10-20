'use client';

import { useState, useRef, ChangeEvent } from 'react';

interface BlobUploadFormProps {
  onFileSelect: (file: File) => Promise<void>;
  buttonText?: string;
  maxSizeMB?: number;
}

export function BlobUploadForm({
  onFileSelect,
  buttonText = 'Upload File',
  maxSizeMB = 5
}: BlobUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setErrorMessage('');
    
    if (!file) {
      setSelectedFile(null);
      setIsValid(false);
      return;
    }
    
    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSizeBytes) {
      setSelectedFile(file);
      setIsValid(false);
      setErrorMessage(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    
    setSelectedFile(file);
    setIsValid(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !isValid) return;
    
    try {
      await onFileSelect(selectedFile);
    } catch (error) {
      console.error('Error handling file:', error);
    }
  };

  const handleButtonClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,application/pdf"
        />
        
        <button
          type="button"
          onClick={handleButtonClick}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mb-2"
        >
          Select File
        </button>
        
        {selectedFile && (
          <div className="p-3 bg-gray-50 rounded-md border text-sm">
            <p className="font-medium truncate">{selectedFile.name}</p>
            <p className="text-gray-500 text-xs">
              {(selectedFile.size / 1024).toFixed(2)} KB · {selectedFile.type}
            </p>
          </div>
        )}
        
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={!selectedFile || !isValid}
        className={`px-4 py-2 rounded-md w-full ${
          selectedFile && isValid
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {buttonText}
      </button>
    </form>
  );
}