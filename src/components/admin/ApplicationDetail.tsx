import React, { useState } from 'react';
import { Application } from '../../types';
import { FileText, User, Building2, Flag, Phone, MapPin, Mail, Link, Eye } from 'lucide-react';

interface ApplicationDetailProps {
  application: Application;
  onUpdateStatus: (
    type: 'documents' | 'company' | 'ein',
    status: string,
    ein?: string
  ) => void;
}

export default function ApplicationDetail({ application, onUpdateStatus }: ApplicationDetailProps) {
  const { clientData, status, documents } = application;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const trackingUrl = `${window.location.origin}/track/${status.trackingId}`;

  const copyTrackingLink = () => {
    navigator.clipboard.writeText(trackingUrl);
    alert('Tracking link copied to clipboard!');
  };

  const handlePreviewDocument = (type: 'passport' | 'proofOfAddress') => {
    if (documents[type].file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreviewUrl(reader.result);
          setShowPreview(true);
        }
      };
      reader.readAsDataURL(documents[type].file as File);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Document Preview Modal */}
      {showPreview && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Document Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <img src={previewUrl} alt="Document Preview" className="max-w-full h-auto" />
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Application Details
        </h3>
      </div>
      
      {/* Client Information */}
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          {/* ... (previous client information fields remain the same) ... */}
        </dl>
      </div>

      {/* Documents Section */}
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Documents</h4>
        <div className="space-y-4">
          {/* Passport Document */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-900">Passport</span>
            </div>
            <div className="flex items-center space-x-2">
              {documents.passport.file && (
                <button
                  onClick={() => handlePreviewDocument('passport')}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </button>
              )}
            </div>
          </div>

          {/* Proof of Address Document */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-900">Proof of Address</span>
            </div>
            <div className="flex items-center space-x-2">
              {documents.proofOfAddress.file && (
                <button
                  onClick={() => handlePreviewDocument('proofOfAddress')}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </button>
              )}
            </div>
          </div>

          {/* Document Status Controls */}
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <span className="text-sm font-medium text-gray-900">Document Status</span>
            <div className="space-x-2">
              <button
                onClick={() => onUpdateStatus('documents', 'approved')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={status.documentStatus === 'approved'}
              >
                Approve
              </button>
              <button
                onClick={() => onUpdateStatus('documents', 'rejected')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={status.documentStatus === 'rejected'}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Company Registration and EIN Section */}
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="space-y-4">
          {status.documentStatus === 'approved' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-900">Company Registration</span>
              </div>
              <button
                onClick={() => onUpdateStatus('company', 'registered')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={status.companyStatus === 'registered'}
              >
                Complete Registration
              </button>
            </div>
          )}

          {status.companyStatus === 'registered' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">EIN Status</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Enter EIN"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-32 sm:text-sm border-gray-300 rounded-md"
                  onChange={(e) => {
                    if (e.target.value.length === 10) {
                      onUpdateStatus('ein', 'issued', e.target.value);
                    }
                  }}
                  maxLength={10}
                  pattern="\d{2}-\d{7}"
                  disabled={status.einStatus === 'issued'}
                />
                <button
                  onClick={() => onUpdateStatus('ein', 'processing')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={status.einStatus !== 'pending'}
                >
                  Process EIN
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}