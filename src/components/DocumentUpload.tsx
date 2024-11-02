import React, { useCallback, useState } from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';
import { Documents } from '../types';

interface DocumentUploadProps {
  documents: Documents;
  onUpload: (type: keyof Documents, file: File) => void;
  onSubmit: () => void;
}

export default function DocumentUpload({ documents, onUpload, onSubmit }: DocumentUploadProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDrop = useCallback((type: keyof Documents, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onUpload(type, file);
      // Convert file to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // In a real app, you'd send this to your backend
          console.log(`Document ${type} uploaded:`, reader.result.substring(0, 50) + '...');
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onUpload]);

  const handleFileChange = useCallback((type: keyof Documents, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(type, file);
      // Convert file to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // In a real app, you'd send this to your backend
          console.log(`Document ${type} uploaded:`, reader.result.substring(0, 50) + '...');
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onUpload]);

  const handleSubmit = () => {
    setIsSubmitted(true);
    onSubmit();
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Documents Submitted Successfully</h2>
        <p className="text-gray-600 mb-8">
          Your documents have been uploaded and are now being reviewed by our team.
          You can check the status anytime using your tracking link.
        </p>
      </div>
    );
  }

  const renderUploadZone = (type: keyof Documents, title: string) => {
    const doc = documents[type];
    const isUploaded = doc.file !== null;

    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(type, e)}
          className={`relative border-2 border-dashed rounded-lg p-6 ${
            isUploaded 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-300 bg-gray-50 hover:border-blue-400'
          } transition-colors duration-200`}
        >
          <input
            type="file"
            onChange={(e) => handleFileChange(type, e)}
            accept="image/*,.pdf"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="text-center">
            {isUploaded ? (
              <>
                <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm font-medium text-gray-900">{doc.file.name}</p>
                <p className="text-xs text-green-600 mt-1">File uploaded successfully</p>
              </>
            ) : (
              <>
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-900">
                  Drag and drop or click to upload
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: PDF, JPG, PNG
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const isComplete = documents.passport.file && documents.proofOfAddress.file;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Document Upload</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please upload clear, legible scans or photos of your documents
        </p>
      </div>

      <div className="space-y-6">
        {renderUploadZone('passport', 'Passport')}
        {renderUploadZone('proofOfAddress', 'Proof of Address')}
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800">Document Requirements:</h4>
        <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
          <li>Passport must be valid and not expired</li>
          <li>Proof of address must be less than 3 months old</li>
          <li>Documents must be clearly visible and unobstructed</li>
          <li>File size should not exceed 10MB</li>
        </ul>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Submit Documents for Review
        </button>
      </div>
    </div>
  );
}